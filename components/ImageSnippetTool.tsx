"use client";
import {useState} from "react";import FilePicker from "./FilePicker";
export default function ImageSnippetTool({kind}:{kind:"html"|"markdown"|"css"}){const [file,setFile]=useState<File|null>(null);const [out,setOut]=useState("");
 const run=()=>{if(!file)return;const r=new FileReader();r.onload=()=>{const v=String(r.result||"");setOut(kind==="html"?'<img src="'+v+'" alt="Image">':kind==="markdown"?'![Image]('+v+')':'background-image: url("'+v+'");')};r.readAsDataURL(file)};
 return <div className="drop"><h2>{kind==="html"?"Image to HTML":kind==="markdown"?"Image to Markdown":"Image to CSS"}</h2><p>Create a ready-to-copy snippet from an image without uploading it.</p><FilePicker accept="image/jpeg,image/png,image/webp" files={file?[file]:[]} onChange={next=>setFile(next[0]||null)}/><button className="btn" disabled={!file} onClick={run}>Generate snippet</button>{out&&<textarea value={out} readOnly style={{width:"100%",minHeight:150,marginTop:16}}/>}</div>;
}