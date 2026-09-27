"use client";
import {useState} from "react";import {PDFDocument} from "pdf-lib";
export default function PdfPageTool({mode}:{mode:"delete"|"extract"}){
 const [file,setFile]=useState<File|null>(null),[pages,setPages]=useState("1"),[busy,setBusy]=useState(false),[msg,setMsg]=useState("");
 const run=async()=>{if(!file)return;setBusy(true);setMsg("");try{
  const src=await PDFDocument.load(await file.arrayBuffer()),count=src.getPageCount();
  const nums=pages.split(",").flatMap(x=>{const [a,b]=x.trim().split("-").map(Number);if(!a)return [];if(b&&b>=a)return Array.from({length:b-a+1},(_,i)=>a+i);return [a]}).filter(n=>n>=1&&n<=count);
  if(!nums.length)throw new Error();
  const keep=Array.from({length:count},(_,i)=>i+1);
  const selected=mode==="extract"?nums:keep.filter(n=>!nums.includes(n));
  if(!selected.length)throw new Error();
  const out=await PDFDocument.create();const copied=await out.copyPages(src,selected.map(n=>n-1));copied.forEach(p=>out.addPage(p));
  const blob=new Blob([await out.save()],{type:"application/pdf"}),a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download=mode==="extract"?"extracted-pages.pdf":"pages-removed.pdf";a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);setMsg(`Done — processed ${count} page(s) locally.`);
 }catch{setMsg("Could not process the PDF. Check the page numbers and try again.")}finally{setBusy(false)}};
 return <div><div className="drop"><h2>{mode==="extract"?"Extract PDF Pages":"Delete PDF Pages"}</h2><p>Select a PDF and enter page numbers such as 1,3,5-7.</p><input type="file" accept=".pdf,application/pdf" onChange={e=>setFile(e.target.files?.[0]||null)}/>{file&&<label className="pageinput">Pages <input value={pages} onChange={e=>setPages(e.target.value)} placeholder="1,3,5-7"/></label>}<button className="btn" disabled={!file||busy} onClick={run}>{busy?"Processing…":"Process PDF"}</button></div>{msg&&<div className="notice">{msg}</div>}</div>
}