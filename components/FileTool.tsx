"use client";
import {useState} from "react";
import {PDFDocument,degrees} from "pdf-lib";
export default function FileTool({mode}:{mode:"merge"|"split"|"rotate"|"imagepdf"}) {
 const [files,setFiles]=useState<File[]>([]); const [busy,setBusy]=useState(false); const [msg,setMsg]=useState("");
 const pick=(e:React.ChangeEvent<HTMLInputElement>)=>{setFiles(Array.from(e.target.files||[]));setMsg("")};
 const download=(bytes:Uint8Array,name:string,type="application/pdf")=>{const blob=new Blob([bytes as BlobPart],{type});const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download=name;a.click();URL.revokeObjectURL(a.href)};
 const run=async()=>{setBusy(true);setMsg("");try{
  if(mode==="imagepdf"){const pdf=await PDFDocument.create();for(const f of files){const b=await f.arrayBuffer();let img:any; if(f.type==="image/jpeg")img=await pdf.embedJpg(b);else img=await pdf.embedPng(b);const page=pdf.addPage([595,842]);const scale=Math.min(555/img.width,802/img.height);page.drawImage(img,{x:(595-img.width*scale)/2,y:(842-img.height*scale)/2,width:img.width*scale,height:img.height*scale});}download(await pdf.save(),"images.pdf");}
  else if(mode==="merge"){const out=await PDFDocument.create();for(const f of files){const src=await PDFDocument.load(await f.arrayBuffer());const pages=await out.copyPages(src,src.getPageIndices());pages.forEach(p=>out.addPage(p));}download(await out.save(),"merged.pdf");}
  else if(mode==="split"){const src=await PDFDocument.load(await files[0].arrayBuffer());for(let i=0;i<src.getPageCount();i++){const out=await PDFDocument.create();const [p]=await out.copyPages(src,[i]);out.addPage(p);download(await out.save(),`page-${i+1}.pdf`);}}
  else {const src=await PDFDocument.load(await files[0].arrayBuffer());src.getPages().forEach(p=>p.setRotation(degrees((p.getRotation().angle+90)%360)));download(await src.save(),"rotated.pdf");}
  setMsg("Done — your file was created in your browser.");}catch(e){setMsg("Could not process this file. Check that the format is valid and try again.")}finally{setBusy(false)}};
 const accept=mode==="imagepdf"?".jpg,.jpeg,.png":".pdf"; const title={merge:"Merge PDF",split:"Split PDF",rotate:"Rotate PDF",imagepdf:"Images to PDF"}[mode];
 return <div><div className="drop"><h2>{title}</h2><p>Select your files. Processing happens locally in your browser.</p><input type="file" multiple={mode==="merge"||mode==="imagepdf"} accept={accept} onChange={pick}/><br/><button className="btn" disabled={!files.length||busy} onClick={run}>{busy?"Processing…":"Process files"}</button></div>{files.length>0&&<div className="files">{files.map((f,i)=><div className="file" key={i}><span>{f.name}</span><span>{Math.round(f.size/1024)} KB</span></div>)}</div>}{msg&&<div className="notice">{msg}</div>}</div>
}