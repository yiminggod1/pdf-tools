"use client";

import {useRef,useState} from "react";

type Preview={page:number;url:string};

export default function PdfPagePreviewTool(){
 const [file,setFile]=useState<File|null>(null);
 const [previews,setPreviews]=useState<Preview[]>([]);
 const [selected,setSelected]=useState<number[]>([]);
 const [busy,setBusy]=useState(false);
 const [msg,setMsg]=useState("");
 const inputRef=useRef<HTMLInputElement|null>(null);

 const clear=()=>{
  previews.forEach(p=>URL.revokeObjectURL(p.url));
  setPreviews([]);
  setSelected([]);
  setFile(null);
  setMsg("");
  if(inputRef.current) inputRef.current.value="";
 };

 const load=async(selectedFile:File)=>{
  previews.forEach(p=>URL.revokeObjectURL(p.url));
  setBusy(true); setMsg("");
  try{
   const pdfjs=await import("pdfjs-dist/build/pdf");
   const data=new Uint8Array(await selectedFile.arrayBuffer());
   const pdf=await pdfjs.getDocument({data,disableWorker:true}).promise;
   const next:Preview[]=[];
   for(let i=1;i<=pdf.numPages;i++){
    const page=await pdf.getPage(i);
    const base=page.getViewport({scale:1});
    const scale=Math.min(0.72,260/Math.max(base.width,base.height));
    const viewport=page.getViewport({scale});
    const canvas=document.createElement("canvas");
    canvas.width=Math.ceil(viewport.width);
    canvas.height=Math.ceil(viewport.height);
    const ctx=canvas.getContext("2d");
    if(!ctx) throw new Error("Canvas unavailable");
    await page.render({canvasContext:ctx,viewport}).promise;
    const blob=await new Promise<Blob|null>(resolve=>canvas.toBlob(resolve,"image/jpeg",0.82));
    if(!blob) throw new Error("Preview failed");
    next.push({page:i,url:URL.createObjectURL(blob)});
    page.cleanup();
   }
   setFile(selectedFile);
   setPreviews(next);
   setSelected(next.map(p=>p.page));
  }catch{
   setMsg("Could not preview this PDF. Check that the file is valid and try again.");
  }finally{setBusy(false);}
 };

 const toggle=(page:number)=>setSelected(v=>v.includes(page)?v.filter(x=>x!==page):[...v,page].sort((a,b)=>a-b));
 const selectAll=()=>setSelected(previews.map(p=>p.page));
 const clearSelection=()=>setSelected([]);

 const exportPdf=async()=>{
  if(!file||!selected.length) return;
  setBusy(true); setMsg("");
  try{
   const {PDFDocument}=await import("pdf-lib");
   const source=await PDFDocument.load(await file.arrayBuffer());
   const out=await PDFDocument.create();
   const pages=await out.copyPages(source,selected.map(p=>p-1));
   pages.forEach(p=>out.addPage(p));
   const bytes=await out.save();
   const blob=new Blob([bytes as Uint8Array<ArrayBuffer>],{type:"application/pdf"});
   const url=URL.createObjectURL(blob);
   const a=document.createElement("a");
   a.href=url; a.download="selected-pages.pdf"; a.click();
   setTimeout(()=>URL.revokeObjectURL(url),1000);
   setMsg(`Done — exported ${selected.length} selected page(s).`);
  }catch{setMsg("Could not create the new PDF. Please try again.");}
  finally{setBusy(false);}
 };

 return <div className="pagePreviewTool">
  <div className="drop previewDrop">
   <div className="previewBadge">PDF PAGE PREVIEW</div>
   <h2>Preview, select &amp; export pages</h2>
   <p>See every page as a thumbnail, choose exactly what you need, then download a new PDF.</p>
   <div className="filePicker">
    <input ref={inputRef} id="pdf-page-preview-file" className="filePickerInput" type="file" accept=".pdf,application/pdf" onChange={e=>{const f=e.target.files?.[0]; if(f) load(f)}}/>
    <label className="filePickerButton" htmlFor="pdf-page-preview-file">Choose PDF</label>
    <span className="filePickerName">{file?file.name:"No file selected"}</span>
   </div>
   {busy&&<div className="previewLoading">Preparing page previews…</div>}
  </div>
  {previews.length>0&&<section className="previewPanel">
   <div className="previewToolbar">
    <div><strong>{previews.length} pages</strong><span>{selected.length} selected</span></div>
    <div className="previewActions"><button className="miniBtn" onClick={selectAll}>Select all</button><button className="miniBtn" onClick={clearSelection}>Clear</button></div>
   </div>
   <div className="pageGrid">
    {previews.map(p=><button type="button" className={`pageThumb ${selected.includes(p.page)?"selected":""}`} key={p.page} onClick={()=>toggle(p.page)} aria-pressed={selected.includes(p.page)}>
      <span className="pageCheck">{selected.includes(p.page)?"✓":""}</span>
      <img src={p.url} alt={`Page ${p.page} preview`}/>
      <span>Page {p.page}</span>
    </button>)}
   </div>
   <div className="previewBottom">
    <div><strong>{selected.length}</strong> page{selected.length===1?"":"s"} ready to export</div>
    <button className="btn" disabled={!selected.length||busy} onClick={exportPdf}>{busy?"Working…":"Download selected PDF"}</button>
   </div>
  </section>}
  {msg&&<div className="notice">{msg}</div>}
  {file&&<button className="resetLink" onClick={clear}>Choose a different PDF</button>}
 </div>;
}
