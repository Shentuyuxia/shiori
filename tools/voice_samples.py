"""Generate one short sample per VOICEVOX voice so a voice can be chosen by ear."""
import json, os, subprocess, time, urllib.parse, urllib.request
API = "http://127.0.0.1:50021"
TEXT = "近所に古い銭湯がある。先週、はじめて行ってみた。入り口で料金を払うと、おばあさんが「タオルは持ってる？」と聞いてくれた。"
WANT = ("ノーマル", "ふつう", "読み聞かせ", "アナウンス", "落ち着き", "人間ver.")

def call(path, data=None, method="GET"):
    req = urllib.request.Request(API + path, data=data, method=method,
                                 headers={"Content-Type": "application/json"} if data else {})
    with urllib.request.urlopen(req, timeout=300) as r:
        return r.read()

for _ in range(120):
    try: call("/version"); break
    except Exception: time.sleep(2)

os.makedirs("samples", exist_ok=True)
out = []
for sp in json.loads(call("/speakers")):
    styles = [s for s in sp["styles"] if s.get("type", "talk") == "talk"]
    picked = [s for s in styles if s["name"] in WANT] or styles[:1]
    for st in picked:
        q = call(f"/audio_query?text={urllib.parse.quote(TEXT)}&speaker={st['id']}", b"", "POST")
        wav = call(f"/synthesis?speaker={st['id']}", q, "POST")
        open("/tmp/s.wav", "wb").write(wav)
        fn = f"samples/{st['id']}.mp3"
        subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", "/tmp/s.wav", "-ac", "1", "-b:a", "48k", fn], check=True)
        out.append({"id": st["id"], "speaker": sp["name"], "style": st["name"], "file": fn})
        print(st["id"], sp["name"], st["name"], flush=True)
json.dump({"text": TEXT, "voices": out}, open("samples/voices.json", "w"), ensure_ascii=False, indent=1)
