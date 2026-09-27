"use client";
import {useState} from "react";
import FilePicker from "./FilePicker";
export default function ImageSnippetTool({kind}:{kind:"html"|"markdown"|"css"}){
 const [file,setFile]=useState<File|null>(null),[out,setOut]=useState(""),[msg,setMsg]=useState("");
 const run=()=>{if(!file)return;const r=new FileReader();r.onload=()=>{const v=String(r.result||"");setOut(kind==="html"?"<img src=\""+v+"\" alt=\"Image\">":kind==="markdown"?"![Image]("+v+")":"background-image: url(\""+v+"\");");setMsg("Snippet generated — ready to copy.")};r.readAsDataURL(file)};
 const copy=async()=>{try{await navigator.clipboard.writeText(out);setMsg("Copied to clipboard.")}catch{setMsg("Select the snippet and copy it manually.")}};
 return <div className="drop"><h2>{kind==="html"?"Image to HTML":kind==="markdown"?"Image to Markdown":"Image to CSS"}</h2><p>Create a ready-to-copy snippet from an image without uploading it.</p><FilePicker accept="image/jpeg,image/png,image/webp" files={file?[file]:[]} onChange={next=>{setFile(next[0]||null);setOut("");setMsg("")}}/><button className="btn" disabled={!file} onClick={run}>Generate snippet</button>{out&&<><div className="snippetActions"><button type="button" className="miniBtn" onClick={copy}>Copy snippet</button></div><textarea value={out} readOnly style={{width:"100%",minHeight:150,marginTop:12}}/></>}{msg&&<div className="notice">{msg}</div>}</div>;
}