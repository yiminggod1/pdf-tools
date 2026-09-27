"use client";
import {useState} from "react";
export default function Base64ToImageTool(){const [value,setValue]=useState("");const [msg,setMsg]=useState("");
const run=()=>{const v=value.trim();if(!v.startsWith("data:image/")){setMsg("Please paste a valid image data URL.");return}const a=document.createElement("a");a.href=v;a.download="decoded-image";a.click();setMsg("Image download started.");};
return <div className="drop"><h2>Base64 to Image</h2><p>Paste an image data URL to create a downloadable image.</p><textarea value={value} onChange={e=>setValue(e.target.value)} placeholder="data:image/png;base64,..." style={{width:"100%",minHeight:160}}/><button className="btn" disabled={!value.trim()} onClick={run}>Create image</button>{msg&&<div className="notice">{msg}</div>}</div>}