"use client";
import {useState} from "react";
export default function Base64ToImageTool(){
 const [value,setValue]=useState(""),[msg,setMsg]=useState("");
 const run=()=>{const v=value.trim();const header=v.slice(0,v.indexOf(","));if(!header.toLowerCase().startsWith("data:image/")||!header.toLowerCase().includes(";base64")){setMsg("Please paste a valid image data URL.");return}const ext=header.split("/")[1].split(";")[0].split("+")[0].replace("jpeg","jpg");const a=document.createElement("a");a.href=v;a.download=`decoded-image.${ext}`;a.click();setMsg("Image download started.");};
 return <div className="drop"><h2>Base64 to Image</h2><p>Paste an image data URL to create a downloadable image.</p><textarea value={value} onChange={e=>{setValue(e.target.value);setMsg("")}} placeholder="data:image/png;base64,..." style={{width:"100%",minHeight:160}}/><button className="btn" disabled={!value.trim()} onClick={run}>Create image</button>{msg&&<div className="notice">{msg}</div>}</div>
}