"use client";

import {useRef,useState} from "react";

export default function PdfToJpgTool(){
 const [file,setFile]=useState<File|null>(null);
 const [busy,setBusy]=useState(false);
 const [msg,setMsg]=useState("");
 const inputRef=useRef<HTMLInputElement|null>(null);

 const save=(blob:Blob,name:string)=>{
  const url=URL.createObjectURL(blob);
  const a=document.createElement("a");
  a.href=url;
  a.download=name;
  a.click();
  setTimeout(()=>URL.revokeObjectURL(url),1000);
 };

 const run=async()=>{
  const selected=inputRef.current?.files?.[0]||file;
  if(!selected){setMsg("Choose a PDF file first.");return;}
  setBusy(true);
  setMsg("");
  try{
   const [{default:JSZip},pdfjs]=await Promise.all([
    import("jszip"),
    // @ts-expect-error pdfjs-dist 3.x does not ship declarations for this browser entry.
    import("pdfjs-dist/build/pdf")
   ]);
   pdfjs.GlobalWorkerOptions.workerSrc="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
   const data=new Uint8Array(await selected.arrayBuffer());
   const pdf=await pdfjs.getDocument({data}).promise;
   const zip=new JSZip();

   for(let i=1;i<=pdf.numPages;i++){
    const page=await pdf.getPage(i);
    const base=page.getViewport({scale:1});
    const scale=Math.min(2,1800/Math.max(base.width,base.height));
    const viewport=page.getViewport({scale});
    const canvas=document.createElement("canvas");
    canvas.width=Math.ceil(viewport.width);
    canvas.height=Math.ceil(viewport.height);
    const ctx=canvas.getContext("2d");
    if(!ctx)throw new Error("Canvas unavailable");
    await page.render({canvasContext:ctx,viewport}).promise;
    const blob=await new Promise<Blob|null>(resolve=>canvas.toBlob(resolve,"image/jpeg",0.9));
    if(!blob)throw new Error("JPG conversion failed");
    zip.file(`page-${i}.jpg`,blob);
    page.cleanup();
    canvas.width=1;
    canvas.height=1;
   }

   save(await zip.generateAsync({type:"blob"}),"pdf-pages-jpg.zip");
   setMsg(`Done — converted ${pdf.numPages} page(s) to JPG in your browser.`);
  }catch{
   setMsg("Could not convert this PDF. Check that the file is valid and try again.");
  }finally{
   setBusy(false);
  }
 };

 return <div>
  <div className="drop">
   <h2>PDF to JPG</h2>
   <p>Convert every PDF page into JPG images. Processing happens locally in your browser.</p>
   <div className="filePicker">
    <input ref={inputRef} id="pdf-to-jpg-file" className="filePickerInput" type="file" accept=".pdf,application/pdf" onChange={e=>{setFile(e.target.files?.[0]||null);setMsg("")}}/>
    <label className="filePickerButton" htmlFor="pdf-to-jpg-file">Choose file</label>
    <span className="filePickerName">{file?file.name:"No file selected"}</span>
   </div>
   <button className="btn" disabled={busy} onClick={run}>{busy?"Converting…":"Convert to JPG"}</button>
  </div>
  {file&&<div className="files"><div className="file"><span>{file.name}</span><span>{Math.max(1,Math.round(file.size/1024))} KB</span></div></div>}
  {msg&&<div className="notice">{msg}</div>}
 </div>;
}
