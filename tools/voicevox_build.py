"""Synthesize every text in tools/tts_texts.json with the VOICEVOX voice in tools/voice.json.
Output: audio/v<ID>/<key>.mp3 and audio/manifest.json. Incremental: existing files are kept."""
import json, os, pathlib, subprocess, sys, time, urllib.parse, urllib.request
from concurrent.futures import ThreadPoolExecutor
API = "http://127.0.0.1:50021"
ROOT = pathlib.Path(__file__).resolve().parent.parent
cfg = json.loads((ROOT / "tools/voice.json").read_text(encoding="utf-8"))
texts = json.loads((ROOT / "tools/tts_texts.json").read_text(encoding="utf-8"))
SID = int(cfg["id"]); OUT = ROOT / f"audio/v{SID}"; OUT.mkdir(parents=True, exist_ok=True)

def h32(s, seed):  # FNV-1a over UTF-16 code units, same as key() in index.html
    b = s.encode("utf-16-le"); h = seed & 0xFFFFFFFF
    for i in range(0, len(b), 2):
        h ^= b[i] | (b[i + 1] << 8); h = (h * 16777619) & 0xFFFFFFFF
    return f"{h:08x}"
def key(s): s = s.strip(); return h32(s, 2166136261) + h32(s, 0x9747B28C)

def call(path, data=None):
    req = urllib.request.Request(API + path, data=data if data is not None else None, method="POST" if data is not None else "GET")
    if data: req.add_header("Content-Type", "application/json")
    with urllib.request.urlopen(req, timeout=600) as r: return r.read()

for _ in range(150):
    try: print("engine", call("/version").decode(), flush=True); break
    except Exception: time.sleep(2)

def synth(t):
    k = key(t); fn = OUT / f"{k}.mp3"
    if fn.exists() and fn.stat().st_size > 500: return k, "skip"
    for attempt in range(3):
        try:
            q = json.loads(call(f"/audio_query?text={urllib.parse.quote(t)}&speaker={SID}", b""))
            q["speedScale"] = cfg.get("speed", 1.0); q["prePhonemeLength"] = 0.05; q["postPhonemeLength"] = 0.12
            q["intonationScale"] = cfg.get("intonation", 1.0)
            wav = call(f"/synthesis?speaker={SID}", json.dumps(q).encode())
            tmp = OUT / f"{k}.wav"; tmp.write_bytes(wav)
            subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(tmp), "-ac", "1", "-ar", "24000", "-b:a", "40k", str(fn)], check=True)
            tmp.unlink(); return k, "ok"
        except Exception as e:
            err = repr(e); time.sleep(2)
    return k, "FAIL " + err

def manifest(keys):
    m = {"id": SID, "name": cfg["name"], "credit": cfg["credit"], "keys": sorted(keys)}
    (ROOT / "audio/manifest.json").write_text(json.dumps(m, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")

def commit(msg):
    subprocess.run(["git", "add", "audio"], cwd=ROOT, check=True)
    if subprocess.run(["git", "diff", "--cached", "--quiet"], cwd=ROOT).returncode == 0: return
    subprocess.run(["git", "commit", "-q", "-m", msg], cwd=ROOT, check=True)
    subprocess.run(["git", "pull", "-q", "--rebase", "origin", "main"], cwd=ROOT, check=True)
    subprocess.run(["git", "push", "-q", "origin", "HEAD:main"], cwd=ROOT, check=True)

done, fails, n = [], 0, 0
with ThreadPoolExecutor(int(os.environ.get("VV_JOBS", "2"))) as ex:
    for k, st in ex.map(synth, texts):
        n += 1
        if st.startswith("FAIL"): fails += 1; print(st, flush=True)
        else: done.append(k)
        if n % 300 == 0:
            print(f"{n}/{len(texts)}", flush=True)
            if os.environ.get("VV_COMMIT"): manifest(done); commit(f"Voice audio: {n}/{len(texts)}")
manifest(done)
print(f"done {len(done)}/{len(texts)}, failed {fails}", flush=True)
if os.environ.get("VV_COMMIT"): commit(f"Voice audio: {cfg['credit']} ({len(done)} clips)")
