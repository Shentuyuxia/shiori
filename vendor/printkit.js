/* PrintKit — print / save-as-PDF and Word (.docx) export for reading texts.
   Shared by 字里行间 · Entrelinhas, 字里 · Zili and 栞 · Shiori (same file in each repo: vendor/printkit.js).
   © 2026 申屠余夏 (Shentu Yuxia). All rights reserved.

   A document ("doc") is a plain object:
   {
     title: "…",            titleRuby: [seg…] (optional, replaces title when ruby is on)
     sub:   "…",            subtitle / dek (optional)
     meta:  "B1 · 23 Oct 2026 · taz",
     lang:  "de" | "zh-CN" | "ja" …   language of the text (for fonts and spell-check)
     paras: [[seg…], …]     the text; a seg is a string or {b:"漢字", r:"かんじ"} (base + ruby)
     trans: {label, lang, paras:["…"]}        whole translation, printed after the text
     gloss: {label, rows:[{w, r, m:["…"]}]}   word list: word, reading, meanings
     blocks:[{label, paras:[[seg…]], early}]  extra sections (grammar, questions …); early:true = right after the text
     src:   [{title, url}]                    sources
   }
   PrintKit.print(docs, opt)   opt: {title, footer, brand:{name,url,accent,font,sans}}  (prints without the translation)
   PrintKit.docx(docs, opt)    opt: {title, filename, footer, ea:"zh"|"ja", brand:{…, docFont, docEa}}  → downloads / shares a .docx
   PrintKit.menu(btn, items)   tiny pop-up menu next to a button: items=[{label, run}]
*/
(function(){
"use strict";
const esc=s=>String(s==null?"":s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const xesc=s=>String(s==null?"":s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c])).replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g,"");
const segText=segs=>(segs||[]).map(s=>typeof s==="string"?s:s.b).join("");
const asSegs=p=>Array.isArray(p)?p:[String(p==null?"":p)];

/* ---------------- print / PDF ---------------- */
const CSS=`
@media screen{#pk-root{display:none!important}}
@media print{
  @page{margin:18mm 16mm}
  html,body{background:#fff!important;height:auto!important;overflow:visible!important}
  body>*:not(#pk-root){display:none!important}
  #pk-root{display:block!important;color:#1d1d1f;font:11.5pt/1.65 var(--pk-font,"Source Serif 4","Iowan Old Style",Georgia,"Songti SC","Noto Serif CJK SC","Hiragino Mincho ProN","Yu Mincho",serif)}
  #pk-root .pkx-brand{display:flex;justify-content:space-between;align-items:baseline;gap:12pt;margin:0 0 14pt;padding-bottom:5pt;border-bottom:1.2pt solid var(--pk-accent,#555);font:600 9pt/1.3 var(--pk-sans,-apple-system,"Helvetica Neue",Arial,"PingFang SC","Hiragino Sans",sans-serif);color:var(--pk-accent,#555);letter-spacing:.03em}
  #pk-root .pkx-brand span+span{font-weight:400;color:#888}
  #pk-root *{box-sizing:border-box}
  #pk-root .pkx-doc+.pkx-doc{break-before:page;page-break-before:always}
  #pk-root .pkx-meta{font:9pt/1.4 var(--pk-sans,-apple-system,"Helvetica Neue",Arial,"PingFang SC","Hiragino Sans",sans-serif);color:#6b6b70;letter-spacing:.02em;margin:0 0 6pt}
  #pk-root .pkx-title{font-size:20pt;line-height:1.3;margin:0 0 4pt;font-weight:600}
  #pk-root .pkx-sub{font-size:12pt;color:#444;margin:0 0 14pt;font-style:italic}
  #pk-root .pkx-body p{margin:0 0 9pt;text-align:justify;orphans:2;widows:2}
  #pk-root .pkx-ruby .pkx-body p, #pk-root .pkx-ruby .pkx-blk p{line-height:2.45;font-size:13.5pt;text-align:left}
  #pk-root ruby{ruby-position:over} #pk-root rt{font-size:.46em;letter-spacing:0;color:#555;font-family:var(--pk-sans,-apple-system,"Helvetica Neue",Arial,sans-serif)}
  #pk-root .pkx-h{font:600 9.5pt/1.3 var(--pk-sans,-apple-system,"Helvetica Neue",Arial,"PingFang SC","Hiragino Sans",sans-serif);text-transform:uppercase;letter-spacing:.08em;color:var(--pk-accent,#6b6b70);margin:16pt 0 6pt;padding-top:6pt;border-top:.6pt solid #ccc;break-after:avoid}
  #pk-root .pkx-tr p{margin:0 0 7pt;color:#333;font-size:10.5pt}
  #pk-root .pkx-gl{width:100%;border-collapse:collapse;font-size:10pt}
  #pk-root .pkx-gl td{padding:3pt 6pt 3pt 0;vertical-align:top;border-bottom:.4pt solid #e2e2e2;break-inside:avoid}
  #pk-root .pkx-gl td.w{width:32%;font-weight:600}
  #pk-root .pkx-gl .r{display:block;font-weight:400;color:#666;font-size:9pt}
  #pk-root .pkx-gl .m2{display:block;color:#666}
  #pk-root .pkx-blk p{margin:0 0 6pt}
  #pk-root .pkx-src{font-size:9pt;color:#555;word-break:break-all}
  #pk-root .pkx-foot{margin-top:18pt;font:8pt/1.4 -apple-system,"Helvetica Neue",Arial,sans-serif;color:#999}
}`;
function segHTML(segs){ return asSegs(segs).map(s=>typeof s==="string"?esc(s):(s.r?`<ruby>${esc(s.b)}<rt>${esc(s.r)}</rt></ruby>`:esc(s.b))).join(""); }
function docHTML(d,opt){
  const ruby=(d.paras||[]).some(p=>asSegs(p).some(s=>typeof s!=="string"&&s.r));
  let h=`<article class="pkx-doc${ruby?" pkx-ruby":""}" lang="${esc(d.lang||"")}">`;
  if(opt&&opt.brand) h+=`<header class="pkx-brand"><span>${esc(opt.brand.name||"")}</span><span>${esc(opt.brand.url||"")}</span></header>`;
  if(d.meta) h+=`<p class="pkx-meta">${esc(d.meta)}</p>`;
  h+=`<h1 class="pkx-title">${d.titleRuby?segHTML(d.titleRuby):esc(d.title)}</h1>`;
  if(d.sub) h+=`<p class="pkx-sub">${esc(d.sub)}</p>`;
  h+=`<div class="pkx-body">${(d.paras||[]).map(p=>`<p>${segHTML(p)}</p>`).join("")}</div>`;
  const blk=early=>(d.blocks||[]).forEach(b=>{ if(!b||!!b.early!==early||!(b.paras||[]).length) return; h+=`<h2 class="pkx-h">${esc(b.label)}</h2><div class="pkx-blk" ${b.lang?`lang="${esc(b.lang)}"`:""}>${b.paras.map(p=>`<p>${segHTML(p)}</p>`).join("")}</div>`; });
  blk(true);
  if(d.gloss&&d.gloss.rows&&d.gloss.rows.length) h+=`<h2 class="pkx-h">${esc(d.gloss.label)}</h2><table class="pkx-gl">${d.gloss.rows.map(g=>`<tr><td class="w">${esc(g.w)}${g.r?`<span class="r">${esc(g.r)}</span>`:""}</td><td>${(g.m||[]).filter(Boolean).map((m,i)=>`<span class="${i?"m2":"m1"}">${esc(m)}</span>`).join("")}</td></tr>`).join("")}</table>`;
  if(!(opt&&opt.noTrans)&&d.trans&&d.trans.paras&&d.trans.paras.length) h+=`<h2 class="pkx-h">${esc(d.trans.label)}</h2><div class="pkx-tr" lang="${esc(d.trans.lang||"")}">${d.trans.paras.map(p=>`<p>${esc(p)}</p>`).join("")}</div>`;
  blk(false);
  if(d.src&&d.src.length) h+=`<h2 class="pkx-h">${esc(d.srcLabel||"Sources")}</h2><div class="pkx-src">${d.src.map(s=>`<div>${esc(s.title||"")}${s.url?` — ${esc(s.url)}`:""}</div>`).join("")}</div>`;
  if(opt&&opt.footer) h+=`<p class="pkx-foot">${esc(opt.footer)}</p>`;
  return h+`</article>`;
}
function print(docs,opt){
  opt=opt||{}; docs=(docs||[]).filter(Boolean); if(!docs.length) return;
  let st=document.getElementById("pk-style"); if(!st){ st=document.createElement("style"); st.id="pk-style"; st.textContent=CSS; document.head.appendChild(st); }
  let root=document.getElementById("pk-root"); if(root) root.remove();
  opt=Object.assign({noTrans:true},opt); // a printout is for reading: no translation (the Word file keeps it)
  root=document.createElement("div"); root.id="pk-root"; root.innerHTML=docs.map(d=>docHTML(d,opt)).join(""); document.body.appendChild(root);
  const br=opt.brand||{}; if(br.accent) root.style.setProperty("--pk-accent",br.accent); if(br.font) root.style.setProperty("--pk-font",br.font); if(br.sans) root.style.setProperty("--pk-sans",br.sans);
  const old=document.title; if(opt.title) document.title=opt.title; // becomes the PDF file name in most browsers
  const back=()=>{ document.title=old; };
  window.addEventListener("afterprint",back,{once:true});
  setTimeout(()=>{ try{ window.print(); }catch(e){} setTimeout(back,1500); },60);
}

/* ---------------- .docx ---------------- */
const CRC=(()=>{ const t=new Uint32Array(256); for(let n=0;n<256;n++){ let c=n; for(let k=0;k<8;k++) c=c&1?0xEDB88320^(c>>>1):c>>>1; t[n]=c>>>0; } return t; })();
function crc32(u8){ let c=0xFFFFFFFF; for(let i=0;i<u8.length;i++) c=CRC[(c^u8[i])&255]^(c>>>8); return (c^0xFFFFFFFF)>>>0; }
function zip(files){ // [{name, data:string}] → Blob (stored, no compression; Word reads it fine)
  const enc=new TextEncoder(), parts=[], cen=[]; let off=0;
  const dt=new Date(), dosT=(dt.getHours()<<11)|(dt.getMinutes()<<5)|(dt.getSeconds()>>1), dosD=((dt.getFullYear()-1980)<<9)|((dt.getMonth()+1)<<5)|dt.getDate();
  for(const f of files){
    const name=enc.encode(f.name), data=typeof f.data==="string"?enc.encode(f.data):f.data, crc=crc32(data);
    const lh=new DataView(new ArrayBuffer(30));
    lh.setUint32(0,0x04034b50,true); lh.setUint16(4,20,true); lh.setUint16(6,0x0800,true); lh.setUint16(8,0,true);
    lh.setUint16(10,dosT,true); lh.setUint16(12,dosD,true); lh.setUint32(14,crc,true); lh.setUint32(18,data.length,true); lh.setUint32(22,data.length,true);
    lh.setUint16(26,name.length,true); lh.setUint16(28,0,true);
    parts.push(new Uint8Array(lh.buffer),name,data);
    const ch=new DataView(new ArrayBuffer(46));
    ch.setUint32(0,0x02014b50,true); ch.setUint16(4,20,true); ch.setUint16(6,20,true); ch.setUint16(8,0x0800,true); ch.setUint16(10,0,true);
    ch.setUint16(12,dosT,true); ch.setUint16(14,dosD,true); ch.setUint32(16,crc,true); ch.setUint32(20,data.length,true); ch.setUint32(24,data.length,true);
    ch.setUint16(28,name.length,true); ch.setUint16(30,0,true); ch.setUint16(32,0,true); ch.setUint16(34,0,true); ch.setUint16(36,0,true); ch.setUint32(38,0,true); ch.setUint32(42,off,true);
    cen.push(new Uint8Array(ch.buffer),name);
    off+=30+name.length+data.length;
  }
  const cenSize=cen.reduce((n,a)=>n+a.length,0), end=new DataView(new ArrayBuffer(22));
  end.setUint32(0,0x06054b50,true); end.setUint16(8,files.length,true); end.setUint16(10,files.length,true); end.setUint32(12,cenSize,true); end.setUint32(16,off,true);
  return new Blob([...parts,...cen,new Uint8Array(end.buffer)],{type:"application/vnd.openxmlformats-officedocument.wordprocessingml.document"});
}
const W='xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"';
function rPr(o){ o=o||{}; let x="";
  if(o.b) x+="<w:b/>"; if(o.i) x+="<w:i/>"; if(o.color) x+=`<w:color w:val="${o.color}"/>`; if(o.sz) x+=`<w:sz w:val="${o.sz}"/><w:szCs w:val="${o.sz}"/>`;
  if(o.lang) x+=`<w:lang w:val="${o.lang}" w:eastAsia="${o.lang}"/>`;
  return x?`<w:rPr>${x}</w:rPr>`:""; }
function run(t,o){ return t?`<w:r>${rPr(o)}<w:t xml:space="preserve">${xesc(t)}</w:t></w:r>`:""; }
function rubyRun(b,r,o){ o=o||{}; const sz=o.sz||24, rs=Math.max(10,Math.round(sz/2));
  return `<w:r>${rPr(o)}<w:ruby><w:rubyPr><w:rubyAlign w:val="center"/><w:hps w:val="${rs}"/><w:hpsRaise w:val="${sz-2}"/><w:hpsBaseText w:val="${sz}"/><w:lid w:val="${o.lang||"zh-CN"}"/></w:rubyPr><w:rt><w:r><w:rPr><w:sz w:val="${rs}"/><w:szCs w:val="${rs}"/><w:color w:val="555555"/></w:rPr><w:t xml:space="preserve">${xesc(r)}</w:t></w:r></w:rt><w:rubyBase><w:r>${rPr(o)}<w:t xml:space="preserve">${xesc(b)}</w:t></w:r></w:rubyBase></w:ruby></w:r>`; }
function segRuns(segs,o){ return asSegs(segs).map(s=>typeof s==="string"?run(s,o):(s.r?rubyRun(s.b,s.r,o):run(s.b,o))).join(""); }
function para(inner,o){ o=o||{}; let pp="";
  if(o.style) pp+=`<w:pStyle w:val="${o.style}"/>`; if(o.keep) pp+="<w:keepNext/>"; if(o.pageBreak) pp+="<w:pageBreakBefore/>";
  if(o.after!=null||o.line) pp+=`<w:spacing ${o.after!=null?`w:after="${o.after}"`:""} ${o.line?`w:line="${o.line}" w:lineRule="auto"`:""}/>`;
  if(o.jc) pp+=`<w:jc w:val="${o.jc}"/>`;
  return `<w:p>${pp?`<w:pPr>${pp}</w:pPr>`:""}${inner}</w:p>`; }
function docXML(docs,opt){
  let b="";
  docs.forEach((d,n)=>{
    const lang=d.lang||"", ruby=(d.paras||[]).some(p=>asSegs(p).some(s=>typeof s!=="string"&&s.r));
    const br=opt&&opt.brand;
    if(br) b+=`<w:p><w:pPr>${n>0?"<w:pageBreakBefore/>":""}<w:pBdr><w:bottom w:val="single" w:sz="10" w:space="4" w:color="${hex(br.accent)}"/></w:pBdr><w:tabs><w:tab w:val="right" w:pos="9700"/></w:tabs><w:spacing w:after="240"/></w:pPr>${run(br.name||"",{b:true,sz:18,color:hex(br.accent)})}<w:r><w:tab/></w:r>${run(br.url||"",{sz:16,color:"888888"})}</w:p>`;
    if(d.meta) b+=para(run(d.meta,{sz:18,color:"6B6B70"}),{after:60,pageBreak:n>0&&!br});
    b+=para(d.titleRuby?segRuns(d.titleRuby,{lang}):run(d.title,{lang}),{style:"Title",pageBreak:n>0&&!d.meta&&!br});
    if(d.sub) b+=para(run(d.sub,{i:true,color:"444444"}),{after:240});
    (d.paras||[]).forEach(p=>{ b+=para(segRuns(p,ruby?{lang,sz:27}:{lang}),{line:ruby?440:300,after:160,jc:ruby?"left":"both"}); });
    const blk=early=>(d.blocks||[]).forEach(bl=>{ if(!bl||!!bl.early!==early||!(bl.paras||[]).length) return; b+=para(run(bl.label),{style:"Heading2",keep:true}); bl.paras.forEach(p=>{ const r=asSegs(p).some(x=>typeof x!=="string"&&x.r); b+=para(segRuns(p,{lang:bl.lang||lang}),{after:100,line:r?400:280}); }); });
    blk(true);
    if(d.gloss&&d.gloss.rows&&d.gloss.rows.length){
      b+=para(run(d.gloss.label),{style:"Heading2",keep:true});
      b+=`<w:tbl><w:tblPr><w:tblW w:w="5000" w:type="pct"/><w:tblBorders><w:insideH w:val="single" w:sz="4" w:color="DDDDDD"/><w:bottom w:val="single" w:sz="4" w:color="DDDDDD"/></w:tblBorders><w:tblCellMar><w:top w:w="40" w:type="dxa"/><w:bottom w:w="40" w:type="dxa"/></w:tblCellMar></w:tblPr><w:tblGrid><w:gridCol w:w="2900"/><w:gridCol w:w="6200"/></w:tblGrid>`+
        d.gloss.rows.map(g=>`<w:tr><w:trPr><w:cantSplit/></w:trPr><w:tc><w:tcPr><w:tcW w:w="1600" w:type="pct"/></w:tcPr>${para(run(g.w,{b:true,lang}),{after:0})}${g.r?para(run(g.r,{sz:18,color:"666666"}),{after:0}):""}</w:tc><w:tc><w:tcPr><w:tcW w:w="3400" w:type="pct"/></w:tcPr>${(g.m||[]).filter(Boolean).map((m,i)=>para(run(m,i?{color:"666666",sz:20}:{sz:20}),{after:0})).join("")||para("",{after:0})}</w:tc></w:tr>`).join("")+`</w:tbl>`;
    }
    if(d.trans&&d.trans.paras&&d.trans.paras.length){ b+=para(run(d.trans.label),{style:"Heading2",keep:true}); d.trans.paras.forEach(p=>{ b+=para(run(p,{sz:21,color:"333333",lang:d.trans.lang}),{after:120}); }); }
    blk(false);
    if(d.src&&d.src.length){ b+=para(run(d.srcLabel||"Sources"),{style:"Heading2",keep:true}); d.src.forEach(s=>{ b+=para(run((s.title||"")+(s.url?" — "+s.url:""),{sz:18,color:"555555"}),{after:40}); }); }
  });
  if(opt&&opt.footer) b+=para(run(opt.footer,{sz:16,color:"999999"}),{after:0});
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:document ${W}><w:body>${b}<w:sectPr><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="1134" w:right="1077" w:bottom="1134" w:left="1077" w:header="567" w:footer="567" w:gutter="0"/></w:sectPr></w:body></w:document>`;
}
const hex=c=>{ c=String(c||"6B6B70").replace("#",""); return /^[0-9a-f]{6}$/i.test(c)?c.toUpperCase():"6B6B70"; };
function stylesXML(ea,br){
  br=br||{}; const eaf=br.docEa||(ea==="ja"?"Yu Mincho":ea==="zht"?"PMingLiU":"SimSun"), lat=br.docFont||"Georgia";
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:styles ${W}>
<w:docDefaults><w:rPrDefault><w:rPr><w:rFonts w:ascii="${lat}" w:hAnsi="${lat}" w:eastAsia="${eaf}" w:cs="${lat}"/><w:sz w:val="23"/><w:szCs w:val="23"/></w:rPr></w:rPrDefault><w:pPrDefault><w:pPr><w:spacing w:after="120" w:line="300" w:lineRule="auto"/></w:pPr></w:pPrDefault></w:docDefaults>
<w:style w:type="paragraph" w:default="1" w:styleId="Normal"><w:name w:val="Normal"/><w:qFormat/></w:style>
<w:style w:type="paragraph" w:styleId="Title"><w:name w:val="Title"/><w:basedOn w:val="Normal"/><w:next w:val="Normal"/><w:qFormat/><w:pPr><w:keepNext/><w:spacing w:after="80"/><w:outlineLvl w:val="0"/></w:pPr><w:rPr><w:b/><w:sz w:val="40"/><w:szCs w:val="40"/></w:rPr></w:style>
<w:style w:type="paragraph" w:styleId="Heading2"><w:name w:val="heading 2"/><w:basedOn w:val="Normal"/><w:next w:val="Normal"/><w:qFormat/><w:pPr><w:keepNext/><w:spacing w:before="320" w:after="100"/><w:outlineLvl w:val="1"/></w:pPr><w:rPr><w:rFonts w:ascii="Arial" w:hAnsi="Arial"/><w:b/><w:caps/><w:color w:val="${hex(br.accent)}"/><w:spacing w:val="10"/><w:sz w:val="19"/><w:szCs w:val="19"/></w:rPr></w:style>
</w:styles>`; }
async function docx(docs,opt){
  opt=opt||{}; docs=(docs||[]).filter(Boolean); if(!docs.length) return;
  const files=[
    {name:"[Content_Types].xml",data:`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/><Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/><Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/></Types>`},
    {name:"_rels/.rels",data:`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/></Relationships>`},
    {name:"docProps/core.xml",data:`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><dc:title>${xesc(opt.title||docs[0].title||"")}</dc:title><dc:creator>${xesc(opt.creator||"")}</dc:creator><dcterms:created xsi:type="dcterms:W3CDTF">${new Date().toISOString().replace(/\.\d+Z$/,"Z")}</dcterms:created></cp:coreProperties>`},
    {name:"word/_rels/document.xml.rels",data:`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>`},
    {name:"word/document.xml",data:docXML(docs,opt)},
    {name:"word/styles.xml",data:stylesXML(opt.ea,opt.brand)}
  ];
  const blob=zip(files), name=(opt.filename||"reading").replace(/[\\/:*?"<>|]+/g," ").trim().slice(0,80)+".docx";
  await save(blob,name);
}
async function save(blob,name){
  const coarse=window.matchMedia&&matchMedia("(pointer:coarse)").matches;
  if(coarse&&navigator.canShare&&typeof File==="function"){ // phones/tablets: the share sheet lets you open it in Word, Files, mail…
    try{ const f=new File([blob],name,{type:blob.type}); if(navigator.canShare({files:[f]})){ await navigator.share({files:[f],title:name}); return; } }catch(e){ if(e&&e.name==="AbortError") return; }
  }
  const url=URL.createObjectURL(blob), a=document.createElement("a"); a.href=url; a.download=name; a.rel="noopener"; document.body.appendChild(a); a.click(); a.remove();
  setTimeout(()=>URL.revokeObjectURL(url),30000);
}

/* ---------------- small pop-up menu ---------------- */
function menu(btn,items){
  close();
  const m=document.createElement("div"); m.className="pk-menu"; m.setAttribute("role","menu");
  m.innerHTML=items.map((it,i)=>`<button type="button" role="menuitem" data-pki="${i}">${esc(it.label)}</button>`).join("");
  if(!document.getElementById("pk-menu-style")){ const s=document.createElement("style"); s.id="pk-menu-style";
    s.textContent=`.pk-menu{position:fixed;z-index:9999;min-width:190px;padding:6px;border-radius:12px;background:var(--surface,#fff);color:var(--ink,#1c2930);border:1px solid var(--line,#d5dbda);box-shadow:0 10px 30px rgba(0,0,0,.16);display:flex;flex-direction:column;gap:2px}
.pk-menu button{all:unset;cursor:pointer;padding:10px 12px;border-radius:8px;font:inherit;font-size:15px;line-height:1.3}
.pk-menu button:hover,.pk-menu button:focus-visible{background:var(--sunk,rgba(0,0,0,.06))}
@media print{.pk-menu{display:none!important}}`; document.head.appendChild(s); }
  document.body.appendChild(m);
  const r=btn.getBoundingClientRect(), w=m.offsetWidth, h=m.offsetHeight;
  let x=Math.min(Math.max(8,r.left),innerWidth-w-8), y=r.bottom+6; if(y+h>innerHeight-8) y=Math.max(8,r.top-h-6);
  m.style.left=x+"px"; m.style.top=y+"px";
  m.addEventListener("click",e=>{ const b=e.target.closest("[data-pki]"); if(!b) return; e.stopPropagation(); const it=items[+b.dataset.pki]; close(); try{ it.run(); }catch(err){ console.error(err); } });
  setTimeout(()=>{ document.addEventListener("click",outside,true); document.addEventListener("keydown",onKey,true); addEventListener("scroll",close,{once:true,passive:true}); },0);
  const f=m.querySelector("button"); if(f) f.focus({preventScroll:true});
  function outside(e){ if(!m.contains(e.target)) close(); }
  function onKey(e){ if(e.key==="Escape") close(); }
  menu._close=()=>{ document.removeEventListener("click",outside,true); document.removeEventListener("keydown",onKey,true); m.remove(); };
}
function close(){ if(menu._close){ const c=menu._close; menu._close=null; c(); } }

window.PrintKit={print,docx,menu,segText};
})();
