/* 栞 Shiori — app code.
   Content (articles, translations, beginner material) is NOT in this file:
   it lives in content/ and is bundled into data/content.json by tools/build_content.py.
   index.html loads data/content.json first, puts it on window.SHIORI_CONTENT, then loads this file. */

/* ---------- content (from data/content.json) ---------- */
const CONTENT=window.SHIORI_CONTENT;
const START=CONTENT.start;
const ARTICLES=CONTENT.articles;          // library, then daily pieces (by d), then 奇妙百科
const DAILY=ARTICLES.filter(a=>a.d>=0);  // a.d = day number counted from START
const dayIdx=()=>Math.max(0,Math.round((Date.parse(todayStr()+"T12:00:00")-Date.parse(START+"T12:00:00"))/864e5));
const todayPiece=()=>DAILY.length?DAILY[dayIdx()%DAILY.length]:null;
const released=a=>a.d<0||S.set.showAll||dayIdx()>=DAILY.length||a.d<=dayIdx();
const SEED=CONTENT.seed;
/* ---------- translations & beginner data ---------- */
const TR=CONTENT.translations;           // TR[lang][articleId] = {s: subtitle, g: glosses}
const SEED_TR=CONTENT.seedTranslations;
const GLAB=CONTENT.genres;
const LESSONS=CONTENT.lessons;
const STARTER=CONTENT.starter;
STARTER.forEach(c=>c.w.forEach(x=>{x.m=x[2]}));
const TRP=CONTENT.paragraphs;            // TRP[articleId] = [{lang: paragraph translation}, …]


/* ---------- i18n ---------- */
const I18N={
"zh-Hant":{sub:"日本語 · 繁體中文",tStart:"入門",tRead:"閱讀",tVocab:"單字本",tPrac:"練習",tSet:"設定",
todayEy:"今日一篇",libH:"書庫",libN:(a,b)=>`已開放 ${a} 篇，共 ${b} 篇`,newsH:"今天的新聞（外部網站）",readToday:"開始閱讀",wd:["日","一","二","三","四","五","六"],dateFmt:(m,d,w)=>`${m}月${d}日 星期${w}`,dayN:n=>`第 ${n} 篇`,showAll:"提前閱讀",showAllP:"顯示所有每日文章，包括還沒到日期的。",srcLab:"出處",readEy:"閱讀材料",readH:"今天讀一篇",readLede:"點有底線的詞看釋義；選取任何文字，可以直接加入單字本。",
lv:{all:"全部",n5:"N5 入門",n4:"N4 初級",n3:"N3 初中級",n2:"N2 中上級",n1:"N1 上級",pro:"上級＋ 母語者程度",x:"古典 超上級"},lvl:"閱讀程度",lvlP:"列表只顯示這個程度的文章。",lvlN:n=>`${n} 篇`,noArt:"這個程度還沒有文章。",doneMark:"已讀",back:"← 回到列表",
fg:"振假名",fgAll:"全部",fgAnnot:"只標註詞",fgNone:"隱藏",dirLab:"排版",hor:"橫排",ver:"直排",
tip:"小提示：在直排模式左右滑動閱讀。",markRead:"標記為已讀",markedRead:"已讀 ✓",
add:"加入單字本",added:"已在單字本",addSel:s=>`＋ 加入「${s}」`,
word:"單字",reading:"讀音",meaning:"意思",example:"例句",note:"備註",source:"來源",save:"儲存",cancel:"取消",
vocabEy:"單字本",vocabH:n=>`${n} 個單字`,search:"搜尋單字或意思",newWord:"新增單字",
seed:"範例",del:"刪除",delSure:"確定刪除？",due:"今天複習",box:n=>`第 ${n} 盒`,noWords:"還沒有單字。先去讀一篇，點詞加入吧。",noMatch:"找不到符合的單字。",
pracEy:"練習",pracH:"今天的複習",today:"今日進度",dueNow:"待複習",streak:"連續天數",days:n=>`${n} 天`,
boxes:"記憶盒分布",boxLab:n=>n===0?"新卡":`盒 ${n}`,start:"開始練習",tapFlip:"點卡片翻面",
again:"再一次",hard:"有點難",good:"記得",later:{again:"馬上",hard:"1 天後",good:d=>`${d} 天後`},
nothing:"今天沒有要複習的卡片。",nothing2:"可以去閱讀，加入新的單字。",doneH:"今天完成了",doneP:n=>`複習了 ${n} 張卡片。`,
left:(a,b)=>`${a} / ${b}`,
setEy:"設定",setH:"語言與閱讀",ui:"介面語言",uiP:"按鈕和說明的語言。",
fgP:"閱讀時漢字上方的假名。",size:"閱讀字級",dir:"出題方向",dirP:"卡片正面顯示什麼。",
j2z:"日→中",z2j:"中→日",mix:"混合",goal:"每日目標",goalP:"每天複習幾張卡片。",cards:n=>`${n} 張`,
data:"資料",dataP:"單字只存在這個瀏覽器裡。換手機或清除瀏覽紀錄前，請先匯出備份。",
exp:"複製備份",imp:"匯入備份",impPh:"把備份文字貼在這裡",rmSeed:"移除範例卡",
copied:"已複製",copyFail:"無法自動複製，請手動全選複製。",imported:n=>`已匯入 ${n} 個單字`,badImport:"格式不對，請貼上完整的備份文字。",
savedT:"已加入單字本",listen:"朗讀全文",pause:"暫停",resume:"繼續",stop:"停止",speed:"朗讀速度",speedP:"整篇朗讀與單字發音的語速。",voice:"日語語音",voiceP:"使用這台裝置內建的日語語音。",vvNote:c=>`文章與單字已預先錄好真人感語音（${c}）。沒錄到的內容會改用裝置語音。`,tryV:"試聽",vHelp:"怎樣讓聲音更自然？",vTips:"帶 ★ 的是高音質語音，「自動」會優先選它們。聲音好不好，取決於裝置裡裝了哪些語音：<ul><li><b>iPhone / iPad</b>：設定 → 輔助使用 → 語音內容 → 聲音 → 日文，下載「Kyoko（增強）」或「Otoya（增強）」。（Siri 的聲音網頁用不了。）</li><li><b>Mac</b>：系統設定 → 輔助使用 → 語音內容 → 系統聲音 → 管理聲音 → 日文，勾選增強版或高品質版。</li><li><b>電腦（Windows / Mac）</b>：用 Microsoft Edge 開啟本頁，會出現「Nanami Online (Natural)」等神經網路語音，最接近真人。</li><li><b>Android</b>：設定 → 系統 → 語言 → 文字轉語音輸出 → Google 語音服務 → 安裝日文語音資料（選高品質）。</li></ul>下載完重新開啟本頁，清單才會更新。",auto:"自動",autoSay:"翻卡時自動發音",autoSayP:"練習時翻到背面就唸出單字。",on:"開",off:"關",sayLine:"朗讀這句",fromHere:"從這句開始朗讀",say:"發音",noVoice:"這台裝置找不到日語語音。iPhone 可到「設定 → 輔助使用 → 朗讀內容 → 聲音 → 日文」下載。",noTTS:"這個瀏覽器不支援朗讀。",removedSeed:"已移除範例卡",needWord:"請至少填寫單字和意思。",
glLab:"釋義語言",glP:"單字意思和課文翻譯用哪種語言。",romaji:"羅馬拼音",romajiP:"在假名旁顯示拼音，適合剛開始學的人。",
welH:"歡迎來到栞",welP:"先選你習慣的語言，再選日文程度。之後都可以在「設定」裡改。",welLang:"你想用哪種語言學？",welLvl:"你的日文程度",lvBegin:"完全零基礎",lvBeginP:"從假名開始，一步一步來",lvRead:"已經能讀日文",lvReadP:"直接看每日一篇",welGo:"開始",
stEy:"入門",stH:"從零開始學日文",stLede:"四個步驟：認識假名 → 測驗假名 → 讀短課文 → 每天複習單字。",
kanaH:"五十音表",kanaP:"日文有三種文字：平假名、片假名和漢字。先學平假名，片假名多用在外來語。點一下就能聽發音。",kanaTip:"小「っ」表示停頓一拍；片假名的「ー」把前一個音拉長。",
hira:"平假名",kata:"片假名",basic:"清音",daku:"濁音・半濁音",yoon:"拗音",
quizH:"假名測驗",quizP:"看假名選拼音，一輪 10 題。答對三次以上就算熟悉。",qSet:"範圍",qDir:"題型",qBasic:"清音",qDaku:"＋濁音",qYoon:"＋拗音",k2r:"假名 → 拼音",r2k:"拼音 → 假名",qStart:"開始測驗",qRight:"答對了！",qWrong:s=>`正確答案是「${s}」`,qNext:"下一題",qDoneH:"測驗完成",qDone:(a,b)=>`答對 ${a} / ${b} 題`,qAgain:"再測一次",mastered:(a,b)=>`已熟悉 ${a} / ${b}`,
lesH:"課文",lesP:"十二篇很短的對話與短文，全部附讀音、拼音和翻譯。點有底線的詞看意思。",lessonN:n=>`第 ${n} 課`,lesGoal:"這課學什麼",lesVocab:"本課單字",lesGram:"文法重點",addAll:"全部加入單字本",addedN:n=>`已加入 ${n} 個單字`,allIn:"都在單字本裡了",showTr:"翻譯",lesDone:"學完了 ✓",lesMark:"標記為學完",lesProg:(a,b)=>`已學完 ${a} / ${b} 課`,
starterH:"基礎單字",starterP:"按主題加入單字本，就會出現在「練習」裡，每天複習。",wordsN:n=>`${n} 個字`,back2:"← 回到入門",open:"打開 →",
step:n=>`第 ${n} 步`,beginNote:"這裡的文章是中級以上。如果你是零基礎，建議先從「入門」開始。",toStart:"去入門 →",wikiLab:"百科",easyH:"簡單讀物",easyP:"學完課文以後，可以讀這些 N4 小百科。每篇都有完整版（N2），也都附逐段翻譯。",trOn:"翻譯",wikiH:"奇妙百科",wikiP:"酒怎麼釀、納豆為什麼牽絲、鮭魚怎麼找到回家的河……每個主題都有 N4 簡單版和 N2 完整版。",beginNote2:"想讀簡單一點的？選「N4」或「百科」。"},
"ja":{sub:"日本語 · 繁體中文",tStart:"入門",tRead:"読む",tVocab:"単語帳",tPrac:"練習",tSet:"設定",
todayEy:"今日の一編",libH:"書庫",libN:(a,b)=>`公開済み ${a} 編／全 ${b} 編`,newsH:"今日のニュース（外部サイト）",readToday:"読む",wd:["日","月","火","水","木","金","土"],dateFmt:(m,d,w)=>`${m}月${d}日（${w}）`,dayN:n=>`第 ${n} 編`,showAll:"先読み",showAllP:"日付前の毎日の文章もすべて表示します。",srcLab:"出典",readEy:"読みもの",readH:"今日の一編",readLede:"下線の語をタップすると意味が出ます。文字を選択すれば、そのまま単語帳に追加できます。",
lv:{all:"全て",n5:"N5 入門",n4:"N4 初級",n3:"N3 初中級",n2:"N2 中上級",n1:"N1 上級",pro:"上級＋ ネイティブ級",x:"古典 超上級"},lvl:"読解レベル",lvlP:"一覧にはこのレベルの文章だけを表示します。",lvlN:n=>`${n} 編`,noArt:"このレベルの文章はまだありません。",doneMark:"読了",back:"← 一覧へ",
fg:"ふりがな",fgAll:"全て",fgAnnot:"注釈語のみ",fgNone:"非表示",dirLab:"組み方",hor:"横書き",ver:"縦書き",
tip:"縦書きは左右にスクロールして読めます。",markRead:"読了にする",markedRead:"読了 ✓",
add:"単語帳に追加",added:"追加済み",addSel:s=>`＋「${s}」を追加`,
word:"単語",reading:"読み",meaning:"意味",example:"例文",note:"メモ",source:"出典",save:"保存",cancel:"キャンセル",
vocabEy:"単語帳",vocabH:n=>`${n} 語`,search:"単語や意味で検索",newWord:"単語を追加",
seed:"サンプル",del:"削除",delSure:"本当に削除？",due:"今日復習",box:n=>`${n} 番の箱`,noWords:"まだ単語がありません。読みものから追加してみましょう。",noMatch:"該当する単語がありません。",
pracEy:"練習",pracH:"今日の復習",today:"今日の進み具合",dueNow:"復習待ち",streak:"連続日数",days:n=>`${n} 日`,
boxes:"箱ごとの枚数",boxLab:n=>n===0?"新規":`箱 ${n}`,start:"練習を始める",tapFlip:"タップして裏返す",
again:"もう一度",hard:"難しい",good:"覚えた",later:{again:"すぐ",hard:"1 日後",good:d=>`${d} 日後`},
nothing:"今日の復習はありません。",nothing2:"読みものから新しい単語を追加しましょう。",doneH:"今日の分、完了",doneP:n=>`${n} 枚を復習しました。`,
left:(a,b)=>`${a} / ${b}`,
setEy:"設定",setH:"言語と表示",ui:"表示言語",uiP:"ボタンや説明の言語。",
fgP:"漢字の上に表示する読み。",size:"文字サイズ",dir:"出題方向",dirP:"カードの表に出すもの。",
j2z:"日→意味",z2j:"意味→日",mix:"ランダム",goal:"1日の目標",goalP:"1日に復習する枚数。",cards:n=>`${n} 枚`,
data:"データ",dataP:"単語はこのブラウザ内にだけ保存されます。機種変更や履歴削除の前にバックアップしてください。",
exp:"バックアップをコピー",imp:"バックアップを読み込む",impPh:"ここにバックアップを貼り付け",rmSeed:"サンプルを削除",
copied:"コピーしました",copyFail:"自動コピーできません。全選択してコピーしてください。",imported:n=>`${n} 語を読み込みました`,badImport:"形式が正しくありません。バックアップ全文を貼り付けてください。",
savedT:"単語帳に追加しました",listen:"全文を読み上げ",pause:"一時停止",resume:"再開",stop:"停止",speed:"読み上げ速度",speedP:"全文の読み上げと単語の発音の速さ。",voice:"日本語の音声",voiceP:"この端末に入っている日本語音声を使います。",vvNote:c=>`読みものと単語は、あらかじめ録音した自然な音声（${c}）で再生します。録音のない部分は端末の音声を使います。`,tryV:"試聴",vHelp:"もっと自然な声にするには？",vTips:"★ は高品質の音声で、「自動」ではこちらが優先されます。声の質は端末に入っている音声で決まります：<ul><li><b>iPhone / iPad</b>：設定 → アクセシビリティ → 読み上げコンテンツ → 声 → 日本語 で「Kyoko（拡張）」や「Otoya（拡張）」をダウンロード。（Siri の声はウェブでは使えません。）</li><li><b>Mac</b>：システム設定 → アクセシビリティ → 読み上げコンテンツ → システムの声 → 声を管理 → 日本語 で拡張版・高品質版を選択。</li><li><b>パソコン（Windows / Mac）</b>：Microsoft Edge で開くと「Nanami Online (Natural)」などのニューラル音声が使え、いちばん自然です。</li><li><b>Android</b>：設定 → システム → 言語 → テキスト読み上げの出力 → Google の音声サービス → 日本語の音声データ（高品質）をインストール。</li></ul>ダウンロード後、このページを開き直すと一覧に出てきます。",auto:"自動",autoSay:"めくると自動で発音",autoSayP:"練習でカードを裏返すと単語を読み上げます。",on:"オン",off:"オフ",sayLine:"この文を読む",fromHere:"ここから読み上げ",say:"発音",noVoice:"日本語の音声が見つかりません。iPhone は「設定 → アクセシビリティ → 読み上げコンテンツ → 声 → 日本語」で追加できます。",noTTS:"このブラウザは読み上げに対応していません。",removedSeed:"サンプルを削除しました",needWord:"単語と意味は必須です。",
glLab:"訳の言語",glP:"単語の意味や課文の訳を表示する言語。",romaji:"ローマ字",romajiP:"かなの横にローマ字を表示します（初心者向け）。",
welH:"栞へようこそ",welP:"使う言語と日本語のレベルを選んでください。あとで「設定」から変えられます。",welLang:"どの言語で学びますか？",welLvl:"日本語のレベル",lvBegin:"まったくの初心者",lvBeginP:"かなから一歩ずつ",lvRead:"日本語が読める",lvReadP:"毎日の一編から",welGo:"はじめる",
stEy:"入門",stH:"ゼロからの日本語",stLede:"四つのステップ：かなを知る → かなテスト → 短い課文 → 毎日の単語復習。",
kanaH:"五十音表",kanaP:"日本語にはひらがな・カタカナ・漢字の三つの文字があります。まずはひらがなから。タップすると発音が聞けます。",kanaTip:"小さい「っ」は一拍つまる音、カタカナの「ー」は前の音をのばします。",
hira:"ひらがな",kata:"カタカナ",basic:"清音",daku:"濁音・半濁音",yoon:"拗音",
quizH:"かなテスト",quizP:"かなを見てローマ字を選びます。1回10問、3回以上正解で「覚えた」。",qSet:"範囲",qDir:"形式",qBasic:"清音",qDaku:"＋濁音",qYoon:"＋拗音",k2r:"かな → ローマ字",r2k:"ローマ字 → かな",qStart:"テスト開始",qRight:"正解！",qWrong:s=>`正解は「${s}」`,qNext:"次へ",qDoneH:"テスト終了",qDone:(a,b)=>`${b} 問中 ${a} 問正解`,qAgain:"もう一回",mastered:(a,b)=>`覚えた ${a} / ${b}`,
lesH:"課文",lesP:"短い会話と文章が12課。読み・ローマ字・訳つき。下線の語をタップすると意味が出ます。",lessonN:n=>`第 ${n} 課`,lesGoal:"この課で学ぶこと",lesVocab:"この課の単語",lesGram:"文法ポイント",addAll:"全部単語帳に追加",addedN:n=>`${n} 語を追加しました`,allIn:"全部追加済み",showTr:"訳",lesDone:"学習済み ✓",lesMark:"学習済みにする",lesProg:(a,b)=>`${b} 課中 ${a} 課完了`,
starterH:"基本単語",starterP:"テーマごとに単語帳へ追加すると、「練習」で毎日復習できます。",wordsN:n=>`${n} 語`,back2:"← 入門へ",open:"開く →",
step:n=>`ステップ ${n}`,beginNote:"ここの文章は中級以上です。初めての方は「入門」からどうぞ。",toStart:"入門へ →",wikiLab:"百科",easyH:"やさしい読みもの",easyP:"課文が終わったら、N4 のミニ百科へ。どれも N2 の完全版があり、段落ごとの訳つきです。",trOn:"訳",wikiH:"ふしぎ百科",wikiP:"お酒の造り方、納豆の糸、鮭が川に帰るわけ……どのテーマにも N4 のやさしい版と N2 の完全版があります。",beginNote2:"やさしい文章なら「N4」か「百科」を選んでください。"},
"en":{sub:"Japanese reader",tStart:"Start",tRead:"Read",tVocab:"Words",tPrac:"Review",tSet:"Settings",
todayEy:"Today's piece",libH:"Library",libN:(a,b)=>`${a} of ${b} pieces available`,newsH:"Today's news (external sites)",readToday:"Start reading",wd:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],dateFmt:(m,d,w)=>`${w}, ${["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][m-1]} ${d}`,dayN:n=>`No. ${n}`,showAll:"Read ahead",showAllP:"Show all daily pieces, including future ones.",srcLab:"Source",readEy:"Reading",readH:"Read one piece today",readLede:"Tap underlined words for meanings; select any text to add it to your words.",
lv:{all:"All",n5:"N5 Beginner",n4:"N4 Elementary",n3:"N3 Lower-intermediate",n2:"N2 Upper-intermediate",n1:"N1 Advanced",pro:"Advanced+ near-native",x:"Classical"},lvl:"Reading level",lvlP:"Only show pieces at this level.",lvlN:n=>`${n} pieces`,noArt:"No pieces at this level yet.",doneMark:"Read",back:"← Back to list",
fg:"Furigana",fgAll:"All",fgAnnot:"Glossed only",fgNone:"Hide",dirLab:"Layout",hor:"Horizontal",ver:"Vertical",
tip:"Tip: swipe sideways to read vertical text.",markRead:"Mark as read",markedRead:"Read ✓",
add:"Add to words",added:"Already saved",addSel:s=>`+ Add “${s}”`,
word:"Word",reading:"Reading",meaning:"Meaning",example:"Example",note:"Note",source:"Source",save:"Save",cancel:"Cancel",
vocabEy:"Words",vocabH:n=>`${n} words`,search:"Search words or meanings",newWord:"Add word",
seed:"Sample",del:"Delete",delSure:"Delete?",due:"Due today",box:n=>`Box ${n}`,noWords:"No words yet. Read something and tap words to add them.",noMatch:"No matching words.",
pracEy:"Review",pracH:"Today's review",today:"Today",dueNow:"Due",streak:"Streak",days:n=>`${n} days`,
boxes:"Cards per box",boxLab:n=>n===0?"New":`Box ${n}`,start:"Start review",tapFlip:"Tap to flip",
again:"Again",hard:"Hard",good:"Got it",later:{again:"now",hard:"in 1 day",good:d=>`in ${d} days`},
nothing:"Nothing to review today.",nothing2:"Read a piece or a lesson and add new words.",doneH:"Done for today",doneP:n=>`You reviewed ${n} cards.`,
left:(a,b)=>`${a} / ${b}`,
setEy:"Settings",setH:"Language & reading",ui:"Interface language",uiP:"Language of buttons and explanations.",
fgP:"Kana readings above kanji.",size:"Text size",dir:"Card direction",dirP:"What the front of the card shows.",
j2z:"JP → meaning",z2j:"meaning → JP",mix:"Mixed",goal:"Daily goal",goalP:"Cards to review per day.",cards:n=>`${n} cards`,
data:"Data",dataP:"Your words are stored only in this browser. Export a backup before switching phones or clearing your history.",
exp:"Copy backup",imp:"Import backup",impPh:"Paste backup text here",rmSeed:"Remove sample cards",
copied:"Copied",copyFail:"Couldn't copy automatically — select all and copy by hand.",imported:n=>`Imported ${n} words`,badImport:"Wrong format — paste the complete backup text.",
savedT:"Added to your words",listen:"Read aloud",pause:"Pause",resume:"Resume",stop:"Stop",speed:"Speech speed",speedP:"Speed for reading aloud and word pronunciation.",voice:"Japanese voice",voiceP:"Uses the Japanese voice built into this device.",vvNote:c=>`Articles and words play pre-recorded natural audio (${c}). Anything not recorded uses this device's voice.`,tryV:"Try",vHelp:"How to get a more natural voice",vTips:"Voices marked ★ are high quality, and “Auto” prefers them. How good it sounds depends on which voices your device has installed:<ul><li><b>iPhone / iPad</b>: Settings → Accessibility → Spoken Content → Voices → Japanese, download “Kyoko (Enhanced)” or “Otoya (Enhanced)”. (Siri voices are not available to websites.)</li><li><b>Mac</b>: System Settings → Accessibility → Spoken Content → System Voice → Manage Voices → Japanese, tick an Enhanced or Premium voice.</li><li><b>Computer (Windows / Mac)</b>: open this page in Microsoft Edge to get neural voices such as “Nanami Online (Natural)”, the most natural option.</li><li><b>Android</b>: Settings → System → Languages → Text-to-speech output → Speech Services by Google → install Japanese voice data (high quality).</li></ul>After downloading, reopen this page so the list updates.",auto:"Auto",autoSay:"Speak when flipping",autoSayP:"Say the word when a card is flipped.",on:"On",off:"Off",sayLine:"Read this sentence",fromHere:"Read from here",say:"Pronounce",noVoice:"No Japanese voice on this device. On iPhone: Settings → Accessibility → Spoken Content → Voices → Japanese.",noTTS:"This browser doesn't support speech.",removedSeed:"Sample cards removed",needWord:"Please fill in at least the word and meaning.",
glLab:"Meaning language",glP:"Language for word meanings and lesson translations.",romaji:"Romaji",romajiP:"Show Latin spelling next to kana — helpful when starting out.",
welH:"Welcome to Shiori",welP:"Pick your language, then your Japanese level. You can change both later in Settings.",welLang:"Which language do you want to learn with?",welLvl:"Your Japanese level",lvBegin:"Complete beginner",lvBeginP:"Start with kana, step by step",lvRead:"I can read Japanese",lvReadP:"Go straight to the daily piece",welGo:"Let's go",
stEy:"Start",stH:"Japanese from zero",stLede:"Four steps: meet the kana → test yourself → read short lessons → review words every day.",
kanaH:"Kana chart",kanaP:"Japanese uses three scripts: hiragana, katakana and kanji. Start with hiragana; katakana is mostly for loanwords. Tap any kana to hear it.",kanaTip:"A small っ means a short pause (double consonant); in katakana, ー lengthens the previous sound.",
hira:"Hiragana",kata:"Katakana",basic:"Basic",daku:"Voiced (゛゜)",yoon:"Combined (ゃゅょ)",
quizH:"Kana quiz",quizP:"See a kana, pick its romaji. 10 questions per round; three correct answers and it counts as learned.",qSet:"Range",qDir:"Type",qBasic:"Basic",qDaku:"+ voiced",qYoon:"+ combined",k2r:"Kana → romaji",r2k:"Romaji → kana",qStart:"Start quiz",qRight:"Correct!",qWrong:s=>`The answer is “${s}”`,qNext:"Next",qDoneH:"Quiz finished",qDone:(a,b)=>`${a} of ${b} correct`,qAgain:"Try again",mastered:(a,b)=>`Learned ${a} / ${b}`,
lesH:"Lessons",lesP:"Twelve short dialogues and texts, all with readings, romaji and translations. Tap underlined words for their meaning.",lessonN:n=>`Lesson ${n}`,lesGoal:"In this lesson",lesVocab:"Words in this lesson",lesGram:"Grammar points",addAll:"Add all to words",addedN:n=>`Added ${n} words`,allIn:"All already saved",showTr:"Translation",lesDone:"Done ✓",lesMark:"Mark as done",lesProg:(a,b)=>`${a} of ${b} lessons done`,
starterH:"Starter words",starterP:"Add words by topic and they'll show up in Review every day.",wordsN:n=>`${n} words`,back2:"← Back to Start",open:"Open →",
step:n=>`Step ${n}`,beginNote:"These pieces are intermediate and above. If you're new to Japanese, begin with Start.",toStart:"Go to Start →",wikiLab:"Wonders",easyH:"Easy reading",easyP:"After the lessons, try these short N4 encyclopedia pieces. Each has a full N2 version, and both come with paragraph translations.",trOn:"Translation",wikiH:"Wonders of Japan",wikiP:"How sake is brewed, why natto is stringy, how salmon find their way home… Every topic has an easy N4 version and a full N2 version.",beginNote2:"Looking for something easier? Pick N4 or Wonders."},
"de":{sub:"Japanisch lesen",tStart:"Start",tRead:"Lesen",tVocab:"Wörter",tPrac:"Üben",tSet:"Einstellungen",
todayEy:"Text des Tages",libH:"Bibliothek",libN:(a,b)=>`${a} von ${b} Texten verfügbar`,newsH:"Heutige Nachrichten (externe Seiten)",readToday:"Lesen",wd:["So","Mo","Di","Mi","Do","Fr","Sa"],dateFmt:(m,d,w)=>`${w}, ${d}. ${["Jan.","Feb.","März","Apr.","Mai","Juni","Juli","Aug.","Sep.","Okt.","Nov.","Dez."][m-1]}`,dayN:n=>`Nr. ${n}`,showAll:"Vorauslesen",showAllP:"Alle Tagestexte anzeigen, auch künftige.",srcLab:"Quelle",readEy:"Lesestoff",readH:"Heute einen Text lesen",readLede:"Unterstrichene Wörter antippen für die Bedeutung; markierten Text direkt zu deinen Wörtern hinzufügen.",
lv:{all:"Alle",n5:"N5 Einstieg",n4:"N4 Grundstufe",n3:"N3 Untere Mittelstufe",n2:"N2 Obere Mittelstufe",n1:"N1 Fortgeschritten",pro:"Fortgeschritten+ fast muttersprachlich",x:"Klassisch"},lvl:"Lesestufe",lvlP:"Nur Texte dieser Stufe anzeigen.",lvlN:n=>`${n} Texte`,noArt:"Für diese Stufe gibt es noch keine Texte.",doneMark:"Gelesen",back:"← Zur Liste",
fg:"Furigana",fgAll:"Alle",fgAnnot:"Nur erklärte Wörter",fgNone:"Aus",dirLab:"Satz",hor:"Waagerecht",ver:"Senkrecht",
tip:"Tipp: Senkrechten Text seitlich wischen.",markRead:"Als gelesen markieren",markedRead:"Gelesen ✓",
add:"Zu Wörtern hinzufügen",added:"Schon gespeichert",addSel:s=>`+ „${s}“ hinzufügen`,
word:"Wort",reading:"Lesung",meaning:"Bedeutung",example:"Beispiel",note:"Notiz",source:"Quelle",save:"Speichern",cancel:"Abbrechen",
vocabEy:"Wörter",vocabH:n=>`${n} Wörter`,search:"Wörter oder Bedeutungen suchen",newWord:"Wort hinzufügen",
seed:"Beispiel",del:"Löschen",delSure:"Wirklich löschen?",due:"Heute fällig",box:n=>`Fach ${n}`,noWords:"Noch keine Wörter. Lies etwas und tippe Wörter an, um sie zu speichern.",noMatch:"Keine passenden Wörter.",
pracEy:"Üben",pracH:"Heutige Wiederholung",today:"Heute",dueNow:"Fällig",streak:"Serie",days:n=>`${n} Tage`,
boxes:"Karten pro Fach",boxLab:n=>n===0?"Neu":`Fach ${n}`,start:"Üben starten",tapFlip:"Antippen zum Umdrehen",
again:"Nochmal",hard:"Schwer",good:"Gewusst",later:{again:"sofort",hard:"in 1 Tag",good:d=>`in ${d} Tagen`},
nothing:"Heute ist nichts fällig.",nothing2:"Lies einen Text oder eine Lektion und füge neue Wörter hinzu.",doneH:"Für heute geschafft",doneP:n=>`Du hast ${n} Karten wiederholt.`,
left:(a,b)=>`${a} / ${b}`,
setEy:"Einstellungen",setH:"Sprache & Lesen",ui:"Sprache der Oberfläche",uiP:"Sprache von Knöpfen und Erklärungen.",
fgP:"Kana-Lesungen über den Kanji.",size:"Schriftgröße",dir:"Abfragerichtung",dirP:"Was auf der Vorderseite der Karte steht.",
j2z:"JP → Bedeutung",z2j:"Bedeutung → JP",mix:"Gemischt",goal:"Tagesziel",goalP:"Karten pro Tag.",cards:n=>`${n} Karten`,
data:"Daten",dataP:"Deine Wörter liegen nur in diesem Browser. Vor einem Handywechsel oder dem Löschen des Verlaufs bitte ein Backup exportieren.",
exp:"Backup kopieren",imp:"Backup importieren",impPh:"Backup-Text hier einfügen",rmSeed:"Beispielkarten entfernen",
copied:"Kopiert",copyFail:"Automatisches Kopieren ging nicht – bitte alles markieren und kopieren.",imported:n=>`${n} Wörter importiert`,badImport:"Falsches Format – bitte den vollständigen Backup-Text einfügen.",
savedT:"Zu deinen Wörtern hinzugefügt",listen:"Vorlesen",pause:"Pause",resume:"Weiter",stop:"Stopp",speed:"Sprechtempo",speedP:"Tempo beim Vorlesen und bei der Aussprache.",voice:"Japanische Stimme",voiceP:"Nutzt die japanische Stimme dieses Geräts.",vvNote:c=>`Texte und Wörter werden mit vorab erzeugter, natürlicher Sprache abgespielt (${c}). Alles andere nutzt die Gerätestimme.`,tryV:"Anhören",vHelp:"So klingt die Stimme natürlicher",vTips:"Mit ★ markierte Stimmen haben hohe Qualität, „Automatisch“ wählt sie bevorzugt. Wie gut es klingt, hängt von den installierten Stimmen ab:<ul><li><b>iPhone / iPad</b>: Einstellungen → Bedienungshilfen → Gesprochene Inhalte → Stimmen → Japanisch, „Kyoko (Erweitert)“ oder „Otoya (Erweitert)“ laden. (Siri-Stimmen sind für Websites nicht verfügbar.)</li><li><b>Mac</b>: Systemeinstellungen → Bedienungshilfen → Gesprochene Inhalte → Systemstimme → Stimmen verwalten → Japanisch, eine erweiterte oder Premium-Stimme wählen.</li><li><b>Computer (Windows / Mac)</b>: Seite in Microsoft Edge öffnen – dort gibt es neuronale Stimmen wie „Nanami Online (Natural)“, die natürlichste Variante.</li><li><b>Android</b>: Einstellungen → System → Sprachen → Sprachausgabe → Sprachdienste von Google → japanische Sprachdaten (hohe Qualität) installieren.</li></ul>Nach dem Download die Seite neu öffnen, damit die Liste aktualisiert wird.",auto:"Automatisch",autoSay:"Beim Umdrehen sprechen",autoSayP:"Das Wort wird vorgelesen, sobald die Karte umgedreht ist.",on:"An",off:"Aus",sayLine:"Diesen Satz vorlesen",fromHere:"Ab hier vorlesen",say:"Aussprechen",noVoice:"Keine japanische Stimme auf diesem Gerät. iPhone: Einstellungen → Bedienungshilfen → Gesprochene Inhalte → Stimmen → Japanisch.",noTTS:"Dieser Browser unterstützt keine Sprachausgabe.",removedSeed:"Beispielkarten entfernt",needWord:"Bitte mindestens Wort und Bedeutung ausfüllen.",
glLab:"Sprache der Bedeutungen",glP:"Sprache für Wortbedeutungen und Übersetzungen der Lektionen.",romaji:"Rōmaji",romajiP:"Lateinische Umschrift neben den Kana anzeigen – hilfreich am Anfang.",
welH:"Willkommen bei Shiori",welP:"Wähle deine Sprache und dein Japanisch-Niveau. Beides lässt sich später in den Einstellungen ändern.",welLang:"In welcher Sprache möchtest du lernen?",welLvl:"Dein Japanisch-Niveau",lvBegin:"Absolute(r) Anfänger(in)",lvBeginP:"Mit den Kana beginnen, Schritt für Schritt",lvRead:"Ich kann Japanisch lesen",lvReadP:"Direkt zum Text des Tages",welGo:"Los geht's",
stEy:"Start",stH:"Japanisch von null",stLede:"Vier Schritte: Kana kennenlernen → Kana testen → kurze Lektionen lesen → täglich Wörter wiederholen.",
kanaH:"Kana-Tabelle",kanaP:"Japanisch hat drei Schriften: Hiragana, Katakana und Kanji. Fang mit Hiragana an; Katakana steht vor allem für Lehnwörter. Tippe ein Kana an, um es zu hören.",kanaTip:"Ein kleines っ ist eine kurze Pause (Doppelkonsonant); in Katakana verlängert ー den vorigen Laut.",
hira:"Hiragana",kata:"Katakana",basic:"Grundzeichen",daku:"Stimmhaft (゛゜)",yoon:"Kombiniert (ゃゅょ)",
quizH:"Kana-Test",quizP:"Kana sehen, Rōmaji wählen. 10 Fragen pro Runde; nach drei richtigen Antworten gilt ein Zeichen als gelernt.",qSet:"Umfang",qDir:"Art",qBasic:"Grundzeichen",qDaku:"+ stimmhaft",qYoon:"+ kombiniert",k2r:"Kana → Rōmaji",r2k:"Rōmaji → Kana",qStart:"Test starten",qRight:"Richtig!",qWrong:s=>`Richtig wäre „${s}“`,qNext:"Weiter",qDoneH:"Test beendet",qDone:(a,b)=>`${a} von ${b} richtig`,qAgain:"Noch einmal",mastered:(a,b)=>`Gelernt ${a} / ${b}`,
lesH:"Lektionen",lesP:"Zwölf kurze Dialoge und Texte, alle mit Lesung, Rōmaji und Übersetzung. Unterstrichene Wörter antippen für die Bedeutung.",lessonN:n=>`Lektion ${n}`,lesGoal:"In dieser Lektion",lesVocab:"Wörter der Lektion",lesGram:"Grammatik",addAll:"Alle zu Wörtern hinzufügen",addedN:n=>`${n} Wörter hinzugefügt`,allIn:"Alle schon gespeichert",showTr:"Übersetzung",lesDone:"Erledigt ✓",lesMark:"Als erledigt markieren",lesProg:(a,b)=>`${a} von ${b} Lektionen erledigt`,
starterH:"Grundwortschatz",starterP:"Füge Wörter nach Thema hinzu – sie erscheinen dann täglich unter „Üben“.",wordsN:n=>`${n} Wörter`,back2:"← Zurück zu Start",open:"Öffnen →",
step:n=>`Schritt ${n}`,beginNote:"Diese Texte sind ab Mittelstufe. Wenn du neu bist, fang mit „Start“ an.",toStart:"Zu Start →",wikiLab:"Wunderwelt",easyH:"Leichte Texte",easyP:"Nach den Lektionen: kurze N4-Texte aus der Wunderwelt. Zu jedem gibt es eine N2-Vollversion, beide mit Übersetzung pro Absatz.",trOn:"Übersetzung",wikiH:"Wunderwelt Japan",wikiP:"Wie Sake entsteht, warum Natto Fäden zieht, wie Lachse heimfinden … Jedes Thema gibt es als leichte N4- und als volle N2-Version.",beginNote2:"Etwas Leichteres gesucht? Wähle N4 oder Wunderwelt."}
};
I18N["zh-Hans"]={sub:"日语 · 简体中文",tStart:"入门",tRead:"阅读",tVocab:"单词本",tPrac:"练习",tSet:"设置",
todayEy:"今日一篇",libH:"书库",libN:(a,b)=>`已开放 ${a} 篇，共 ${b} 篇`,newsH:"今天的新闻（外部网站）",readToday:"开始阅读",wd:["日","一","二","三","四","五","六"],dateFmt:(m,d,w)=>`${m}月${d}日 星期${w}`,dayN:n=>`第 ${n} 篇`,showAll:"提前阅读",showAllP:"显示所有每日文章，包括还没到日期的。",srcLab:"出处",readEy:"阅读材料",readH:"今天读一篇",readLede:"点带下划线的词看释义；选中任意文字，可以直接加入单词本。",
lv:{all:"全部",n5:"N5 入门",n4:"N4 初级",n3:"N3 初中级",n2:"N2 中上级",n1:"N1 上级",pro:"上级＋ 母语者程度",x:"古典 超上级"},lvl:"阅读程度",lvlP:"列表只显示这个程度的文章。",lvlN:n=>`${n} 篇`,noArt:"这个程度还没有文章。",doneMark:"已读",back:"← 回到列表",
fg:"振假名",fgAll:"全部",fgAnnot:"只标注词",fgNone:"隐藏",dirLab:"排版",hor:"横排",ver:"直排",
tip:"小提示：在直排模式左右滑动阅读。",markRead:"标记为已读",markedRead:"已读 ✓",
add:"加入单词本",added:"已在单词本",addSel:s=>`＋ 加入「${s}」`,
word:"单词",reading:"读音",meaning:"意思",example:"例句",note:"备注",source:"来源",save:"保存",cancel:"取消",
vocabEy:"单词本",vocabH:n=>`${n} 个单词`,search:"搜索单词或意思",newWord:"添加单词",
seed:"范例",del:"删除",delSure:"确定删除？",due:"今天复习",box:n=>`第 ${n} 盒`,noWords:"还没有单词。先去读一篇，点词加入吧。",noMatch:"找不到符合的单词。",
pracEy:"练习",pracH:"今天的复习",today:"今日进度",dueNow:"待复习",streak:"连续天数",days:n=>`${n} 天`,
boxes:"记忆盒分布",boxLab:n=>n===0?"新卡":`盒 ${n}`,start:"开始练习",tapFlip:"点卡片翻面",
again:"再一次",hard:"有点难",good:"记得",later:{again:"马上",hard:"1 天后",good:d=>`${d} 天后`},
nothing:"今天没有要复习的卡片。",nothing2:"可以去阅读，加入新的单词。",doneH:"今天完成了",doneP:n=>`复习了 ${n} 张卡片。`,
left:(a,b)=>`${a} / ${b}`,
setEy:"设置",setH:"语言与阅读",ui:"界面语言",uiP:"按钮和说明的语言。",
fgP:"阅读时汉字上方的假名。",size:"阅读字号",dir:"出题方向",dirP:"卡片正面显示什么。",
j2z:"日→中",z2j:"中→日",mix:"混合",goal:"每日目标",goalP:"每天复习几张卡片。",cards:n=>`${n} 张`,
data:"数据",dataP:"单词只存在这个浏览器里。换手机或清除浏览记录前，请先导出备份。",
exp:"复制备份",imp:"导入备份",impPh:"把备份文字贴在这里",rmSeed:"移除范例卡",
copied:"已复制",copyFail:"无法自动复制，请手动全选复制。",imported:n=>`已导入 ${n} 个单词`,badImport:"格式不对，请粘贴完整的备份文字。",
savedT:"已加入单词本",listen:"朗读全文",pause:"暂停",resume:"继续",stop:"停止",speed:"朗读速度",speedP:"整篇朗读与单词发音的语速。",voice:"日语语音",voiceP:"使用这台设备内置的日语语音。",vvNote:c=>`文章和单词已预先录好真人感语音（${c}）。没录到的内容会改用设备语音。`,tryV:"试听",vHelp:"怎样让声音更自然？",vTips:"带 ★ 的是高音质语音，“自动”会优先选它们。声音好不好，取决于设备里装了哪些语音：<ul><li><b>iPhone / iPad</b>：设置 → 辅助功能 → 朗读内容 → 声音 → 日语，下载“Kyoko（增强）”或“Otoya（增强）”。（Siri 的声音网页用不了。）</li><li><b>Mac</b>：系统设置 → 辅助功能 → 朗读内容 → 系统声音 → 管理声音 → 日语，勾选增强版或高品质版。</li><li><b>电脑（Windows / Mac）</b>：用 Microsoft Edge 打开本页，会出现“Nanami Online (Natural)”等神经网络语音，最接近真人。</li><li><b>Android</b>：设置 → 系统 → 语言 → 文字转语音输出 → Google 语音服务 → 安装日语语音数据（选高品质）。</li></ul>下载后重新打开本页，列表才会更新。",auto:"自动",autoSay:"翻卡时自动发音",autoSayP:"练习时翻到背面就念出单词。",on:"开",off:"关",sayLine:"朗读这句",fromHere:"从这句开始朗读",say:"发音",noVoice:"这台设备找不到日语语音。iPhone 可到「设置 → 辅助功能 → 朗读内容 → 声音 → 日文」下载。",noTTS:"这个浏览器不支持朗读。",removedSeed:"已移除范例卡",needWord:"请至少填写单词和意思。",
glLab:"释义语言",glP:"单词意思和课文翻译用哪种语言。",romaji:"罗马音",romajiP:"在假名旁显示罗马音，适合刚开始学的人。",
welH:"欢迎来到栞",welP:"先选你习惯的语言，再选日文程度。之后都可以在「设置」里改。",welLang:"你想用哪种语言学？",welLvl:"你的日文程度",lvBegin:"完全零基础",lvBeginP:"从假名开始，一步一步来",lvRead:"已经能读日文",lvReadP:"直接看每日一篇",welGo:"开始",
stEy:"入门",stH:"从零开始学日文",stLede:"四个步骤：认识假名 → 测验假名 → 读短课文 → 每天复习单词。",
kanaH:"五十音表",kanaP:"日文有三种文字：平假名、片假名和汉字。先学平假名，片假名多用在外来语。点一下就能听发音。",kanaTip:"小「っ」表示停顿一拍；片假名的「ー」把前一个音拉长。",
hira:"平假名",kata:"片假名",basic:"清音",daku:"浊音・半浊音",yoon:"拗音",
quizH:"假名测验",quizP:"看假名选罗马音，一轮 10 题。答对三次以上就算熟悉。",qSet:"范围",qDir:"题型",qBasic:"清音",qDaku:"＋浊音",qYoon:"＋拗音",k2r:"假名 → 罗马音",r2k:"罗马音 → 假名",qStart:"开始测验",qRight:"答对了！",qWrong:s=>`正确答案是「${s}」`,qNext:"下一题",qDoneH:"测验完成",qDone:(a,b)=>`答对 ${a} / ${b} 题`,qAgain:"再测一次",mastered:(a,b)=>`已熟悉 ${a} / ${b}`,
lesH:"课文",lesP:"十二篇很短的对话与短文，全部附读音、罗马音和翻译。点带下划线的词看意思。",lessonN:n=>`第 ${n} 课`,lesGoal:"这课学什么",lesVocab:"本课单词",lesGram:"文法重点",addAll:"全部加入单词本",addedN:n=>`已加入 ${n} 个单词`,allIn:"都在单词本里了",showTr:"翻译",lesDone:"学完了 ✓",lesMark:"标记为学完",lesProg:(a,b)=>`已学完 ${a} / ${b} 课`,
starterH:"基础单词",starterP:"按主题加入单词本，就会出现在「练习」里，每天复习。",wordsN:n=>`${n} 个字`,back2:"← 回到入门",open:"打开 →",
step:n=>`第 ${n} 步`,beginNote:"这里的文章是中级以上。如果你是零基础，建议先从「入门」开始。",toStart:"去入门 →",wikiLab:"百科",easyH:"简单读物",easyP:"学完课文以后，可以读这些 N4 小百科。每篇都有完整版（N2），也都附逐段翻译。",trOn:"翻译",wikiH:"奇妙百科",wikiP:"酒怎么酿、纳豆为什么牵丝、鲑鱼怎么找到回家的河……每个主题都有 N4 简单版和 N2 完整版。",beginNote2:"想读简单一点的？选「N4」或「百科」。"};

/* ---------- state ---------- */
const KEY="shiori-v1", OLDKEY="kotoba-ci-v1", IV=[0,1,2,4,8,16,30];
const UIS=[["zh-Hant","繁體中文"],["zh-Hans","简体中文"],["en","English"],["de","Deutsch"],["ja","日本語"]];
const GLS=[["zh-Hant","繁中"],["zh-Hans","简中"],["en","EN"],["de","DE"]];
const todayStr=()=>{const d=new Date();return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0")};
const addDays=(s,n)=>{const d=new Date(s+"T12:00:00");d.setDate(d.getDate()+n);return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0")};
const uid=()=>Math.random().toString(36).slice(2,9);
function guessUI(){try{const l=(navigator.language||"").toLowerCase();if(/^zh-(tw|hk|mo|hant)/.test(l))return"zh-Hant";if(l.startsWith("zh"))return"zh-Hans";if(l.startsWith("de"))return"de";if(l.startsWith("ja"))return"ja";if(l.startsWith("en"))return"en"}catch(e){}return"zh-Hant"}
function seedCards(){return SEED.map(([w,r,m,n])=>{const x=SEED_TR[w]||{};return{id:uid(),w,r,m,mi:x.mi,ex:"",note:n,ni:x.ni,src:"",box:0,due:todayStr(),seed:true}})}
function fresh(){const ui=guessUI();return{set:{ui,gl:ui==="ja"?"zh-Hant":ui,fg:"annot",size:19,dir:"j2z",goal:20,vert:false,lvl:"all",showAll:false,rate:0.9,voice:"",autoSay:true,romaji:false,mode:"read",onb:false},
cards:seedCards(),log:{},read:{},kana:{},les:{}}}
let FIRST=false;
function load(){try{const raw=localStorage.getItem(KEY)||localStorage.getItem(OLDKEY);const s=JSON.parse(raw);
  if(s&&s.cards){const f=fresh(),o=Object.assign(f,s,{set:Object.assign(f.set,{gl:"",onb:true},s.set)});
    if(!o.set.gl)o.set.gl=o.set.ui==="ja"?"zh-Hant":o.set.ui;
    o.kana=o.kana||{};o.les=o.les||{};
    o.cards.forEach(c=>{if(c.seed&&!c.mi&&SEED_TR[c.w]){c.mi=SEED_TR[c.w].mi;c.ni=SEED_TR[c.w].ni}});
    return o}}catch(e){}
  FIRST=true;return fresh()}
function persist(){S.updated=Date.now();try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}syLater()}
let S=load(), V={view:S.set.mode==="begin"?"start":"read",art:null,q:"",showAdd:false,sess:null,flip:false,confirm:null,sel:"",sv:null,kscript:"h",kq:null,kqSet:"basic",kqDir:"k2r",showTr:true};
const L=()=>I18N[S.set.ui]||I18N["zh-Hant"];
const t=(k,...a)=>{let v=L()[k];if(v===undefined)v=I18N.en[k];return typeof v==="function"?v(...a):v};
const GL=()=>S.set.gl||"zh-Hant";
const tri=o=>o?(o[GL()]||o["zh-Hant"]||""):"";
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const $=s=>document.querySelector(s);
const has=w=>S.cards.some(c=>c.w===w);
const dueCards=()=>S.cards.filter(c=>c.due<=todayStr()).sort((a,b)=>a.box-b.box||a.due.localeCompare(b.due));
const cm=c=>(c.mi&&c.mi[GL()])||c.m, cn=c=>(c.ni&&c.ni[GL()]!==undefined?c.ni[GL()]:c.note);
function toast(m){const el=document.createElement("div");el.className="toast";el.textContent=m;document.body.appendChild(el);setTimeout(()=>el.remove(),1800)}
function streak(){let n=0,d=todayStr();if(!S.log[d])d=addDays(d,-1);while(S.log[d]){n++;d=addDays(d,-1)}return n}

/* ---------- multilingual content lookup ---------- */
const TRK=l=>l==="zh-Hans"?"hans":l;
function trOf(a){const l=GL();return l==="zh-Hant"?null:(TR[TRK(l)]||{})[a.id]}
function aSub(a){if(a.les)return tri(a.s);const x=trOf(a);return x&&x.s||a.sub}
function aGenre(a){const u=S.set.ui;if(u==="zh-Hant"||u==="ja")return a.genre[u];const zh=a.genre["zh-Hant"],g=GLAB[zh];return g?(u==="zh-Hans"?g.hans:g[u]):zh}
function aGloss(a,w){
  if(a.les){const v=a.vm[w];return v?{m:tri(v.m)}:{m:""}}
  const x=trOf(a),v=x&&x.g[w];if(v)return{m:v[0],n:v[1]||""};return a.gloss[w]||{m:""}}
function allGloss(a,w){const mi={},ni={};
  if(a.les){const v=a.vm[w];if(v)Object.assign(mi,v.m);return{mi,ni}}
  const g=a.gloss[w]||{};mi["zh-Hant"]=g.m||"";ni["zh-Hant"]=g.n||"";
  ["zh-Hans","en","de"].forEach(l=>{const x=(TR[TRK(l)]||{})[a.id],v=x&&x.g[w];if(v){mi[l]=v[0];ni[l]=v[1]||""}});return{mi,ni}}
const findArt=id=>ARTICLES.find(x=>x.id===id)||LESSONS.find(x=>x.id===id);

/* ---------- romaji ---------- */
const KS="あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをんがぎぐげござじずぜぞだぢづでどばびぶべぼぱぴぷぺぽゔ";
const KR="a i u e o ka ki ku ke ko sa shi su se so ta chi tsu te to na ni nu ne no ha hi fu he ho ma mi mu me mo ya yu yo ra ri ru re ro wa o n ga gi gu ge go za ji zu ze zo da ji zu de do ba bi bu be bo pa pi pu pe po vu".split(" ");
const KM={};[...KS].forEach((k,i)=>KM[k]=KR[i]);
const toHira=s=>s.replace(/[ァ-ヶ]/g,c=>String.fromCharCode(c.charCodeAt(0)-0x60));
function romaji(s){s=toHira(String(s||""));let o="",dbl=false;
  for(let i=0;i<s.length;i++){const c=s[i],n=s[i+1];
    if(c==="っ"){dbl=true;continue}
    if(c==="ー"){const m=o.match(/[aiueo](?=[^aiueo]*$)/);o+=m?m[0]:"";continue}
    let r=KM[c];
    if(r===undefined){o+=c==="、"?", ":c==="。"?". ":c==="　"?" ":c;dbl=false;continue}
    if(n&&"ゃゅょ".includes(n)){const v={"ゃ":"a","ゅ":"u","ょ":"o"}[n],b=r.slice(0,-1);r=/(sh|ch|j)$/.test(b)?b+v:b+"y"+v;i++}
    else if(n&&"ぁぃぅぇぉ".includes(n)){r=r.replace(/[aiueo]$/,"")+{"ぁ":"a","ぃ":"i","ぅ":"u","ぇ":"e","ぉ":"o"}[n];i++}
    if(dbl){o+=r.startsWith("ch")?"t":r[0];dbl=false}
    if(c==="ん"&&n&&/^[aiueoy]/.test(KM[n]||""))r="n'";
    o+=r}
  return o.replace(/\s+/g," ").trim()}

/* ---------- kana data ---------- */
const KROWS=["あいうえお","かきくけこ","さしすせそ","たちつてと","なにぬねの","はひふへほ","まみむめも","や・ゆ・よ","らりるれろ","わ・・・を","ん・・・・"];
const KDROWS=["がぎぐげご","ざじずぜぞ","だぢづでど","ばびぶべぼ","ぱぴぷぺぽ"];
const KYROWS=["きしちにひみりぎじびぴ"].join("").split("").map(c=>[c+"ゃ",c+"ゅ",c+"ょ"]);
const kList=set=>{const b=KROWS.join("").replace(/・/g,"").split(""),d=KDROWS.join("").split(""),y=KYROWS.flat();return set==="basic"?b:set==="daku"?b.concat(d):b.concat(d,y)};
const toKata=s=>s.replace(/[ぁ-ゖ]/g,c=>String.fromCharCode(c.charCodeAt(0)+0x60));
const kOK=k=>{const v=S.kana[k];return v&&v[0]>=3&&v[0]>v[1]};

/* ---------- parsing ---------- */
const RX=/\[\[([^|\]]+)\|([^\]]+)\]\]|\{([^|}]+)\|([^}]+)\}/g;
const plain=s=>s.replace(RX,(m,a,b,c)=>a||c);
let SENTS=[];
const sayText=s=>s.replace(RX,(m,w,r,k,kr)=>w?r:kr);
function renderPara(p,art){
  return (p.match(/[^。！？]+[。！？」]*|[。！？」]+/g)||[p]).map(sen=>{
    const sp=esc(plain(sen).trim()), si=SENTS.length; SENTS.push(sayText(sen).trim());
    return `<span class="sen" data-i="${si}">`+sen0(sen,sp,si,art)+`</span>`}).join("");
}
function sen0(sen,sp,si,art){
    return sen.replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c])).replace(RX,(m,w,r,k,kr)=>{
      if(w){const sv=has(w)?" saved":"";const inner=r===w?esc(w):`${esc(w)}<rt>${esc(r)}</rt>`;
        return `<ruby class="an${sv}" tabindex="0" role="button" data-w="${esc(w)}" data-r="${esc(r)}" data-a="${art.id}" data-s="${sp}" data-i="${si}">${inner}</ruby>`}
      return `<ruby>${esc(k)}<rt>${esc(kr)}</rt></ruby>`});
}
const roHTML=r=>S.set.romaji&&r?`<span class="ro">${esc(romaji(r))}</span>`:"";

/* ---------- views ---------- */
function tabs(){
  const n=dueCards().length;
  $("#tabs").innerHTML=[["start","tStart"],["read","tRead"],["vocab","tVocab"],["prac","tPrac"],["set","tSet"]].map(([v,k])=>
    `<button data-tab="${v}" aria-current="${V.view===v}">${t(k)}${v==="read"&&todayPiece()&&!S.read[todayPiece().id]&&S.set.mode!=="begin"?`<span class="dot" aria-hidden="true"></span>`:""}${v==="prac"&&n?`<span class="badge">${n}</span>`:""}</button>`).join("");
  
}
function viewWelcome(){
  const s=S.set;
  return `<section class="welcome"><p class="eyebrow">栞 · Shiori</p><h2>${t("welH")}</h2><p class="lede">${t("welP")}</p>
  <p class="wlab">${t("welLang")}</p><div class="langs">${UIS.filter(([v])=>v!=="ja").map(([v,l])=>`<button class="pick ${s.ui===v?"on":""}" data-wlang="${v}" aria-pressed="${s.ui===v}">${l}</button>`).join("")}</div>
  <p class="wlab">${t("welLvl")}</p><div class="levels">
   <button class="pick big ${s.mode==="begin"?"on":""}" data-wmode="begin" aria-pressed="${s.mode==="begin"}"><b>${t("lvBegin")}</b><span>${t("lvBeginP")}</span></button>
   <button class="pick big ${s.mode==="read"?"on":""}" data-wmode="read" aria-pressed="${s.mode==="read"}"><b>${t("lvRead")}</b><span>${t("lvReadP")}</span></button></div>
  <button class="btn primary wide" data-act="welgo">${t("welGo")} →</button></section>`;
}
function viewRead(){
  if(V.art){const a=ARTICLES.find(x=>x.id===V.art);
    SENTS=[];const ptr=TRP[a.id],showP=ptr&&V.showPtr&&!S.set.vert;const paras=a.body.split(/\n\n/).map((p,pi)=>(a.letter?`<p>${p.split("\n").map(l=>renderPara(l,a)).join("<br>")}</p>`:`<p>${renderPara(p,a)}</p>`)+(showP&&ptr[pi]?`<p class="ptr" lang="${GL()}">${esc(tri(ptr[pi]))}</p>`:"")).join("");
    return `<button class="back" data-act="back">${t("back")}</button>
    <div class="rhead"><span class="chip ${a.lv==="n1"||a.lv==="pro"||a.lv==="x"?"k-adv":""}">${t("lv")[a.lv]}</span><span class="chip">${esc(aGenre(a))}</span></div>
    <h2 class="reader-title" lang="ja">${esc(a.title)}</h2><p class="reader-sub">${esc(aSub(a))}</p>
    <div class="ctrl">
      <span class="seg" role="group" aria-label="${t("fg")}">${[["all","fgAll"],["annot","fgAnnot"],["none","fgNone"]].map(([v,k])=>`<button data-fg="${v}" aria-pressed="${S.set.fg===v}">${t(k)}</button>`).join("")}</span>
      <span class="seg" role="group" aria-label="${t("dirLab")}"><button data-vert="0" aria-pressed="${!S.set.vert}">${t("hor")}</button><button data-vert="1" aria-pressed="${S.set.vert}">${t("ver")}</button></span>
      ${ptr?`<span class="seg"><button data-act="togptr" aria-pressed="${showP}">${t("trOn")}</button></span>`:""}
    </div>
    <div class="player" id="player">${playerHTML()}</div>
    <div id="reader" lang="ja" class="fg-${S.set.fg} ${S.set.vert?"vert":""}">${paras}</div>
    ${a.src?`<p class="tip">${t("srcLab")}：${esc(a.src)}</p>`:""}
    ${S.set.vert?`<p class="tip">${t("tip")}</p>`:""}
    <div class="mark-done"><button class="btn ${S.read[a.id]?"ghost":"primary"}" data-act="markread">${S.read[a.id]?t("markedRead"):t("markRead")}</button></div>`}
  const tp=todayPiece(),dt=new Date(),rel=ARTICLES.filter(released);
  const NEWS=[["NHK NEWS WEB","https://www3.nhk.or.jp/news/"],["NHK NEWS WEB EASY","https://www3.nhk.or.jp/news/easy/"],["朝日新聞","https://www.asahi.com/"],["毎日新聞","https://mainichi.jp/"],["日本経済新聞","https://www.nikkei.com/"],["東京新聞","https://www.tokyo-np.co.jp/"]];
  const note=S.set.mode==="begin"?`<div class="note"><p>${t("beginNote")} ${t("beginNote2")}</p><button class="btn sm primary" data-tab="start">${t("toStart")}</button></div>`:"";
  return `${note}${tp?`<section class="today"><p class="eyebrow">${t("todayEy")} · ${t("dateFmt",dt.getMonth()+1,dt.getDate(),t("wd")[dt.getDay()])}</p>
  <button class="todaycard" data-art="${tp.id}"><span class="tmeta"><span class="chip ${["n1","pro","x"].includes(tp.lv)?"k-adv":""}">${t("lv")[tp.lv]}</span><span class="chip">${esc(aGenre(tp))}</span><span class="dn">${t("dayN",tp.d+1)}</span>${S.read[tp.id]?`<span class="done">${t("doneMark")}</span>`:""}</span>
  <span class="tt" lang="ja">${esc(tp.title)}</span><span class="ts">${esc(aSub(tp))}</span><span class="go">${t("readToday")} →</span></button>
  <p class="newsh">${t("newsH")}</p><div class="news">${NEWS.map(([n,u])=>`<a href="${u}" target="_blank" rel="noopener">${n}</a>`).join("")}</div></section>`:""}
  ${shelf()}
  <p class="eyebrow">${t("readEy")}</p><h2>${t("libH")}</h2><p class="lede">${t("libN",rel.length,ARTICLES.length)} · ${t("readLede")}</p>
  ${lvlSeg()}${(()=>{const list=rel.filter(a=>S.set.lvl==="all"||(S.set.lvl==="wiki"?a.wiki:a.lv===S.set.lvl)).sort((x,y)=>y.d-x.d);return list.length?`<ul class="alist">${list.map(a=>`<li><button data-art="${a.id}"><span class="t" lang="ja">${esc(a.title)}</span>
  <span class="s">${a.d>=0?`<span class="dn">${a.d+1}</span> `:""}${esc(aSub(a))} · ${esc(aGenre(a))}${S.read[a.id]?` · <span class="done">${t("doneMark")}</span>`:""}</span>
  <span class="lv"><span class="chip ${a.lv==="n1"||a.lv==="pro"||a.lv==="x"?"k-adv":""}">${t("lv")[a.lv]}</span></span></button></li>`).join("")}</ul>`:`<p class="empty">${t("noArt")}</p>`})()}`;
}
function shelf(){
  const full=ARTICLES.filter(a=>a.wiki&&a.lv==="n2");
  return `<section class="shelf"><p class="eyebrow">${t("wikiLab")} · New</p><h2>${t("wikiH")}</h2><p class="lede">${t("wikiP")}</p>
  <div class="shelfrow">${full.map(f=>{const e=ARTICLES.find(x=>x.id===f.id+"-e");return `<div class="scard"><span class="st" lang="ja">${esc(f.title)}</span><span class="ss">${esc(aSub(f))}</span>
   <span class="sbtns">${e?`<button class="btn sm ${S.read[e.id]?"ghost":"primary"}" data-art="${e.id}">N4${S.read[e.id]?" ✓":""}</button>`:""}<button class="btn sm ${S.read[f.id]?"ghost":""}" data-art="${f.id}">N2${S.read[f.id]?" ✓":""}</button></span></div>`}).join("")}</div></section>`}
function lvlSeg(){const lv=t("lv");return `<div class="ctrl" role="group" aria-label="${t("lvl")}"><span class="seg lvseg">${["all","wiki","n4","n3","n2","n1","pro","x"].map(k=>`<button data-lvl="${k}" aria-pressed="${S.set.lvl===k}">${k==="all"?lv.all:k==="wiki"?t("wikiLab"):({x:"古典",pro:"上級＋"}[k]||k.toUpperCase())}</button>`).join("")}</span></div>`}

/* ---------- start (beginner) ---------- */
function viewStart(){
  if(V.sv==="kana")return viewKana();
  if(V.sv==="quiz")return viewQuiz();
  if(V.sv==="starter")return viewStarter();
  if(V.sv&&V.sv.startsWith("les:"))return viewLesson(V.sv.slice(4));
  const all=kList("basic"),kh=all.filter(kOK).length,kk=all.filter(k=>kOK(toKata(k))).length,ld=LESSONS.filter(l=>S.les[l.id]).length;
  const nextL=LESSONS.find(l=>!S.les[l.id])||LESSONS[0];
  const cats=STARTER.map(c=>c.w.filter(x=>has(x[0])).length).reduce((a,b)=>a+b,0),ct=STARTER.reduce((a,c)=>a+c.w.length,0);
  return `<p class="eyebrow">${t("stEy")}</p><h2>${t("stH")}</h2><p class="lede">${t("stLede")}</p>
  <div class="steps">
   <button class="stepcard" data-sv="kana"><span class="sn">${t("step",1)}</span><span class="sh">${t("kanaH")}</span><span class="sp">${t("hira")} ${kh}/${all.length} · ${t("kata")} ${kk}/${all.length}</span><span class="mini" lang="ja" aria-hidden="true">あいうえお · アイウエオ</span><span class="go">${t("open")}</span></button>
   <button class="stepcard" data-sv="quiz"><span class="sn">${t("step",2)}</span><span class="sh">${t("quizH")}</span><span class="sp">${t("mastered",kh,all.length)}</span><span class="prog"><i style="width:${kh/all.length*100}%"></i></span><span class="go">${t("open")}</span></button>
  </div>
  <section class="lesblock"><p class="eyebrow">${t("step",3)}</p><h3>${t("lesH")}</h3><p class="lede">${t("lesP")} ${t("lesProg",ld,LESSONS.length)}</p>
  <ul class="alist">${LESSONS.map((l,i)=>`<li><button data-sv="les:${l.id}"><span class="t" lang="ja">${esc(l.t)}</span><span class="s">${t("lessonN",i+1)} · ${esc(tri(l.s))}${S.les[l.id]?` · <span class="done">${t("lesDone")}</span>`:""}</span><span class="lv">${l.id===nextL.id&&!S.les[l.id]?`<span class="chip k-adv">→</span>`:`<span class="chip">N5</span>`}</span></button></li>`).join("")}</ul></section>
  <section class="lesblock"><p class="eyebrow">${t("lesH")} →</p><h3>${t("easyH")}</h3><p class="lede">${t("easyP")}</p>
  <ul class="alist">${ARTICLES.filter(a=>a.wiki&&a.lv==="n4").map(a=>`<li><button data-art="${a.id}"><span class="t" lang="ja">${esc(a.title)}</span><span class="s">${esc(aSub(a))}${S.read[a.id]?` · <span class="done">${t("doneMark")}</span>`:""}</span><span class="lv"><span class="chip">N4</span></span></button></li>`).join("")}</ul></section>
  <section class="lesblock"><p class="eyebrow">${t("step",4)}</p><h3>${t("starterH")}</h3><p class="lede">${t("starterP")}</p>
  <button class="stepcard" data-sv="starter"><span class="sh">${t("starterH")}</span><span class="sp">${cats} / ${ct}</span><span class="prog"><i style="width:${cats/ct*100}%"></i></span><span class="go">${t("open")}</span></button></section>`;
}
function kanaCell(k){if(!k||k==="・")return `<span class="kc empty"></span>`;const kk=V.kscript==="k"?toKata(k):k;
  return `<button class="kc ${kOK(kk)?"ok":""}" data-kana="${kk}" lang="ja"><b>${kk}</b><small>${romaji(k)}</small></button>`}
function viewKana(){
  const ex=V.kanaSel&&kexOf(V.kanaSel);
  const exHTML=ex?`<div class="kex"><span class="kex-k" lang="ja">${esc(V.kanaSel)}</span><span class="kex-w" lang="ja">${esc(ex[0])}</span><span class="kex-r">${esc(ex[1])}</span><span class="kex-m">${esc(ex[{"zh-Hant":2,"zh-Hans":3,"en":4,"de":5,"ja":6}[S.set.ui]||4])}</span><button class="btn sm" data-say="${esc(ex[0])}" aria-label="${esc(ex[0])}">${SPK}</button></div>`:"";
  const grid=(rows,cols)=>`<div class="kgrid" style="--cols:${cols}">${rows.map(r=>(Array.isArray(r)?r:r.split("")).map(kanaCell).join("")).join("")}</div>`;
  return `<button class="back" data-act="sback">${t("back2")}</button><p class="eyebrow">${t("step",1)}</p><h2>${t("kanaH")}</h2><p class="lede">${t("kanaP")}</p>${exHTML}
  <div class="ctrl"><span class="seg"><button data-ks="h" aria-pressed="${V.kscript==="h"}">${t("hira")}</button><button data-ks="k" aria-pressed="${V.kscript==="k"}">${t("kata")}</button></span></div>
  <h3 class="kh">${t("basic")}</h3>${grid(KROWS,5)}
  <h3 class="kh">${t("daku")}</h3>${grid(KDROWS,5)}
  <h3 class="kh">${t("yoon")}</h3>${grid(KYROWS,3)}
  <p class="tip">${t("kanaTip")}</p>
  <button class="btn primary wide" data-sv="quiz">${t("quizH")} →</button>`;
}
function newQuiz(){const pool=kList(V.kqSet).map(k=>V.kscript==="k"?toKata(k):k);
  const weak=pool.slice().sort(()=>Math.random()-.5).sort((a,b)=>(kOK(a)?1:0)-(kOK(b)?1:0));
  const q=weak.slice(0,10).map(k=>{const others=pool.filter(x=>x!==k&&romaji(x)!==romaji(k)).sort(()=>Math.random()-.5).slice(0,3);return{k,opts:[k,...others].sort(()=>Math.random()-.5)}});
  V.kq={q,i:0,ok:0,pick:null}}
function viewQuiz(){
  const head=`<button class="back" data-act="sback">${t("back2")}</button><p class="eyebrow">${t("step",2)}</p><h2>${t("quizH")}</h2>`;
  if(!V.kq){const all=kList(V.kqSet).map(k=>V.kscript==="k"?toKata(k):k);
    return `${head}<p class="lede">${t("quizP")}</p>
    <div class="set">
     <div class="item"><span class="lab">${t("hira")} / ${t("kata")}</span><p></p><div class="c"><span class="seg"><button data-ks="h" aria-pressed="${V.kscript==="h"}">${t("hira")}</button><button data-ks="k" aria-pressed="${V.kscript==="k"}">${t("kata")}</button></span></div></div>
     <div class="item"><span class="lab">${t("qSet")}</span><p>${t("mastered",all.filter(kOK).length,all.length)}</p><div class="c"><span class="seg">${[["basic","qBasic"],["daku","qDaku"],["all","qYoon"]].map(([v,k])=>`<button data-kqset="${v}" aria-pressed="${V.kqSet===v}">${t(k)}</button>`).join("")}</span></div></div>
     <div class="item"><span class="lab">${t("qDir")}</span><p></p><div class="c"><span class="seg">${[["k2r","k2r"],["r2k","r2k"]].map(([v,k])=>`<button data-kqdir="${v}" aria-pressed="${V.kqDir===v}">${t(k)}</button>`).join("")}</span></div></div>
    </div><button class="btn primary wide" data-act="kqstart">${t("qStart")}</button>`}
  const s=V.kq;
  if(s.i>=s.q.length)return `${head}<div class="card"><div class="big">${s.ok} / ${s.q.length}</div><div class="meaning">${t("qDoneH")}</div><div class="hint">${t("qDone",s.ok,s.q.length)}</div></div>
    <div class="row2"><button class="btn" data-act="sback">${t("back2")}</button><button class="btn primary" data-act="kqstart">${t("qAgain")}</button></div>`;
  const it=s.q[s.i],k2r=V.kqDir==="k2r",picked=s.pick!==null;
  const front=k2r?`<div class="big kbig" lang="ja">${it.k}</div>`:`<div class="big">${romaji(it.k)}</div>`;
  return `${head}<div class="card quiz">${front}${picked?`<div class="${s.pick===it.k?"qok":"qno"}">${s.pick===it.k?t("qRight"):t("qWrong",k2r?romaji(it.k):it.k)}</div>`:""}</div>
  <div class="opts">${it.opts.map(o=>`<button class="opt ${picked?(o===it.k?"right":o===s.pick?"wrong":""):""}" data-kpick="${o}" ${picked?"disabled":""} ${k2r?"":`lang="ja"`}>${k2r?romaji(o):o}</button>`).join("")}</div>
  ${picked?`<button class="btn primary wide" data-act="kqnext">${t("qNext")} →</button>`:""}
  <p class="qcount">${t("left",s.i+1,s.q.length)}</p>`;
}
function viewLesson(id){
  const l=LESSONS.find(x=>x.id===id),n=LESSONS.indexOf(l)+1;SENTS=[];
  const lines=l.lines.map(([sp,ja,ro,tr])=>{const si=SENTS.length;SENTS.push(sayText(ja));
    return `<div class="lline">${sp?`<span class="who" lang="ja">${esc(sp)}</span>`:""}<div class="lbody">
     <div class="ljp" lang="ja"><span class="sen" data-i="${si}">${sen0(ja,esc(plain(ja)),si,l)}</span><button class="iconbtn sm" data-say="${esc(sayText(ja))}" aria-label="${t("say")}">${SPK}</button></div>
     ${S.set.romaji?`<div class="lro">${esc(ro)}</div>`:""}${V.showTr?`<div class="ltr">${esc(tri(tr))}</div>`:""}</div></div>`}).join("");
  const missing=l.vocab.filter(v=>!has(v[0])).length;
  const nx=LESSONS[n];
  return `<button class="back" data-act="sback">${t("back2")}</button>
  <div class="rhead"><span class="chip">${t("lessonN",n)}</span><span class="chip">${t("lv").n5}</span></div>
  <h2 class="reader-title" lang="ja">${esc(l.t)}</h2><p class="reader-sub">${esc(tri(l.s))}</p>
  <p class="goal"><b>${t("lesGoal")}</b>${esc(tri(l.goal))}</p>
  <div class="ctrl"><span class="seg"><button data-romaji="${S.set.romaji?0:1}" aria-pressed="${S.set.romaji}">${t("romaji")}</button><button data-act="togtr" aria-pressed="${V.showTr}">${t("showTr")}</button></span></div>
  <div class="player" id="player">${playerHTML()}</div>
  <div id="reader" class="lesson fg-all">${lines}</div>
  <h3 class="kh">${t("lesVocab")}</h3>
  <ul class="vlist">${l.vocab.map(v=>`<li><div><span class="vw" lang="ja">${esc(v[0])}</span>${v[1]!==v[0]?`<span class="vr" lang="ja">${esc(v[1])}</span>`:""}${roHTML(v[1])}<button class="iconbtn sm" data-say="${esc(v[1])}" aria-label="${t("say")}">${SPK}</button></div><div class="vm">${esc(tri(l.vm[v[0]].m))}</div><div class="vside">${has(v[0])?`<span class="boxpip">${t("added")}</span>`:""}</div></li>`).join("")}</ul>
  <div class="iorow"><button class="btn ${missing?"primary":"ghost"}" data-addles="${l.id}" ${missing?"":"disabled"}>${missing?t("addAll"):t("allIn")}</button></div>
  <h3 class="kh">${t("lesGram")}</h3>
  <div class="gram">${l.gram.map(g=>`<div class="gp"><b lang="ja">${esc(g.h)}</b><p>${esc(tri(g.x))}</p></div>`).join("")}</div>
  <div class="mark-done row2"><button class="btn ${S.les[l.id]?"ghost":"primary"}" data-act="lesdone" data-l="${l.id}">${S.les[l.id]?t("lesDone"):t("lesMark")}</button>${nx?`<button class="btn" data-sv="les:${nx.id}">${t("lessonN",n+1)} →</button>`:""}</div>`;
}
function viewStarter(){
  return `<button class="back" data-act="sback">${t("back2")}</button><p class="eyebrow">${t("step",4)}</p><h2>${t("starterH")}</h2><p class="lede">${t("starterP")}</p>
  ${STARTER.map(c=>{const miss=c.w.filter(x=>!has(x[0])).length;return `<section class="cat"><div class="cathead"><h3>${esc(tri(c.l)||c.l.ja)} <small>${t("wordsN",c.w.length)}</small></h3>
   <button class="btn sm ${miss?"primary":"ghost"}" data-addcat="${c.id}" ${miss?"":"disabled"}>${miss?t("addAll"):t("allIn")}</button></div>
   <div class="chips">${c.w.map(x=>`<button class="wchip ${has(x[0])?"in":""}" data-say="${esc(x[1])}"><b lang="ja">${esc(x[0])}</b>${x[1]!==x[0]?`<span lang="ja">${esc(x[1])}</span>`:""}${S.set.romaji?`<span class="ro">${esc(romaji(x[1]))}</span>`:""}<em>${esc(tri(x.m))}</em></button>`).join("")}</div></section>`}).join("")}`;
}
function addWords(list,src){let n=0;list.forEach(x=>{if(!has(x.w)){S.cards.push(Object.assign({id:uid(),r:"",ex:"",note:"",src:src||"",box:0,due:todayStr()},x));n++}});persist();toast(n?t("addedN",n):t("allIn"))}

function addForm(){
  return `<form class="add" id="addForm">
  <label>${t("word")}<input id="f_w" required lang="ja"></label>
  <label>${t("reading")}<input id="f_r" lang="ja"></label>
  <label class="full">${t("meaning")}<input id="f_m" required></label>
  <label class="full">${t("example")}<input id="f_ex" lang="ja"></label>
  <label class="full">${t("note")}<input id="f_n"></label>
  <div class="row"><button type="button" class="btn ghost" data-act="closeadd">${t("cancel")}</button><button class="btn primary">${t("save")}</button></div></form>`;
}
function viewVocab(){
  const q=V.q.trim().toLowerCase();
  const list=S.cards.filter(c=>!q||[c.w,c.r,cm(c),cn(c),romaji(c.r||c.w)].join(" ").toLowerCase().includes(q)).slice().reverse();
  return `<p class="eyebrow">${t("vocabEy")}</p><h2>${t("vocabH",S.cards.length)}</h2>
  <div class="toolbar"><input id="q" type="search" placeholder="${t("search")}" value="${esc(V.q)}"><button class="btn primary" data-act="openadd">${t("newWord")}</button></div>
  ${V.showAdd?addForm():""}
  ${S.cards.length===0?`<p class="empty">${t("noWords")}</p>`:list.length===0?`<p class="empty">${t("noMatch")}</p>`:
  `<ul class="vlist">${list.map(c=>`<li>
    <div><span class="vw" lang="ja">${esc(c.w)}</span>${c.r&&c.r!==c.w?`<span class="vr" lang="ja">${esc(c.r)}</span>`:""}${roHTML(c.r||c.w)}<button class="iconbtn sm" data-say="${esc(c.r||c.w)}" aria-label="${t("say")}">${SPK}</button></div>
    <div class="vm">${esc(cm(c))}${cn(c)?` <span style="color:var(--muted);font-size:13px">— ${esc(cn(c))}</span>`:""}</div>
    ${c.ex?`<div class="vx" lang="ja">${esc(c.ex)}</div>`:""}
    <div class="vside">${c.seed?`<span class="chip">${t("seed")}</span>`:""}<span class="boxpip">${c.due<=todayStr()?t("due"):t("box",c.box)}</span>
    <button class="linkbtn ${V.confirm===c.id?"warn":""}" data-del="${c.id}">${V.confirm===c.id?t("delSure"):t("del")}</button></div></li>`).join("")}</ul>`}`;
}
function viewPrac(){
  const done=S.log[todayStr()]||0, goal=S.set.goal, due=dueCards().length;
  if(V.sess){const s=V.sess;
    if(s.i>=s.q.length){const n=s.n;V.sess=null;return `<p class="eyebrow">${t("pracEy")}</p><h2>${t("doneH")}</h2><p class="lede">${t("doneP",n)}</p>${statsBlock(done,goal,due)}`}
    const c=S.cards.find(x=>x.id===s.q[s.i]);if(!c){s.i++;return viewPrac()}
    const mode=S.set.dir==="mix"?(c.id.charCodeAt(0)%2?"j2z":"z2j"):S.set.dir;
    const front=mode==="j2z"?`<div class="big" lang="ja">${esc(c.w)}</div>`:`<div class="meaning">${esc(cm(c))}</div>`;
    const back=`<div class="big" lang="ja">${esc(c.w)}</div><button class="iconbtn" data-say="${esc(c.r||c.w)}" aria-label="${t("say")}">${SPK}</button>${c.r&&c.r!==c.w?`<div class="reading" lang="ja">${esc(c.r)}</div>`:""}${S.set.romaji?`<div class="hint">${esc(romaji(c.r||c.w))}</div>`:""}<div class="meaning">${esc(cm(c))}</div>${cn(c)?`<div class="hint">${esc(cn(c))}</div>`:""}${c.ex?`<div class="ex" lang="ja">${esc(c.ex)}</div>`:""}`;
    const nb=Math.min(c.box+1,IV.length-1);
    return `<p class="eyebrow">${t("pracEy")}</p>
    <div class="card ${V.flip?"flip":""}" id="card" tabindex="0" role="button">${V.flip?back:front+`<div class="hint">${t("tapFlip")}</div>`}</div>
    ${V.flip?`<div class="answers"><button class="a0" data-ans="0">${t("again")}<small>${t("later").again}</small></button><button class="a1" data-ans="1">${t("hard")}<small>${t("later").hard}</small></button><button class="a2" data-ans="2">${t("good")}<small>${t("later").good(IV[nb])}</small></button></div>`:""}
    <p class="qcount">${t("left",s.i+1,s.q.length)}</p>`}
  return `<p class="eyebrow">${t("pracEy")}</p><h2>${t("pracH")}</h2>${statsBlock(done,goal,due)}
  ${due?`<button class="btn primary" data-act="start" style="width:100%;padding:13px">${t("start")}</button>`:`<p class="empty">${t("nothing")}<br>${t("nothing2")}</p>`}`;
}
function statsBlock(done,goal,due){
  const counts=IV.map((_,i)=>S.cards.filter(c=>c.box===i).length), mx=Math.max(1,...counts);
  return `<div class="stats">
  <div class="stat"><b>${done}<span style="font-size:14px;color:var(--muted)"> / ${goal}</span></b><span>${t("today")}</span><div class="prog"><i style="width:${Math.min(100,done/goal*100)}%"></i></div></div>
  <div class="stat"><b>${due}</b><span>${t("dueNow")}</span></div>
  <div class="stat"><b>${streak()}</b><span>${t("streak")}</span></div></div>
  <p class="eyebrow">${t("boxes")}</p><div class="boxes">${counts.map((n,i)=>`<div class="r"><span>${t("boxLab",i)}</span><span class="bar"><i style="width:${n/mx*100}%"></i></span><span class="n">${n}</span></div>`).join("")}</div>`;
}
function viewSet(){
  const s=S.set, seg=(attr,opts,cur)=>`<span class="seg">${opts.map(([v,l])=>`<button data-${attr}="${v}" aria-pressed="${String(cur)===String(v)}">${l}</button>`).join("")}</span>`;
  return `<p class="eyebrow">${t("setEy")}</p><h2>${t("setH")}</h2><div class="set">
  ${acctBox()}
  <div class="item stack"><span class="lab">${t("ui")}</span><p>${t("uiP")}</p><div class="c">${seg("ui",UIS,s.ui)}</div></div>
  <div class="item stack"><span class="lab">${t("glLab")}</span><p>${t("glP")}</p><div class="c">${seg("gl",GLS,s.gl)}</div></div>
  <div class="item stack"><span class="lab">${t("welLvl")}</span><p></p><div class="c">${seg("mode",[["begin",t("lvBegin")],["read",t("lvRead")]],s.mode)}</div></div>
  <div class="item"><span class="lab">${t("romaji")}</span><p>${t("romajiP")}</p><div class="c">${seg("romaji",[["1",t("on")],["0",t("off")]],s.romaji?"1":"0")}</div></div>
  <div class="item stack"><span class="lab">${t("lvl")}</span><p>${t("lvlP")}</p><div class="c">${seg("lvl",["all","n4","n3","n2","n1","pro","x"].map(k=>[k,t("lv")[k]+(k==="all"?"":" · "+t("lvlN",ARTICLES.filter(a=>a.lv===k).length))]),s.lvl)}</div></div>
  <div class="item"><span class="lab">${t("showAll")}</span><p>${t("showAllP")}</p><div class="c">${seg("showall",[["1",t("on")],["0",t("off")]],s.showAll?"1":"0")}</div></div>
  <div class="item"><span class="lab">${t("fg")}</span><p>${t("fgP")}</p><div class="c">${seg("fg",[["all",t("fgAll")],["annot",t("fgAnnot")],["none",t("fgNone")]],s.fg)}</div></div>
  <div class="item"><span class="lab">${t("dirLab")}</span><p></p><div class="c">${seg("vert",[["0",t("hor")],["1",t("ver")]],s.vert?1:0)}</div></div>
  <div class="item"><span class="lab">${t("size")}</span><p lang="ja" style="font-family:var(--f-read);font-size:${s.size}px;color:var(--ink)">秋の夜長</p><div class="c"><input id="size" type="range" min="15" max="26" value="${s.size}" aria-label="${t("size")}"></div></div>
  <div class="item"><span class="lab">${t("speed")}</span><p>${t("speedP")}</p><div class="c">${seg("rate",[[0.7,"0.7×"],[0.9,"0.9×"],[1.1,"1.1×"],[1.3,"1.3×"]],s.rate)}</div></div>
  <div class="item"><span class="lab">${t("voice")}</span><p>${VV.on?esc(t("vvNote",(vvCur()||{}).credit||"")):TTS.ok?t("voiceP"):t("noTTS")}</p><div class="c"><div class="vrow"><select id="voiceSel" class="sel" ${TTS.voices.length||VV.on?"":"disabled"} aria-label="${t("voice")}"><option value="">${t("auto")}${!s.voice?(VV.on?" · "+esc((vvCur()||{}).credit||""):TTS.voices.length?" · "+esc(rankedVoices()[0].name):""):""}</option>${VV.list.map(v=>`<option value="vv${v.id}" ${"vv"+v.id===s.voice?"selected":""}>★★ ${esc(v.credit)}</option>`).join("")}${rankedVoices().map(v=>`<option value="${esc(v.voiceURI)}" ${v.voiceURI===s.voice?"selected":""}>${HQ(v)?"★ ":""}${esc(v.name)}</option>`).join("")}</select><button type="button" class="btn vtry" data-act="vtry" ${TTS.voices.length||VV.on?"":"disabled"}>${t("tryV")}</button></div></div><details class="vhelp"><summary>${t("vHelp")}</summary><div>${t("vTips")}</div></details></div>
  <div class="item"><span class="lab">${t("autoSay")}</span><p>${t("autoSayP")}</p><div class="c">${seg("autosay",[["1",t("on")],["0",t("off")]],s.autoSay?"1":"0")}</div></div>
  <div class="item"><span class="lab">${t("dir")}</span><p>${t("dirP")}</p><div class="c">${seg("pdir",[["j2z",t("j2z")],["z2j",t("z2j")],["mix",t("mix")]],s.dir)}</div></div>
  <div class="item stack"><span class="lab">${t("goal")}</span><p>${t("goalP")}</p><div class="c"><div class="goal-row"><span class="seg">${[5,10,15].map(n=>`<button data-goal="${n}" aria-pressed="${s.goal===n}">${t("cards",n)}</button>`).join("")}</span><span class="goal-num"><input id="goalNum" type="number" min="1" max="500" inputmode="numeric" value="${s.goal}" aria-label="${t("goal")}"><span>${t("goalUnit")}</span></span></div></div></div>
  <div class="item stack"><span class="lab">${t("data")}</span><p>${t("dataP")}</p><div class="c">
    <div class="iorow"><button class="btn" data-act="export">${t("exp")}</button>${S.cards.some(c=>c.seed)?`<button class="btn danger" data-act="rmseed">${t("rmSeed")}</button>`:""}</div>
    <textarea class="io" id="io" placeholder="${t("impPh")}" style="margin-top:10px"></textarea>
    <div class="iorow"><button class="btn" data-act="import">${t("imp")}</button></div></div></div></div>`;
}
const LSHORT={"zh-Hant":"繁","zh-Hans":"简","en":"EN","de":"DE","ja":"日"};
function langBox(){
  const cur=S.set.ui;
  const menu=V.langOpen?`<div class="lang-menu" role="menu">${UIS.map(([v,l])=>`<button type="button" role="menuitem" data-ui="${v}" aria-pressed="${v===cur}">${l}</button>`).join("")}</div>`:"";
  return `<button type="button" class="lang-btn" data-act="langtoggle" aria-haspopup="true" aria-expanded="${!!V.langOpen}" aria-label="${esc(LSHORT[cur]||cur)}">
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.6 3 2.6 15 0 18M12 3c-2.6 3-2.6 15 0 18"/></svg>
    <span>${esc(LSHORT[cur]||cur)}</span></button>${menu}`;
}
function render(){
  const reading=(V.view==="read"&&V.art)||(V.view==="start"&&V.sv&&V.sv.startsWith("les:"));
  if(TTS.playing&&!reading)stopAll();
  document.documentElement.lang=S.set.ui;
  const lb=$("#langBox");
  if(lb) lb.innerHTML=langBox();
  document.documentElement.style.setProperty("--read-size",S.set.size+"px");
  if(!S.set.onb){$("#tabs").innerHTML="";$("#app").innerHTML=viewWelcome();return}
  tabs();
  $("#app").innerHTML=V.view==="start"?viewStart():V.view==="read"?viewRead():V.view==="vocab"?viewVocab():V.view==="prac"?viewPrac():viewSet();
  if(V.view==="read"&&V.art&&S.set.vert&&!TTS.playing){const r=$("#reader");if(r)r.scrollLeft=r.scrollWidth}
  if(TTS.playing)hl(TTS.idx);
}


/* ---------- cloud sync: email login via Supabase (same project as 字里行间, app = "shiori") ---------- */
const SB_URL="https://ohplkgnbuupbfqctawch.supabase.co", SB_KEY="sb_publishable_S6NULzHQQrsQftADYL-0tg_8qSeJgA5", SB_APP="shiori";
const SYK="shiori-sync";
let SY=(()=>{try{return JSON.parse(localStorage.getItem(SYK))||{}}catch(e){return {}}})();
const sySave=()=>{try{localStorage.setItem(SYK,JSON.stringify(SY))}catch(e){}};
const syOn=()=>!!(SB_URL&&SB_KEY&&SY.refresh&&SY.uid);
let syBusy=false,syAgain=false,syT=null;
function sbErr(r,j){const e=new Error((j&&(j.msg||j.error_description||j.message))||("http "+r.status));e.status=r.status;e.code=j&&(j.error_code||j.code);return e}
async function sbAuth(path,body,bearer){
  const h={apikey:SB_KEY,"Content-Type":"application/json"};if(bearer)h.Authorization="Bearer "+bearer;
  const r=await fetch(SB_URL+"/auth/v1/"+path,{method:"POST",headers:h,body:JSON.stringify(body||{})});
  const j=await r.json().catch(()=>({}));if(!r.ok)throw sbErr(r,j);return j;
}
function sbKeep(j){SY.access=j.access_token;SY.refresh=j.refresh_token||SY.refresh;SY.exp=Date.now()+((j.expires_in||3600)*1000);if(j.user){SY.uid=j.user.id;SY.email=j.user.email||SY.email}sySave()}
async function sbToken(force){
  if(!force&&SY.access&&Date.now()<SY.exp-60000)return SY.access;
  try{sbKeep(await sbAuth("token?grant_type=refresh_token",{refresh_token:SY.refresh}))}
  catch(e){if(e.status===400||e.status===401){SY={email:SY.email};sySave();const x=new Error("signedout");x.signedout=1;throw x}throw e}
  return SY.access;
}
async function sbFetch(path,opt={}){
  for(let k=0;k<2;k++){
    const tok=await sbToken(k>0);
    const r=await fetch(SB_URL+path,Object.assign({},opt,{cache:"no-store",headers:Object.assign({apikey:SB_KEY,Authorization:"Bearer "+tok,"Content-Type":"application/json"},opt.headers||{})}));
    if(r.status===401&&k===0)continue;return r;
  }
}
/* adopt a remote state, keeping this device's own language and voice choices */
function adopt(st){
  const f=fresh(),keep={ui:S.set.ui,gl:S.set.gl,voice:S.set.voice};
  S=Object.assign(f,st,{set:Object.assign(f.set,st.set||{},keep)});
  S.kana=S.kana||{};S.les=S.les||{};
  try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}
}
async function syncNow(manual){
  if(!syOn())return;if(syBusy){syAgain=true;return}
  if(!navigator.onLine){if(manual){V.acctMsg=t("acctOffline");render()}return}
  syBusy=true;let changed=false;
  try{
    for(let k=0;k<3;k++){
      const r=await sbFetch(`/rest/v1/user_data?app=eq.${SB_APP}&select=data,version`);
      const rows=await r.json().catch(()=>null);if(!r.ok)throw sbErr(r,rows);
      if(!rows||!rows.length){ // first upload from this device
        const w=await sbFetch(`/rest/v1/user_data`,{method:"POST",headers:{Prefer:"return=minimal"},body:JSON.stringify({app:SB_APP,data:JSON.stringify(S),version:1})});
        if(w.status===409)continue;if(!w.ok)throw sbErr(w,await w.json().catch(()=>null));SY.ver=1;break;
      }
      const ver=rows[0].version,remote=JSON.parse(rows[0].data)||{},rT=remote.updated||0,lT=S.updated||0;
      if(rT>lT){adopt(remote);changed=true;SY.ver=ver;break}
      if(lT>rT){
        const w=await sbFetch(`/rest/v1/user_data?app=eq.${SB_APP}&version=eq.${ver}`,{method:"PATCH",headers:{Prefer:"return=representation"},body:JSON.stringify({data:JSON.stringify(S),version:ver+1,updated_at:new Date().toISOString()})});
        const j=await w.json().catch(()=>null);if(!w.ok)throw sbErr(w,j);
        if(!(j&&j.length))continue;SY.ver=ver+1;break;
      }
      SY.ver=ver;break;
    }
    SY.last=Date.now();SY.err="";sySave();
    if(manual)V.acctMsg=t("acctSynced",new Date(SY.last).toLocaleTimeString(S.set.ui));
  }catch(e){
    SY.err=e.signedout?t("acctExpired"):(e instanceof TypeError?t("acctNet"):t("acctFail"));sySave();
    if(manual)V.acctMsg=SY.err;
  }finally{
    syBusy=false;
    if(changed||manual){ if(V.view==="set"||changed) render(); }
    if(syAgain){syAgain=false;setTimeout(()=>syncNow(),500)}
  }
}
function syLater(){if(!syOn())return;clearTimeout(syT);syT=setTimeout(()=>syncNow(),15000)}
document.addEventListener("input",e=>{
  const id=e.target&&e.target.id; if(id!=="goalRange"&&id!=="goalNum") return;
  let v=Math.round(+e.target.value); if(!(v>=1)) return; v=Math.min(500,v);
  S.set.goal=v;
  const other=document.getElementById(id==="goalRange"?"goalNum":"goalRange");
  if(other) other.value=id==="goalRange"?v:Math.min(100,Math.max(5,v));
  persist();
});
document.addEventListener("toggle",e=>{ if(e.target&&e.target.classList&&e.target.classList.contains("acct-pw")) V.pwOpen=e.target.open; },true);
document.addEventListener("visibilitychange",()=>{if(!syOn())return;if(document.hidden){clearTimeout(syT);syncNow()}else syncNow()});
window.addEventListener("online",()=>syncNow());

function acctBox(){
  const msg=V.acctMsg?`<p class="acct-msg" role="status">${esc(V.acctMsg)}</p>`:"";
  if(syOn()){
    const last=SY.last?t("acctLast",new Date(SY.last).toLocaleString(S.set.ui)):t("acctNever");
    const ini=esc(((SY.email||"·")[0]||"·").toUpperCase());
    return `<div class="acct-card"><div class="acct-row"><span class="av" aria-hidden="true">${ini}</span><div class="acct-who"><b>${esc(SY.email||"")}</b><span>${esc(SY.err||last)}</span></div></div>
      <div class="iorow acct-acts"><button class="btn" data-act="acctnow">${t("acctNow")}</button><button class="btn" data-act="acctout">${t("acctOut")}</button><button class="btn danger" data-act="acctdel">${t("acctDel")}</button></div><details class="acct-pw"${V.pwOpen?" open":""}><summary>${t("acctPwSetOpen")}</summary><input id="acct-pw-set" type="password" autocomplete="new-password" placeholder="${t("acctPwSetPh")}" aria-label="${t("acctPwSetPh")}"><div class="iorow" style="margin-top:10px"><button class="btn primary" data-act="acctpwset">${t("acctPwSetBtn")}</button></div></details>${msg}</div>`;
  }
  const head=`<div class="acct-row"><span class="av av-off" aria-hidden="true">·</span><div class="acct-who"><b>${t("acctLab")}</b><span>${t("acctP")}</span></div></div>`;
  if(!V.acct||V.acct.step!==2){
    return `<div class="acct-card">${head}<div class="acct-acts"><input id="acct-email" class="sel" type="email" inputmode="email" autocomplete="email" placeholder="${t("acctEmailPh")}" value="${esc(SY.email||"")}" aria-label="${t("acctEmailPh")}">
      <div class="iorow" style="margin-top:10px"><button class="btn primary" data-act="acctsend">${t("acctSend")}</button></div><details class="acct-pw"${V.pwOpen?" open":""}><summary>${t("acctPwOpen")}</summary><input id="acct-pw" type="password" autocomplete="current-password" placeholder="${t("acctPwPh")}" aria-label="${t("acctPwPh")}"><div class="iorow" style="margin-top:10px"><button class="btn primary" data-act="acctpwlogin">${t("acctPwLogin")}</button></div></details></div>${msg}</div>`;
  }
  return `<div class="acct-card">${head}<div class="acct-acts"><p style="margin:0 0 10px;font-size:14px">${t("acctSent",esc(V.acct.email))}</p>
    <input id="acct-code" class="sel" inputmode="numeric" autocomplete="one-time-code" placeholder="${t("acctCodePh")}" aria-label="${t("acctCodePh")}">
    <div class="iorow" style="margin-top:10px"><button class="btn primary" data-act="acctverify">${t("acctVerify")}</button><button class="btn" data-act="acctsend">${t("acctResend")}</button></div></div>${msg}</div>`;
}
async function acctSend(){
  const e=((document.getElementById("acct-email")||{}).value||"").trim().toLowerCase();
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e)){V.acctMsg=t("acctBadEmail");render();return}
  V.acctMsg=t("acctSending");render();
  try{const otp=c=>sbAuth("otp?redirect_to="+encodeURIComponent(location.origin+location.pathname),{email:e,create_user:c});try{await otp(true)}catch(e1){if(/duplicate key|users_email|already registered|exists/i.test(e1.message||""))await otp(false);else throw e1}V.acct={step:2,email:e};V.acctMsg=""}
  catch(err){V.acctMsg=err.status===429?t("acctRate"):t("acctFail")}
  render();
}
async function acctVerify(){
  const raw=((document.getElementById("acct-code")||{}).value||"").trim();let body;
  if(/token=/.test(raw)){ // a pasted login link also works
    let q;try{q=new URL(raw).searchParams}catch(e){q=new URLSearchParams(raw.slice(raw.indexOf("?")+1))}
    const tk=q.get("token")||q.get("token_hash"),ty=q.get("type");
    if(!tk){V.acctMsg=t("acctBadLink");render();return}
    body={type:ty==="signup"?"signup":ty==="invite"?"invite":"magiclink",token_hash:tk};
  }else{
    const code=raw.replace(/\s/g,"");
    if(!/^\d{6,10}$/.test(code)){V.acctMsg=t("acctBadCode");render();return}
    body={type:"email",email:V.acct.email,token:code};
  }
  V.acctMsg=t("acctSigning");render();
  try{
    const j=await sbAuth("verify",body);
    SY={email:V.acct.email};sbKeep(j);V.acct=null;V.acctMsg="";
    await syncNow(true);
  }catch(err){
    V.acctMsg=(/expired|invalid/i.test((err.code||"")+(err.message||""))||err.status===403)?t("acctWrongCode"):t("acctFail");render();
  }
}
async function acctOut(){
  if(!confirm(t("acctConfirmOut")))return;
  try{await sbAuth("logout",{},SY.access)}catch(e){}
  SY={email:SY.email};sySave();V.acctMsg="";clearTimeout(syT);render();
}
async function acctDelete(){
  if(!confirm(t("acctConfirmDel")))return;
  try{const r=await sbFetch("/rest/v1/rpc/delete_me",{method:"POST",body:"{}"});if(!r.ok)throw sbErr(r,await r.json().catch(()=>null));
    SY={};sySave();V.acctMsg=t("acctDeleted")}
  catch(err){V.acctMsg=t("acctFail")}
  render();
}

async function acctPwLogin(){
  const e=((document.getElementById("acct-email")||{}).value||"").trim().toLowerCase(), pw=(document.getElementById("acct-pw")||{}).value||"";
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e)){V.acctMsg=t("acctBadEmail");render();return}
  if(!pw){V.acctMsg=t("acctPwNeed");render();return}
  V.acctMsg=t("acctSigning");render();
  try{ const j=await sbAuth("token?grant_type=password",{email:e,password:pw}); SY={email:e};sbKeep(j);V.acct=null;V.acctMsg="";await syncNow(true); }
  catch(err){ V.acctMsg=err.status===400?t("acctPwWrong"):err.status===429?t("acctRate"):t("acctFail"); render(); }
}
async function acctPwSet(){
  const pw=(document.getElementById("acct-pw-set")||{}).value||"";
  if(pw.length<8){V.acctMsg=t("acctPwShort");render();return}
  try{ const tok=await sbToken(); const r=await fetch(SB_URL+"/auth/v1/user",{method:"PUT",headers:{apikey:SB_KEY,Authorization:"Bearer "+tok,"Content-Type":"application/json"},body:JSON.stringify({password:pw})});
    if(!r.ok) throw sbErr(r,await r.json().catch(()=>null)); V.acctMsg=t("acctPwSaved"); }
  catch(err){ V.acctMsg=/weak|short|characters/i.test(err.message||"")?t("acctPwShort"):t("acctFail"); }
  render();
}

const ACCT={
"zh-Hant":{acctLab:"帳號與雲端同步",acctP:"登入後，學習進度、單字本和已讀紀錄會在你的各台裝置之間同步。不登入也能完整使用，資料只存在這台裝置上。兩台裝置都有資料時，以最近修改的為準。",acctEmailPh:"你的電子郵件",acctSend:"寄送登入碼",acctResend:"重新寄送",acctCodePh:"信中的 6 位數字（或貼上信中的登入連結）",acctVerify:"登入",acctSent:e=>`登入碼已寄到 ${e}。沒收到的話，看看垃圾郵件。`,acctNow:"立即同步",acctOut:"登出",acctDel:"刪除帳號與雲端資料",acctNever:"還沒同步過。",acctLast:x=>`上次同步：${x}`,acctSynced:x=>`已同步 · ${x}`,acctSending:"正在寄送…",acctBadEmail:"請填一個有效的電子郵件。",acctRate:"寄送太頻繁，請過一分鐘再試。",acctFail:"操作沒有成功，請稍後再試。",acctBadCode:"請輸入信中的數字登入碼，或貼上信中的登入連結。",acctBadLink:"這個連結不完整，請重新複製。",acctSigning:"正在登入…",acctWrongCode:"登入碼不對或已過期，請重新寄送。",acctExpired:"登入已過期，請重新登入。",acctNet:"暫時連不上網路，恢復後會自動再試。",acctOffline:"現在離線，連上網路後會自動同步。",acctConfirmOut:"登出？本機資料會保留。",acctConfirmDel:"永久刪除帳號與雲端的同步資料？這台裝置上的資料會保留。",acctDeleted:"帳號與雲端資料已刪除。"},
"zh-Hans":{acctLab:"账号与云端同步",acctP:"登录后，学习进度、单词本和已读记录会在你的各台设备之间同步。不登录也能完整使用，数据只保存在这台设备上。两台设备都有数据时，以最近修改的为准。",acctEmailPh:"你的邮箱",acctSend:"发送登录码",acctResend:"重新发送",acctCodePh:"邮件里的 6 位数字（或粘贴邮件里的登录链接）",acctVerify:"登录",acctSent:e=>`登录码已发到 ${e}。没收到的话看看垃圾邮件。`,acctNow:"立即同步",acctOut:"退出登录",acctDel:"删除账号和云端数据",acctNever:"还没同步过。",acctLast:x=>`上次同步：${x}`,acctSynced:x=>`已同步 · ${x}`,acctSending:"正在发送…",acctBadEmail:"请填一个有效的邮箱。",acctRate:"发送太频繁，请过一分钟再试。",acctFail:"操作没有成功，请稍后再试。",acctBadCode:"请输入邮件里的数字登录码，或粘贴邮件里的登录链接。",acctBadLink:"这个链接不完整，请重新复制。",acctSigning:"正在登录…",acctWrongCode:"登录码不对或已过期，请重新发送。",acctExpired:"登录已过期，请重新登录。",acctNet:"暂时连不上网络，恢复后会自动再试。",acctOffline:"现在离线，连上网络后会自动同步。",acctConfirmOut:"退出登录？本机数据会保留。",acctConfirmDel:"永久删除账号和云端的同步数据？这台设备上的数据会保留。",acctDeleted:"账号和云端数据已删除。"},
"en":{acctLab:"Account & cloud sync",acctP:"Sign in to keep your progress, vocabulary and read marks in sync across your devices. You can use Shiori fully without an account; then your data stays on this device only. If two devices both have data, the most recently changed one wins.",acctEmailPh:"Your email",acctSend:"Send login code",acctResend:"Send again",acctCodePh:"6-digit code from the email (or paste the login link from it)",acctVerify:"Sign in",acctSent:e=>`A login code was sent to ${e}. Check your spam folder if it doesn't arrive.`,acctNow:"Sync now",acctOut:"Sign out",acctDel:"Delete account & cloud data",acctNever:"Not synced yet.",acctLast:x=>`Last synced: ${x}`,acctSynced:x=>`Synced · ${x}`,acctSending:"Sending…",acctBadEmail:"Please enter a valid email address.",acctRate:"Too many requests. Please wait a minute.",acctFail:"That didn't work. Please try again later.",acctBadCode:"Enter the numeric code from the email, or paste the login link from it.",acctBadLink:"That link is incomplete. Please copy it again.",acctSigning:"Signing in…",acctWrongCode:"The code is wrong or has expired. Please send a new one.",acctExpired:"Your session has expired. Please sign in again.",acctNet:"No connection for now. It will retry automatically.",acctOffline:"You're offline. Sync will run when you're back online.",acctConfirmOut:"Sign out? Data on this device is kept.",acctConfirmDel:"Permanently delete your account and cloud sync data? Data on this device is kept.",acctDeleted:"Account and cloud data deleted."},
"de":{acctLab:"Konto & Cloud-Sync",acctP:"Melde dich an, damit Lernfortschritt, Wortliste und gelesene Artikel auf allen deinen Geräten gleich sind. Ohne Konto funktioniert Shiori vollständig, die Daten bleiben dann nur auf diesem Gerät. Haben zwei Geräte Daten, gewinnt die zuletzt geänderte Version.",acctEmailPh:"Deine E-Mail",acctSend:"Login-Code senden",acctResend:"Erneut senden",acctCodePh:"6-stelliger Code aus der E-Mail (oder den Login-Link daraus einfügen)",acctVerify:"Anmelden",acctSent:e=>`Ein Login-Code wurde an ${e} gesendet. Schau im Spam-Ordner nach, falls er nicht ankommt.`,acctNow:"Jetzt synchronisieren",acctOut:"Abmelden",acctDel:"Konto & Cloud-Daten löschen",acctNever:"Noch nicht synchronisiert.",acctLast:x=>`Zuletzt synchronisiert: ${x}`,acctSynced:x=>`Synchronisiert · ${x}`,acctSending:"Wird gesendet…",acctBadEmail:"Bitte gib eine gültige E-Mail-Adresse ein.",acctRate:"Zu viele Anfragen. Bitte warte eine Minute.",acctFail:"Das hat nicht geklappt. Bitte versuche es später noch einmal.",acctBadCode:"Gib den Zahlencode aus der E-Mail ein oder füge den Login-Link daraus ein.",acctBadLink:"Dieser Link ist unvollständig. Bitte kopiere ihn erneut.",acctSigning:"Anmeldung läuft…",acctWrongCode:"Der Code ist falsch oder abgelaufen. Bitte sende einen neuen.",acctExpired:"Die Sitzung ist abgelaufen. Bitte melde dich erneut an.",acctNet:"Gerade keine Verbindung. Es wird automatisch erneut versucht.",acctOffline:"Du bist offline. Die Synchronisation läuft, sobald du wieder online bist.",acctConfirmOut:"Abmelden? Die Daten auf diesem Gerät bleiben erhalten.",acctConfirmDel:"Konto und Cloud-Sync-Daten endgültig löschen? Die Daten auf diesem Gerät bleiben erhalten.",acctDeleted:"Konto und Cloud-Daten gelöscht."},
"ja":{acctLab:"アカウントとクラウド同期",acctP:"ログインすると、学習の進み具合・単語帳・既読の記録を複数の端末で同期できます。ログインしなくても全機能を使えますが、その場合データはこの端末にだけ保存されます。両方の端末にデータがある場合は、最後に更新された方が優先されます。",acctEmailPh:"メールアドレス",acctSend:"ログインコードを送る",acctResend:"再送信",acctCodePh:"メールの6桁の数字（またはメール内のログインリンク）",acctVerify:"ログイン",acctSent:e=>`${e} にログインコードを送信しました。届かない場合は迷惑メールフォルダをご確認ください。`,acctNow:"今すぐ同期",acctOut:"ログアウト",acctDel:"アカウントとクラウドのデータを削除",acctNever:"まだ同期していません。",acctLast:x=>`最終同期：${x}`,acctSynced:x=>`同期しました · ${x}`,acctSending:"送信中…",acctBadEmail:"有効なメールアドレスを入力してください。",acctRate:"送信回数が多すぎます。1分ほど待ってください。",acctFail:"うまくいきませんでした。しばらくしてからもう一度お試しください。",acctBadCode:"メールの数字コードを入力するか、メール内のログインリンクを貼り付けてください。",acctBadLink:"リンクが不完全です。もう一度コピーしてください。",acctSigning:"ログイン中…",acctWrongCode:"コードが違うか、期限切れです。新しいコードを送ってください。",acctExpired:"ログインの期限が切れました。もう一度ログインしてください。",acctNet:"今は接続できません。自動的に再試行します。",acctOffline:"オフラインです。オンラインに戻ると同期します。",acctConfirmOut:"ログアウトしますか？この端末のデータは残ります。",acctConfirmDel:"アカウントとクラウドの同期データを完全に削除しますか？この端末のデータは残ります。",acctDeleted:"アカウントとクラウドのデータを削除しました。"}
};
const ACCT2={
"zh-Hant":{acctPwOpen:"用密碼登入",acctPwSetOpen:"設定密碼（之後可用密碼登入）",acctPwPh:"密碼",acctPwLogin:"用密碼登入",acctPwSetPh:"新密碼（至少 8 位）",acctPwSetBtn:"儲存密碼",acctPwNeed:"請輸入密碼。",acctPwWrong:"郵箱或密碼不對。還沒設定過密碼的話，請先用登入碼登入。",acctPwShort:"密碼至少 8 位，請換一個更長的。",acctPwSaved:"密碼已設定。其他裝置可以用郵箱加密碼登入了。"},
"zh-Hans":{acctPwOpen:"用密码登录",acctPwSetOpen:"设置密码（之后可用密码登录）",acctPwPh:"密码",acctPwLogin:"用密码登录",acctPwSetPh:"新密码（至少 8 位）",acctPwSetBtn:"保存密码",acctPwNeed:"请输入密码。",acctPwWrong:"邮箱或密码不对。还没设置过密码的话，请先用登录码登录。",acctPwShort:"密码至少 8 位，请换一个更长的。",acctPwSaved:"密码已设置。其他设备可以用邮箱加密码登录了。"},
"en":{acctPwOpen:"Sign in with password",acctPwSetOpen:"Set a password (to sign in later)",acctPwPh:"Password",acctPwLogin:"Sign in with password",acctPwSetPh:"New password (min. 8 characters)",acctPwSetBtn:"Save password",acctPwNeed:"Please enter your password.",acctPwWrong:"Wrong email or password. If you haven't set one yet, sign in with a code first.",acctPwShort:"Password must be at least 8 characters.",acctPwSaved:"Password saved. You can now sign in with email and password on other devices."},
"de":{acctPwOpen:"Mit Passwort anmelden",acctPwSetOpen:"Passwort festlegen (für späteres Anmelden)",acctPwPh:"Passwort",acctPwLogin:"Mit Passwort anmelden",acctPwSetPh:"Neues Passwort (mind. 8 Zeichen)",acctPwSetBtn:"Passwort speichern",acctPwNeed:"Bitte gib dein Passwort ein.",acctPwWrong:"E-Mail oder Passwort falsch. Wenn du noch keins festgelegt hast, melde dich zuerst mit dem Code an.",acctPwShort:"Das Passwort muss mindestens 8 Zeichen lang sein.",acctPwSaved:"Passwort gespeichert. Du kannst dich jetzt auf anderen Geräten mit E-Mail und Passwort anmelden."},
"ja":{acctPwOpen:"パスワードでログイン",acctPwSetOpen:"パスワードを設定（次回以降のログイン用）",acctPwPh:"パスワード",acctPwLogin:"パスワードでログイン",acctPwSetPh:"新しいパスワード（8文字以上）",acctPwSetBtn:"パスワードを保存",acctPwNeed:"パスワードを入力してください。",acctPwWrong:"メールアドレスまたはパスワードが違います。まだ設定していない場合は、先にコードでログインしてください。",acctPwShort:"パスワードは8文字以上にしてください。",acctPwSaved:"パスワードを設定しました。他の端末でもメールとパスワードでログインできます。"}
};
const ACCT3={
"zh-Hant":{acctLinkOld:"這個登入連結已過期或已用過。請在下面重新寄送。",acctLinkOk:"已透過郵件連結登入。"},
"zh-Hans":{acctLinkOld:"这个登录链接已过期或已用过。请在下面重新发送。",acctLinkOk:"已通过邮件链接登录。"},
"en":{acctLinkOld:"This sign-in link has expired or was already used. Please send a new one below.",acctLinkOk:"Signed in via the email link."},
"de":{acctLinkOld:"Dieser Anmeldelink ist abgelaufen oder wurde schon benutzt. Bitte unten einen neuen anfordern.",acctLinkOk:"Über den E-Mail-Link angemeldet."},
"ja":{acctLinkOld:"このログインリンクは期限切れか、すでに使われています。下から新しく送ってください。",acctLinkOk:"メールのリンクでログインしました。"}
};
for(const k in ACCT3) Object.assign(I18N[k],ACCT3[k]);
const GOALI={"zh-Hant":{goalUnit:"張"},"zh-Hans":{goalUnit:"张"},"en":{goalUnit:"cards"},"de":{goalUnit:"Karten"},"ja":{goalUnit:"枚"}};
for(const k in GOALI) Object.assign(I18N[k],GOALI[k]);
for(const k in ACCT2) Object.assign(I18N[k],ACCT2[k]);
for(const k in ACCT) Object.assign(I18N[k],ACCT[k]);

/* ---------- speech ---------- */
const SPK='<svg class="spk" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9h4l5-4v14l-5-4H4z" fill="currentColor"/><path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12" stroke="currentColor" stroke-width="1.8" fill="none" stroke-linecap="round"/></svg>';
const TTS={ok:"speechSynthesis" in window,voices:[],playing:false,paused:false,idx:-1,gen:0};
function loadVoices(){if(!TTS.ok)return;try{TTS.voices=speechSynthesis.getVoices().filter(v=>/^ja/i.test(v.lang))}catch(e){TTS.voices=[]}}
if(TTS.ok){loadVoices();try{speechSynthesis.addEventListener("voiceschanged",()=>{loadVoices();if(V.view==="set")render()})}catch(e){}}
const NOVELTY=/\b(eddy|flo|grandma|grandpa|reed|rocko|sandy|shelley|albert|bahh|bells|boing|bubbles|cellos|jester|organ|superstar|trinoids|whisper|wobble|zarvox|bad news|good news)\b/i;
function vScore(v){const n=v.name||"";let s=0;if(/natural|neural|online|wavenet/i.test(n))s+=60;if(/premium|enhanced|高品質|高音質|拡張|增強|增强|erweitert|optimiert/i.test(n))s+=45;if(/google/i.test(n))s+=30;if(/siri/i.test(n))s+=25;if(/compact|簡易|简易/i.test(n))s-=15;if(NOVELTY.test(n))s-=40;if(/ja[-_]JP/i.test(v.lang))s+=5;if(v.localService===false)s+=3;return s}
const HQ=v=>vScore(v)>=30;
function rankedVoices(){return TTS.voices.slice().sort((a,b)=>vScore(b)-vScore(a)||String(a.name).localeCompare(String(b.name)))}
function pickVoice(){return TTS.voices.find(v=>v.voiceURI===S.set.voice)||rankedVoices()[0]||null}
function utter(text,rate){const u=new SpeechSynthesisUtterance(text);u.lang="ja-JP";const v=pickVoice();if(v)u.voice=v;u.rate=rate||S.set.rate;return u}
let warned=false;function noVoiceOnce(){if(!warned){warned=true;toast(t("noVoice"))}}
/* pre-recorded VOICEVOX audio (audio/manifest.json), falls back to device speech */
const VV_VOICES=[{id:118,name:"夜語トバリ"}];
const VV={on:false,list:[]};
function h32(s,seed){let h=seed>>>0;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)>>>0}return h.toString(16).padStart(8,"0")}
const vkey=s=>{s=String(s).trim();return h32(s,2166136261)+h32(s,0x9747b28c)};
VV_VOICES.forEach(vc=>{try{fetch(`audio/v${vc.id}/manifest.json`,{cache:"no-cache"}).then(r=>r.ok?r.json():null).then(m=>{if(m&&m.keys&&m.keys.length){VV.list.push({id:m.id,name:m.name,credit:m.credit,keys:new Set(m.keys)});VV.list.sort((a,b)=>VV_VOICES.findIndex(x=>x.id===a.id)-VV_VOICES.findIndex(x=>x.id===b.id));VV.on=true;try{if(V.view==="set")render();else updPlayer()}catch(e){}}}).catch(()=>{})}catch(e){}});
const vvCur=()=>VV.list.find(v=>"vv"+v.id===S.set.voice)||VV.list[0]||null;
const useVV=()=>VV.on&&(!S.set.voice||/^vv\d*$/.test(S.set.voice));
function vvSrc(text){if(!useVV())return null;const v=vvCur();if(!v)return null;const k=vkey(text);return v.keys.has(k)?`audio/v${v.id}/${k}.mp3`:null}
let AU=null;
function deviceSpeak(text,rate,onend,onerr){TTS.cur="ss";if(!TTS.ok){toast(t("noTTS"));setTimeout(stopAll,0);return}if(!TTS.voices.length)loadVoices();if(!TTS.voices.length)noVoiceOnce();
  const u=utter(text,rate);if(onend)u.onend=onend;if(onerr)u.onerror=onerr;try{speechSynthesis.speak(u)}catch(e){toast(t("noTTS"))}}
function speakOne(text,rate,onend,onerr,auRate){const src=vvSrc(text);
  if(!src){deviceSpeak(text,rate,onend,onerr);return}
  TTS.cur="au";AU=AU||new Audio();const a=AU,g=TTS.gen;let fell=false;const fb=()=>{if(fell||g!==TTS.gen)return;fell=true;a.onended=a.onerror=null;deviceSpeak(text,rate,onend,onerr)};
  a.onended=onend||null;a.onerror=fb;a.src=src;const r=auRate||rate||S.set.rate;a.defaultPlaybackRate=r;a.playbackRate=r;try{a.preservesPitch=true;a.webkitPreservesPitch=true}catch(e){}
  try{const p=a.play();if(p&&p.catch)p.catch(e=>{if(e&&e.name==="AbortError")return;fb()})}catch(e){fb()}}
function say(text){if(!text)return;stopAll();speakOne(text)}
/* example word for each kana (trial): hiragana key -> [word, romaji, zh-Hant, zh-Hans, en, de, ja] */
const KEX=CONTENT.kana;
function kexOf(k){const h=String(k||"").replace(/[\u30A1-\u30F6]/g,c=>String.fromCharCode(c.charCodeAt(0)-0x60));return KEX[h]||null}
/* kana chart: read the single kana three times, slower, with short pauses, then the example word */
function sayKana(k){stopAll();const g=TTS.gen;let n=0;const ex=kexOf(k);
  const go=()=>{if(g!==TTS.gen)return;
    if(n<3){const nx=()=>{n++;setTimeout(go,450)};speakOne(k,0.6,nx,nx,0.85);return}
    if(ex)speakOne(ex[0])};go();}
function hl(i){document.querySelectorAll(".sen.reading").forEach(e=>e.classList.remove("reading"));if(i<0)return;const el=document.querySelector(`.sen[data-i="${i}"]`);if(el){el.classList.add("reading");try{el.scrollIntoView({block:"nearest",inline:"nearest",behavior:matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth"})}catch(e){}}}
function playFrom(i){if(!TTS.ok&&!VV.on){toast(t("noTTS"));return}stopAll();
  const g=++TTS.gen;TTS.playing=true;TTS.paused=false;
  const step=k=>{if(g!==TTS.gen)return;if(k>=SENTS.length){TTS.playing=false;TTS.idx=-1;hl(-1);updPlayer();return}
    if(!SENTS[k].replace(/[「」、。！？\s]/g,"")){step(k+1);return}
    TTS.idx=k;hl(k);updPlayer();speakOne(SENTS[k],undefined,()=>{if(g===TTS.gen)step(k+1)},ev=>{if(g===TTS.gen&&ev.error!=="interrupted"&&ev.error!=="canceled")step(k+1)})};
  step(i);}
function stopAll(){TTS.gen++;TTS.playing=false;TTS.paused=false;TTS.idx=-1;if(AU){AU.onended=AU.onerror=null;try{AU.pause()}catch(e){}}try{if(TTS.ok)speechSynthesis.cancel()}catch(e){}hl(-1);updPlayer()}
function togglePause(){if(!TTS.playing)return;try{if(TTS.cur==="au"&&AU){if(TTS.paused){AU.play();TTS.paused=false}else{AU.pause();TTS.paused=true}}else if(TTS.paused){speechSynthesis.resume();TTS.paused=false}else{speechSynthesis.pause();TTS.paused=true}}catch(e){}updPlayer()}
function playerHTML(){const rates=[[0.7,"0.7×"],[0.9,"0.9×"],[1.1,"1.1×"]];
  return `${TTS.playing?`<button class="btn" data-act="tpause">${SPK}${TTS.paused?t("resume"):t("pause")}</button><button class="btn ghost" data-act="tstop">${t("stop")}</button>`:`<button class="btn primary" data-act="tplay">${SPK}${t("listen")}</button>`}
  <span class="seg" role="group" aria-label="${t("speed")}">${rates.map(([v,l])=>`<button data-rate="${v}" aria-pressed="${S.set.rate===v}">${l}</button>`).join("")}</span>${useVV()?`<span class="vvcredit">${esc((vvCur()||{}).credit||"")}</span>`:""}`}
function updPlayer(){const p=$("#player");if(p)p.innerHTML=playerHTML()}

/* ---------- sheet ---------- */
function closeSheet(){$("#layer").innerHTML="";document.querySelectorAll(".an.on").forEach(e=>e.classList.remove("on"))}
function openGloss(el){
  const a=findArt(el.dataset.a), w=el.dataset.w, r=el.dataset.r, g=aGloss(a,w);
  el.classList.add("on");
  $("#layer").innerHTML=`<div class="scrim" data-act="close"></div><div class="sheet" role="dialog" aria-label="${esc(w)}"><div class="wrap">
  <div class="whead"><span class="w" lang="ja">${esc(w)}</span>${r!==w?`<span class="r" lang="ja">${esc(r)}</span>`:""}${S.set.romaji?`<span class="r ro">${esc(romaji(r))}</span>`:""}<button class="iconbtn" data-say="${esc(r)}" aria-label="${t("say")}">${SPK}</button></div>
  <div class="m">${esc(g.m)}</div>${g.n?`<div class="n">${esc(g.n)}</div>`:""}
  <div class="ex" lang="ja">${esc(el.dataset.s)}</div>
  <div class="row left"><button class="btn ghost sm" data-say="${esc(SENTS[+el.dataset.i]||el.dataset.s)}">${SPK}${t("sayLine")}</button><button class="btn ghost sm" data-from="${el.dataset.i}">${t("fromHere")}</button></div>
  <div class="row"><button class="btn ghost" data-act="close">${t("cancel")}</button>
  <button class="btn ${has(w)?"ghost":"primary"}" ${has(w)?"disabled":""} data-act="savegloss" data-w="${esc(w)}" data-r="${esc(r)}" data-a="${a.id}" data-s="${esc(el.dataset.s)}">${has(w)?t("added"):t("add")}</button></div></div></div>`;
}
function openCustom(word,sentence){
  const a=findArt(V.art||(V.sv&&V.sv.slice(4)));
  $("#layer").innerHTML=`<div class="scrim" data-act="close"></div><div class="sheet" role="dialog"><form class="wrap" id="selForm">
  <div class="grid2"><label>${t("word")}<input id="s_w" value="${esc(word)}" lang="ja" required></label><label>${t("reading")}<input id="s_r" lang="ja"></label></div>
  <label>${t("meaning")}<input id="s_m" required></label>
  <label>${t("example")}<textarea id="s_ex" rows="2" lang="ja">${esc(sentence)}</textarea></label>
  <div class="row"><button type="button" class="btn ghost" data-act="close">${t("cancel")}</button><button class="btn primary">${t("save")}</button></div></form></div>`;
  $("#selForm").dataset.src=a?(a.title||a.t):"";
  setTimeout(()=>{const m=$("#s_r");m&&m.focus()},50);
}
function addCard(o){S.cards.push(Object.assign({id:uid(),r:"",ex:"",note:"",src:"",box:0,due:todayStr()},o));persist();toast(t("savedT"))}

/* ---------- events ---------- */
document.addEventListener("click",e=>{
  const b=e.target.closest("[data-showall],[data-say],[data-from],[data-rate],[data-voice],[data-autosay],[data-tab],[data-art],[data-act],[data-fg],[data-vert],[data-ui],[data-gl],[data-mode],[data-romaji],[data-wlang],[data-wmode],[data-sv],[data-ks],[data-kana],[data-kqset],[data-kqdir],[data-kpick],[data-addles],[data-addcat],[data-pdir],[data-goal],[data-lvl],[data-del],[data-ans],.an,#card");
  if(!b)return; const d=b.dataset;
  if(d.say!==undefined){e.stopPropagation();say(d.say);return}
  if(d.kana){V.kanaSel=d.kana;render();sayKana(d.kana);return}
  if(d.from!==undefined){closeSheet();playFrom(+d.from);return}
  if(d.rate){S.set.rate=+d.rate;persist();if(V.view==="set")render();else updPlayer();return}
  if(d.showall){S.set.showAll=d.showall==="1";persist();render();return}
  if(d.autosay){S.set.autoSay=d.autosay==="1";persist();render();return}
  if(d.wlang){S.set.ui=d.wlang;S.set.gl=d.wlang;render();return}
  if(d.wmode){S.set.mode=d.wmode;S.set.romaji=d.wmode==="begin";render();return}
  if(d.tab){V.view=d.tab;V.art=null;V.sess=null;V.confirm=null;V.sv=null;V.kq=null;closeSheet();render();scrollTo(0,0);return}
  if(d.sv){V.sv=d.sv;V.kq=null;render();scrollTo(0,0);return}
  if(d.ks){V.ks=d.ks;V.kscript=d.ks;V.kq=null;render();return}
  if(d.kqset){V.kqSet=d.kqset;render();return}
  if(d.kqdir){V.kqDir=d.kqdir;render();return}
  if(d.kpick){const s=V.kq;if(!s||s.pick!==null)return;const it=s.q[s.i],ok=d.kpick===it.k;s.pick=d.kpick;
    const v=S.kana[it.k]||[0,0];if(ok){v[0]++;s.ok++}else v[1]++;S.kana[it.k]=v;persist();say(it.k);render();return}
  if(d.addles){const l=LESSONS.find(x=>x.id===d.addles);addWords(l.vocab.map(v=>({w:v[0],r:v[1]===v[0]?"":v[1],m:l.vm[v[0]].m["zh-Hant"],mi:l.vm[v[0]].m,src:l.t})),l.t);render();return}
  if(d.addcat){const c=STARTER.find(x=>x.id===d.addcat);addWords(c.w.map(x=>({w:x[0],r:x[1]===x[0]?"":x[1],m:x.m["zh-Hant"],mi:x.m})),tri(c.l));render();return}
  if(d.art){V.art=d.art;V.view="read";V.sv=null;render();scrollTo(0,0);return}
  if(b.classList.contains("an")){openGloss(b);return}
  if(b.id==="card"&&!V.flip){V.flip=true;render();if(S.set.autoSay&&V.sess){const c=S.cards.find(x=>x.id===V.sess.q[V.sess.i]);if(c)say(c.r||c.w)}return}
  if(d.lvl){S.set.lvl=d.lvl;persist();render();return}
  if(d.fg){S.set.fg=d.fg;persist();render();return}
  if(d.vert!==undefined){S.set.vert=d.vert==="1";persist();render();return}
  if(d.ui){S.set.ui=d.ui;if(d.ui!=="ja")S.set.gl=d.ui;V.langOpen=false;persist();render();return}
  if(d.gl){S.set.gl=d.gl;persist();render();return}
  if(d.mode){S.set.mode=d.mode;persist();render();return}
  if(d.romaji!==undefined){S.set.romaji=d.romaji==="1";persist();render();return}
  if(d.pdir){S.set.dir=d.pdir;persist();render();return}
  if(d.goal){S.set.goal=+d.goal;persist();render();return}
  if(d.del){if(V.confirm===d.del){S.cards=S.cards.filter(c=>c.id!==d.del);V.confirm=null;persist()}else V.confirm=d.del;render();return}
  if(d.ans){const s=V.sess,c=S.cards.find(x=>x.id===s.q[s.i]),a=+d.ans,td=todayStr();
    if(a===0){c.box=0;c.due=td;if(!s.re[c.id]){s.q.push(c.id);s.re[c.id]=1}}
    else if(a===1){c.box=Math.max(1,c.box);c.due=addDays(td,1)}
    else{c.box=Math.min(c.box+1,IV.length-1);c.due=addDays(td,IV[c.box])}
    S.log[td]=(S.log[td]||0)+1;s.n++;s.i++;V.flip=false;persist();render();return}
  switch(d.act){
    case "welgo":{S.set.onb=true;if(S.set.mode==="begin"){S.cards=S.cards.filter(c=>!c.seed);const g=STARTER[0];g.w.forEach(x=>S.cards.push({id:uid(),w:x[0],r:x[1]===x[0]?"":x[1],m:x.m["zh-Hant"],mi:x.m,ex:"",note:"",src:"",box:0,due:todayStr(),seed:true}));S.set.fg="all";V.view="start"}else V.view="read";persist();render();scrollTo(0,0);break}
    case "sback":V.sv=null;V.kq=null;render();scrollTo(0,0);break;
    case "kqstart":newQuiz();render();break;
    case "kqnext":V.kq.i++;V.kq.pick=null;render();break;
    case "togtr":V.showTr=!V.showTr;render();break;
    case "togptr":V.showPtr=!V.showPtr;render();break;
    case "lesdone":S.les[d.l]=!S.les[d.l];persist();render();break;
    case "tplay":playFrom(0);break;
    case "tpause":togglePause();break;
    case "tstop":stopAll();break;
    case "back":V.art=null;render();scrollTo(0,0);break;
    case "markread":S.read[V.art]=!S.read[V.art];persist();render();break;
    case "close":closeSheet();break;
    case "savegloss":{const a=findArt(d.a),g=aGloss(a,d.w),al=allGloss(a,d.w);addCard({w:d.w,r:d.r===d.w?"":d.r,m:g.m||"",note:g.n||"",mi:al.mi,ni:a.les?undefined:al.ni,ex:d.s,src:a.title||a.t});closeSheet();render();break}
    case "openadd":V.showAdd=true;render();setTimeout(()=>$("#f_w")&&$("#f_w").focus(),30);break;
    case "closeadd":V.showAdd=false;render();break;
    case "start":{const rem=S.set.goal-(S.log[todayStr()]||0);V.sess={q:dueCards().slice(0,rem>0?rem:S.set.goal).map(c=>c.id),i:0,n:0,re:{}};V.flip=false;render();break}
    case "export":{const txt=JSON.stringify({app:"shiori",v:2,cards:S.cards,log:S.log,read:S.read,kana:S.kana,les:S.les});const io=$("#io");io.value=txt;
      try{navigator.clipboard.writeText(txt).then(()=>toast(t("copied")),()=>{io.select();toast(t("copyFail"))})}catch(err){io.select();toast(t("copyFail"))}break}
    case "import":{try{const o=JSON.parse($("#io").value);if(!Array.isArray(o.cards))throw 0;let n=0;
      o.cards.forEach(c=>{if(c&&c.w&&!S.cards.some(x=>x.w===c.w)){S.cards.push(Object.assign({id:uid(),r:"",m:"",ex:"",note:"",box:0,due:todayStr()},c));n++}});
      Object.assign(S.log,o.log||{});Object.assign(S.read,o.read||{});Object.assign(S.kana,o.kana||{});Object.assign(S.les,o.les||{});persist();render();toast(t("imported",n))}catch(err){toast(t("badImport"))}break}
    case "rmseed":S.cards=S.cards.filter(c=>!c.seed);persist();render();toast(t("removedSeed"));break;
    case "acctsend":acctSend();break;
    case "acctverify":acctVerify();break;
    case "acctnow":syncNow(true);break;
    case "acctout":acctOut();break;
    case "acctdel":acctDelete();break;
    case "acctpwlogin":acctPwLogin();break;
    case "acctpwset":acctPwSet();break;
    case "langtoggle":V.langOpen=!V.langOpen;render();break;
  }
});
document.addEventListener("keydown",e=>{
  if(e.key==="Escape")closeSheet();
  if((e.key==="Enter"||e.key===" ")&&e.target.classList&&(e.target.classList.contains("an")||e.target.id==="card")){e.preventDefault();e.target.click()}
});
document.addEventListener("change",e=>{if(e.target.id==="voiceSel"){S.set.voice=e.target.value;persist();say("こんにちは。栞へようこそ。今日も、少しずつ読んでいきましょう。")}});
document.addEventListener("click",e=>{const b=e.target.closest('[data-act="vtry"]');if(b){e.preventDefault();e.stopPropagation();say("こんにちは。栞へようこそ。今日も、少しずつ読んでいきましょう。")}},true);
document.addEventListener("input",e=>{
  if(e.target.id==="q"&&!e.isComposing)doSearch(e.target);
  if(e.target.id==="size"){S.set.size=+e.target.value;persist();document.documentElement.style.setProperty("--read-size",S.set.size+"px");const p=e.target.closest(".item").querySelector("p");p.style.fontSize=S.set.size+"px"}
});
function doSearch(el){V.q=el.value;const pos=el.selectionStart;render();const q=$("#q");q.focus();try{q.setSelectionRange(pos,pos)}catch(err){}}
document.addEventListener("compositionend",e=>{if(e.target.id==="q")doSearch(e.target)});
document.addEventListener("submit",e=>{
  e.preventDefault();
  if(e.target.id==="addForm"){const w=$("#f_w").value.trim(),m=$("#f_m").value.trim();if(!w||!m){toast(t("needWord"));return}
    addCard({w,r:$("#f_r").value.trim(),m,ex:$("#f_ex").value.trim(),note:$("#f_n").value.trim()});V.showAdd=false;render()}
  if(e.target.id==="selForm"){const w=$("#s_w").value.trim(),m=$("#s_m").value.trim();if(!w||!m){toast(t("needWord"));return}
    addCard({w,r:$("#s_r").value.trim(),m,ex:$("#s_ex").value.trim(),src:e.target.dataset.src||""});closeSheet();window.getSelection().removeAllRanges();render()}
});
/* selection → add */
let selTimer;
document.addEventListener("selectionchange",()=>{clearTimeout(selTimer);selTimer=setTimeout(()=>{
  const sel=window.getSelection(),r=$("#reader"),old=$("#selbtn");
  const txt=sel&&sel.rangeCount?sel.toString().replace(/\s+/g,"").trim():"";
  const inside=r&&sel.rangeCount&&r.contains(sel.getRangeAt(0).commonAncestorContainer);
  if(!inside||!txt||txt.length>30){if(old)old.remove();return}
  let sentence="";const node=sel.anchorNode&&(sel.anchorNode.nodeType===3?sel.anchorNode.parentElement:sel.anchorNode);const p=node&&(node.closest("p")||node.closest(".ljp"));
  if(p){const c=p.cloneNode(true);c.querySelectorAll("rt,button").forEach(x=>x.remove());const full=c.textContent;
    sentence=((full.match(/[^。！？\n]+[。！？」]*/g)||[full]).find(x=>x.includes(txt))||"").trim()}
  V.sel=txt;let b=old;if(!b){b=document.createElement("button");b.id="selbtn";b.className="selbtn";document.body.appendChild(b);
    b.addEventListener("mousedown",ev=>ev.preventDefault());b.addEventListener("touchstart",ev=>ev.preventDefault(),{passive:false});
    const go=ev=>{ev.preventDefault();if(!b.isConnected)return;b.remove();openCustom(V.sel,b.dataset.s||"")};b.addEventListener("click",go);b.addEventListener("touchend",go)}
  b.textContent=t("addSel",txt.length>12?txt.slice(0,12)+"…":txt);b.dataset.s=sentence;
},250)});

/* sign-in link from the email: Supabase sends the reader back here with the session (or an error) in the URL hash */
async function sbFromHash(){
  const h=location.hash||"";if(!/access_token=|error_code=|error=/.test(h))return false;
  const q=new URLSearchParams(h.replace(/^#/,""));history.replaceState(null,"",location.pathname+location.search);
  if(q.get("error")||q.get("error_code")){V.view="set";V.acctMsg=t("acctLinkOld");render();return true}
  const j={access_token:q.get("access_token"),refresh_token:q.get("refresh_token"),expires_in:+q.get("expires_in")||3600};
  if(!j.access_token||!j.refresh_token)return false;
  try{const r=await fetch(SB_URL+"/auth/v1/user",{headers:{apikey:SB_KEY,Authorization:"Bearer "+j.access_token}});if(r.ok)j.user=await r.json()}catch(e){}
  SY={email:(j.user&&j.user.email)||SY.email};sbKeep(j);if(!SY.uid){try{SY.uid=JSON.parse(atob(j.access_token.split(".")[1].replace(/-/g,"+").replace(/_/g,"/"))).sub;sySave()}catch(e){}}V.acct=null;V.view="set";V.acctMsg=t("acctLinkOk");render();
  await syncNow(true);return true;
}
render();
sbFromHash().then(viaLink=>{if(!viaLink&&syOn())syncNow()});
