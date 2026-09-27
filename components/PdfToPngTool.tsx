"use client";

import {useRef,useState} from "react";

export default function PdfToPngTool(){
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
   const data=new Uint8Array(await selected.arrayBuffer());
   const pdf=await pdfjs.getDocument({data,disableWorker:true}).promise;
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
    const blob=await new Promise<Blob|null>(resolve=>canvas.toBlob(resolve,"image/png"));
    if(!blob)throw new Error("PNG conversion failed");
    zip.file(`page-${i}.png`,blob);
    page.cleanup();
    canvas.width=1;
    canvas.height=1;
   }

   save(await zip.generateAsync({type:"blob"}),"pdf-pages-png.zip");
   setMsg(`Done — converted ${pdf.numPages} page(s) to PNG in your browser.`);
  }catch{
   setMsg("Could not convert this PDF. Check that the file is valid and try again.");
  }finally{
   setBusy(false);
  }
 };

 return <div>
  <div className="drop">
   <h2>PDF to PNG</h2>
   <p>Convert every PDF page into PNG images. Processing happens locally in your browser.</p>
   <div className="filePicker">
    <input ref={inputRef} id="pdf-to-png-file" className="filePickerInput" type="file" accept=".pdf,application/pdf" onChange={e=>{setFile(e.target.files?.[0]||null);setMsg("")}}/>
    <label className="filePickerButton" htmlFor="pdf-to-png-file">Choose file</label>
    <span className="filePickerName">{file?file.name:"No file selected"}</span>
   </div>
   <button className="btn" disabled={!file||busy} onClick={run}>{busy?"Converting…":"Convert to PNG"}</button>
  </div>
  {file&&<div className="files"><div className="file"><span>{file.name}</span><span>{Math.max(1,Math.round(file.size/1024))} KB</span></div></div>}
  {msg&&<div className="notice">{msg}</div>}
 </div>;
}
