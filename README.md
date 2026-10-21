# 栞 Shiori

日語閱讀與單字卡工具。釋義以繁體中文為主，也可切換简体中文／English／Deutsch。
一個純網頁應用（GitHub Pages），不需要伺服器，也不需要建置工具：Python 3 就夠了。

## 功能

- **每日一篇**：100 篇短文，從 2026/10/19 起每天開放一篇（配合節氣與節日），一輪結束後從頭再來；另有 13 篇常駐書庫。程度分 N3／N2／N1／上級＋／古典。
- **入門**：假名表（平假名／片假名）與假名練習、N5 入門課文、基礎單字與語法小貼士。
- **「世界真奇妙」百科**：10 個主題（酒、納豆、鰹節、狸、奈良鹿……），各有 N4 簡易版與 N2 完整版。
- **閱讀**：點底線詞看釋義，選取文字可加入單字本；振假名（全部／只標註詞／隱藏）；橫排／直排；段落翻譯（預設關閉，閱讀頁可開啟）。
- **朗讀**：整篇逐句朗讀（可調速度、目前句子反白）、單字與例句發音。優先使用預先生成的 VOICEVOX 語音（`audio/`），還沒生成的句子用裝置內建的日語語音代替。
- **單字本與記憶盒複習**。
- **介面語言**：繁體中文／简体中文／日本語／English／Deutsch；釋義語言可單獨設定。
- **同步**：在「設定」用電子郵件登入，可在多台裝置間同步單字本與進度（Supabase）。不登入的話，資料只存在這台裝置的瀏覽器裡，請用「設定 → 複製備份」定期備份。
- **離線**：第一次開啟後，沒有網路也能用（`sw.js`）。

## 檔案結構

```
index.html              頁面外殼：先載入 data/content.json，再載入 app.js
app.js                  程式本體（介面、閱讀、單字卡、朗讀、同步）
style.css               樣式（淺色／深色）
sw.js                   離線快取
manifest.webmanifest    加到主畫面用的設定與圖示

content/                ← 所有內容都在這裡，一篇文章一個檔案
  config.json             每日一篇的起始日，書庫與百科文章的排列順序
  genres.json             文章類別的简中／英／德名稱
  articles/library/       常駐書庫（13 篇）
  articles/daily/         每日一篇：d0.json … d99.json
  articles/wiki/          「世界真奇妙」百科（N4、N2 各一篇）
  beginner/               入門課文、基礎單字、預設單字卡、假名例詞

data/content.json       ← 由 content/ 自動產生，不要手動修改

tools/
  build_content.py        檢查 content/ 並打包成 data/content.json
  extract_tts.py          列出所有要朗讀的句子 → tools/tts_texts.json
  voicevox_build.py       用 VOICEVOX 把句子生成 mp3 → audio/v<聲音ID>/
  voice_samples.py        每個 VOICEVOX 聲音生成一段試聽（samples/、samples.html）
  voices.json             使用中的聲音與速度設定
  tts_texts.json          要朗讀的全部句子（由 extract_tts.py 產生）

audio/v118/             VOICEVOX 語音檔（檔名是句子的雜湊值）與 manifest.json
samples/, samples.html  挑選聲音用的試聽頁
.github/workflows/      自動化：打包內容、生成語音、生成試聽
```

## 修改或新增文章

一篇文章就是 `content/articles/` 底下的一個 JSON 檔，檔名等於文章的 `id`。

```json
{
  "id": "sento",
  "d": -1,
  "lv": "n3",
  "genre": { "zh-Hant": "日常", "ja": "くらし" },
  "title": "はじめての銭湯",
  "sub": "第一次去澡堂",
  "body": "近所に古い[[銭湯|せんとう]]がある。先週、はじめて行ってみた。\n\n…",
  "gloss": {
    "銭湯": { "m": "公共澡堂" },
    "気持ち": { "m": "心情、感覺", "n": "「気持ちがいい」＝很舒服。" }
  },
  "translations": {
    "en":   { "s": "My first sentō", "g": { "銭湯": ["public bathhouse"] } },
    "hans": { "s": "第一次去澡堂",   "g": { "銭湯": ["公共澡堂"] } },
    "de":   { "s": "…",              "g": { "銭湯": ["…"] } }
  },
  "paragraphs": [
    { "zh-Hant": "…", "zh-Hans": "…", "en": "…", "de": "…" }
  ]
}
```

| 欄位 | 說明 |
|---|---|
| `id` | 唯一名稱，等於檔名 |
| `d` | 每日一篇：第幾天（`0` 是 `content/config.json` 裡的 `start` 那天）。書庫和百科文章是 `-1` |
| `lv` | 程度：`n5` `n4` `n3` `n2` `n1` `pro`（上級＋）`x`（古典） |
| `genre` | 類別（繁中、日文）；简中／英／德名稱在 `content/genres.json` |
| `title`、`sub` | 日文標題、繁中副標題 |
| `src` | （選填）出處，例如原文作品 |
| `letter` | （選填）`true` 時每一行都分開排版，適合書信和詩 |
| `wiki` | （選填）`true` 表示是「世界真奇妙」百科文章 |
| `body` | 正文。段落之間空一行（`\n\n`）。`[[語|よみ]]` = 有釋義的詞（點了會出現說明），`{漢字|かんじ}` = 只標振假名 |
| `gloss` | 繁中釋義：`m` 意思，`n`（選填）補充說明 |
| `translations` | 副標題與釋義的英文（`en`）、简中（`hans`）、德文（`de`）版本 |
| `paragraphs` | （選填）段落翻譯，順序對應 `body` 的段落 |

**新增書庫或百科文章**時，也要把它的 `id` 加進 `content/config.json` 的 `library` 或 `wiki` 清單（清單順序就是在書庫裡的順序）。每日一篇不用，按 `d` 排序；但編號必須從 `d0` 連續到最後，中間不能跳號。

### 改完之後

直接推到 GitHub 就好：`.github/workflows/build-content.yml` 會自動檢查並重新產生 `data/content.json`，大約一分鐘後網頁就會更新。

想在自己電腦上先檢查：

```sh
python3 tools/build_content.py --check   # 只檢查，不寫檔
python3 tools/build_content.py           # 檢查並產生 data/content.json
python3 -m http.server                   # 開 http://localhost:8000 預覽
```

檢查會找出：JSON 格式錯誤、缺少欄位、`id` 和檔名不一致、正文裡的 `[[詞|讀音]]` 在 `gloss` 裡沒有釋義、`config.json` 和資料夾對不上、每日一篇編號跳號。

> 預覽一定要透過 `http://` 開啟；直接雙擊 `index.html`（`file://`）會讀不到 `data/content.json`。

## 語音（VOICEVOX）

新增或修改文章後，新句子要先生成語音才會用 VOICEVOX 朗讀（在那之前會用裝置內建語音）：

```sh
python3 tools/build_content.py
python3 tools/extract_tts.py             # 需要：pip install playwright && playwright install chromium
git add tools/tts_texts.json && git commit -m "New TTS texts" && git push
```

推上去後，`.github/workflows/voice-build.yml` 會在 GitHub 上啟動 VOICEVOX，只生成還沒有的句子，邊做邊提交到 `audio/v118/`（全部 2,979 句要好幾個小時）。

換聲音：先用 `voice-samples.yml` 生成試聽，在 `samples.html` 聽，選好後改 `tools/voices.json` 和 `voice-build.yml` 裡的聲音 ID。

## 上線

Settings → Pages → Deploy from a branch → `main` / `(root)` → Save。
網址：`https://<使用者名稱>.github.io/shiori/`

更新程式（`app.js`、`style.css`）時，`sw.js` 會在下次開啟時自動抓新版；如果改了 `sw.js` 本身的快取規則，記得把裡面的 `CACHE` 版本號加一。

## 致謝與授權

- 語音：VOICEVOX:夜語トバリ（依 VOICEVOX 及該角色的使用規約標示）
- 字型：Zen Old Mincho、Noto Serif JP、Noto Sans TC／JP（Google Fonts，SIL Open Font License）
- 古典與近代文學原文（芥川龍之介、夏目漱石、清少納言等）為公有領域作品
