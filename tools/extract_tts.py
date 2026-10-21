"""Collect every Japanese string Shiori can read aloud -> tools/tts_texts.json.
Run after editing content (it reads the built data/content.json, so run tools/build_content.py first):
    python3 tools/build_content.py && python3 tools/extract_tts.py      (needs playwright + chromium)
Pushing a changed tools/tts_texts.json starts the VOICEVOX build on GitHub, which only renders new texts."""
import functools, http.server, json, pathlib, threading
from playwright.sync_api import sync_playwright
ROOT = pathlib.Path(__file__).resolve().parent.parent
JS = r"""async()=>{
 const out=new Set(), add=s=>{s=String(s||"").trim();if(s&&s.replace(/[「」『』、。！？…\s]/g,""))out.add(s)};
 const save=SENTS;
 for(const a of ARTICLES){SENTS=[];a.body.split(/\n\n/).forEach(p=>(a.letter?p.split("\n"):[p]).forEach(l=>renderPara(l,a)));SENTS.forEach(add);
   for(const m of a.body.matchAll(RX)){add(m[2]||m[4])}}
 for(const l of LESSONS){(l.lines||[]).forEach(x=>add(sayText(x[1])));(l.vocab||[]).forEach(v=>add(v[1]))}
 for(const c of STARTER){(c.w||[]).forEach(x=>add(x[1]))}
 for(const k in KEX){add(KEX[k][0])}
 for(const s of SEED){add(s[1]||s[0])}
 SENTS=save;
 S.set.onb=true;S.set.mode="begin";
 for(const sv of ["kana","starter","quiz"]){V.view="start";V.sv=sv;try{render()}catch(e){}
   document.querySelectorAll("[data-kana]").forEach(e=>add(e.dataset.kana));document.querySelectorAll("[data-say]").forEach(e=>add(e.dataset.say))}
 // katakana counterparts of tapped kana are spoken as-is; also add hiragana keys of KEX
 for(const k in KEX)add(k);
 add("こんにちは。栞へようこそ。今日も、少しずつ読んでいきましょう。");
 return [...out]}"""
# the page loads data/content.json with fetch(), which needs http:// (not file://)
class Quiet(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a): pass
srv = http.server.ThreadingHTTPServer(("127.0.0.1", 0), functools.partial(Quiet, directory=str(ROOT)))
threading.Thread(target=srv.serve_forever, daemon=True).start()
with sync_playwright() as p:
    b = p.chromium.launch(); pg = b.new_page()
    pg.goto(f"http://127.0.0.1:{srv.server_address[1]}/index.html")
    pg.wait_for_function("typeof render==='function'", timeout=30000)
    texts = pg.evaluate(JS); b.close()
srv.shutdown()
kata = lambda s: "".join(chr(ord(c) + 0x60) if 0x3041 <= ord(c) <= 0x3096 else c for c in s)
texts = sorted(set(texts) | {kata(x) for x in texts if len(x) <= 2 and all(0x3041 <= ord(c) <= 0x309F for c in x)})
(ROOT / "tools/tts_texts.json").write_text(json.dumps(texts, ensure_ascii=False, indent=0), encoding="utf-8")
print(len(texts), "texts,", sum(len(t) for t in texts), "chars")
