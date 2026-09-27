"use client";
import {useState} from "react";
import JSZip from "jszip";
import FilePicker from "./FilePicker";

type PdfJsModule=typeof import("pdfjs-dist/legacy/build/pdf");

export default function PdfToJpgTool(){
 const [files,setFiles]=useState<File[]>([]);const [busy,setBusy]=useState(false);const [msg,setMsg]=useState("");
 const save=(blob:Blob,name:string)=>{const url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)};
 const run=async()=>{
  if(!files[0])return;setBusy(true);setMsg("");
  try{
   const pdfjs=(await import("pdfjs-dist/legacy/build/pdf")) as PdfJsModule;
   const data=new Uint8Array(await files[0].arrayBuffer());
   const pdf=await pdfjs.getDocument({data}).promise;
   const zip=new JSZip();
   for(let i=1;i<=pdf.numPages;i++){
    const page=await pdf.getPage(i);
    const base=page.getViewport({scale:1});
    const scale=Math.min(2,1800/Math.max(base.width,base.height));
    const viewport=page.getViewport({scale});
    const canvas=document.createElement("canvas");
    canvas.width=Math.ceil(viewport.width);canvas.height=Math.ceil(viewport.height);
    const ctx=canvas.getContext("2d");if(!ctx)throw new Error("Canvas unavailable");
    await page.render({canvasContext:ctx,viewport}).promise;
    const blob=await new Promise<Blob|null>(resolve=>canvas.toBlob(resolve,"image/jpeg",0.9));
    if(!blob)throw new Error("JPG conversion failed");
    zip.file(`page-${i}.jpg`,blob);
    page.cleanup();canvas.width=1;canvas.height=1;
   }
   save(await zip.generateAsync({type:"blob"}),"pdf-pages-jpg.zip");
   setMsg(`Done — converted ${pdf.numPages} page(s) to JPG in your browser.`);
  }catch{setMsg("Could not convert this PDF. Check that the file is a valid PDF and try again.");}
  finally{setBusy(false);}
 };
 return <div><div className="drop"><h2>PDF to JPG</h2><p>Convert every PDF page into a JPG image. Processing happens locally in your browser.</p><FilePicker accept=".pdf" files={files} onChange={next=>{setFiles(next);setMsg("")}}/><button className="btn" disabled={!files.length||busy} onClick={run}>{busy?"Converting…":"Convert to JPG"}</button></div>{files[0]&&<div className="files"><div className="file"><span>{files[0].name}</span><span>{Math.max(1,Math.round(files[0].size/1024))} KB</span></div></div>}{msg&&<div className="notice">{msg}</div>}</div>
}