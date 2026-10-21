"""Bundle content/ into data/content.json, the one file the app loads.

Usage:   python3 tools/build_content.py           build data/content.json
         python3 tools/build_content.py --check   only validate, write nothing

Runs automatically on GitHub (.github/workflows/build-content.yml) whenever content/ changes,
so editing an article file and pushing is enough. No dependencies beyond Python 3.

Layout of content/ (see README for the article format):
  config.json                    start date of the daily cycle, order of library and 奇妙百科 articles
  genres.json                    genre labels in 简中 / EN / DE
  articles/library/<id>.json     permanent library articles
  articles/daily/d<N>.json       daily pieces, released on START + N days, then the cycle repeats
  articles/wiki/<id>.json        「世界真奇妙」 encyclopedia (N4 and N2 versions are separate articles)
  beginner/*.json                lessons, starter words, seed words, kana example words
"""
import json, pathlib, re, sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
C = ROOT / "content"
OUT = ROOT / "data" / "content.json"
LANGS = ("en", "de", "hans")  # translation languages; zh-Hant is the article's own gloss language
REQUIRED = ("id", "d", "lv", "genre", "title", "body", "gloss")
LEVELS = {"n5", "n4", "n3", "n2", "n1", "pro", "x"}
RX = re.compile(r"\[\[([^|\]]+)\|([^\]]+)\]\]")  # [[word|reading]] = word with a gloss

errors = []
def err(msg): errors.append(msg)
def load(p):
    try: return json.loads(p.read_text(encoding="utf-8"))
    except Exception as e: err(f"{p.relative_to(ROOT)}: not valid JSON ({e})"); return None

def check_article(a, path):
    where = path.relative_to(ROOT)
    for k in REQUIRED:
        if k not in a: err(f"{where}: missing field '{k}'")
    if a.get("id") != path.stem: err(f"{where}: id '{a.get('id')}' does not match the file name")
    if a.get("lv") not in LEVELS: err(f"{where}: unknown level '{a.get('lv')}' (use one of {sorted(LEVELS)})")
    gloss = a.get("gloss") or {}
    for m in RX.finditer(a.get("body", "")):
        if m.group(1) not in gloss: err(f"{where}: [[{m.group(1)}|…]] in the text has no entry in 'gloss'")

cfg = load(C / "config.json") or {}
def ordered(folder, ids):
    files = {p.stem: p for p in (C / "articles" / folder).glob("*.json")}
    for i in ids:
        if i not in files: err(f"content/config.json lists '{i}' but content/articles/{folder}/{i}.json does not exist")
    for i in files:
        if i not in ids: err(f"content/articles/{folder}/{i}.json is not listed in content/config.json → '{folder}'")
    return [files[i] for i in ids if i in files]

paths = ordered("library", cfg.get("library", []))
daily = sorted((C / "articles" / "daily").glob("*.json"), key=lambda p: (load(p) or {}).get("d", 1e9))
paths += daily + ordered("wiki", cfg.get("wiki", []))

articles, translations, paragraphs, seen = [], {l: {} for l in LANGS}, {}, set()
for p in paths:
    a = load(p)
    if a is None: continue
    check_article(a, p)
    if a.get("id") in seen: err(f"{p.relative_to(ROOT)}: duplicate id '{a.get('id')}'")
    seen.add(a.get("id"))
    for lang, v in (a.pop("translations", None) or {}).items():
        if lang not in translations: err(f"{p.relative_to(ROOT)}: unknown translation language '{lang}'"); continue
        translations[lang][a["id"]] = v
    if "paragraphs" in a: paragraphs[a["id"]] = a.pop("paragraphs")
    articles.append(a)

days = [a["d"] for a in articles if a.get("d", -1) >= 0]
if sorted(days) != list(range(len(days))): err(f"daily pieces should be numbered d0 … d{len(days)-1} without gaps")
if not re.fullmatch(r"\d{4}-\d{2}-\d{2}", str(cfg.get("start", ""))): err("content/config.json: 'start' must be a date like 2026-10-19")

B = C / "beginner"
bundle = {
    "start": cfg.get("start"),
    "articles": articles,
    "translations": translations,
    "paragraphs": paragraphs,
    "genres": load(C / "genres.json"),
    "lessons": load(B / "lessons.json"),
    "starter": load(B / "starter.json"),
    "seed": load(B / "seed-words.json"),
    "seedTranslations": load(B / "seed-translations.json"),
    "kana": load(B / "kana-examples.json"),
}

if errors:
    print("\n".join("✗ " + e for e in errors)); sys.exit(1)
print(f"✓ {len(articles)} articles ({len(cfg['library'])} library, {len(days)} daily, {len(cfg['wiki'])} 奇妙百科)")
if "--check" not in sys.argv:
    OUT.parent.mkdir(exist_ok=True)
    OUT.write_text(json.dumps(bundle, ensure_ascii=False, separators=(",", ":")) + "\n", encoding="utf-8")
    print(f"✓ wrote {OUT.relative_to(ROOT)} ({OUT.stat().st_size // 1024} KB)")
