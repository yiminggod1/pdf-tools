"use client";
import {useId} from "react";

export default function FilePicker({accept,multiple=false,files,onChange}:{accept:string;multiple?:boolean;files:File[];onChange:(files:File[])=>void}){
 const id=useId();
 return <div className="filePicker">
  <input id={id} className="filePickerInput" type="file" accept={accept} multiple={multiple} onChange={e=>onChange(Array.from(e.target.files||[]))}/>
  <label className="filePickerButton" htmlFor={id}>Choose file{multiple?"s":""}</label>
  <span className="filePickerName">{files.length?files.length===1?files[0].name:`${files.length} files selected`:"No file selected"}</span>
 </div>;
}