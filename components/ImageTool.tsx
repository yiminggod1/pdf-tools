"use client";
import {useEffect,useState} from "react";
import FilePicker from "./FilePicker";
type Mode="resize"|"compress"|"convert";
export default function ImageTool({mode}:{mode:Mode}){
 const [file,setFile]=useState<File|null>(null),[width,setWidth]=useState(""),[height,setHeight]=useState(""),[quality,setQuality]=useState("80"),[format,setFormat]=useState<"image/jpeg"|"image/png"|"image/webp">("image/jpeg"),[busy,setBusy]=useState(false),[msg,setMsg]=useState(""),[original,setOriginal]=useState("");
 useEffect(()=>{if(!file){setOriginal("");return}const u=URL.createObjectURL(file),img=new Image();img.onload=()=>{setOriginal(`${img.naturalWidth} × ${img.naturalHeight}px`);URL.revokeObjectURL(u)};img.onerror=()=>{setOriginal("Unknown dimensions");URL.revokeObjectURL(u)};img.src=u;return()=>URL.revokeObjectURL(u)},[file]);
 const run=async()=>{if(!file)return;setBusy(true);setMsg("");try{
  const src=URL.createObjectURL(file),img=new Image();
  await new Promise((res,rej)=>{img.onload=res;img.onerror=rej;img.src=src});
  const requestedW=width.trim()?Number(width):0,requestedH=height.trim()?Number(height):0;
  if((requestedW&&(!Number.isFinite(requestedW)||requestedW<1))||(requestedH&&(!Number.isFinite(requestedH)||requestedH<1)))throw new Error();
  let w=requestedW||img.naturalWidth,h=requestedH||img.naturalHeight;
  if(mode==="resize"&&requestedW&&!requestedH)h=Math.max(1,Math.round(img.naturalHeight*w/img.naturalWidth));
  if(mode==="resize"&&requestedH&&!requestedW)w=Math.max(1,Math.round(img.naturalWidth*h/img.naturalHeight));
  if(mode==="compress"){w=img.naturalWidth;h=img.naturalHeight}
  const canvas=document.createElement("canvas");canvas.width=w;canvas.height=h;const ctx=canvas.getContext("2d");if(!ctx)throw new Error();
  ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality="high";ctx.drawImage(img,0,0,w,h);URL.revokeObjectURL(src);
  const outType=mode==="convert"?format:"image/jpeg",q=mode==="compress"?Number(quality)/100:.9;
  const blob=await new Promise<Blob|null>(res=>canvas.toBlob(res,outType,q));if(!blob)throw new Error();
  const ext=outType==="image/png"?"png":outType==="image/webp"?"webp":"jpg",u=URL.createObjectURL(blob),a=document.createElement("a");a.href=u;a.download=`image-${mode}.${ext}`;a.click();setTimeout(()=>URL.revokeObjectURL(u),1000);
  setMsg(`Done — ${w} × ${h}px, ${Math.round(blob.size/1024)} KB output created in your browser.`);
 }catch{setMsg("Could not process this image. Check the dimensions, format and file, then try again.")}finally{setBusy(false)}};
 const title={resize:"Resize Image",compress:"Compress Image",convert:"Convert Image"}[mode];
 return <div><div className="drop"><h2>{title}</h2><p>Select an image. Processing stays on your device.</p><FilePicker accept="image/jpeg,image/png,image/webp" files={file?[file]:[]} onChange={next=>{setFile(next[0]||null);setMsg("");if(!next[0])setOriginal("")}}/>{file&&<><p className="filecount">Original: {original||"reading dimensions…"} · {Math.max(1,Math.round(file.size/1024))} KB</p>{mode!== "compress"&&<div className="controls"><label>Width <input type="number" min="1" value={width} onChange={e=>setWidth(e.target.value)} inputMode="numeric" placeholder="auto"/></label><label>Height <input type="number" min="1" value={height} onChange={e=>setHeight(e.target.value)} inputMode="numeric" placeholder="auto"/></label></div>}{mode==="compress"&&<div className="controls"><label>Quality <input type="range" min="20" max="95" value={quality} onChange={e=>setQuality(e.target.value)}/><span>{quality}%</span></label></div>}{mode==="convert"&&<div className="controls"><label>Format <select value={format} onChange={e=>setFormat(e.target.value as typeof format)}><option value="image/jpeg">JPG</option><option value="image/png">PNG</option><option value="image/webp">WebP</option></select></label></div>}</>}<button className="btn" disabled={!file||busy} onClick={run}>{busy?"Processing…":"Process image"}</button></div>{msg&&<div className="notice">{msg}</div>}</div>
}