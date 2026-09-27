"use client";
import {useId,useRef,type DragEvent} from "react";

export default function FilePicker({accept,multiple=false,files,onChange}:{accept:string;multiple?:boolean;files:File[];onChange:(files:File[])=>void}){
 const id=useId();
 const inputRef=useRef<HTMLInputElement|null>(null);
 const pick=(next:File[])=>{onChange(multiple?next:next.slice(0,1));};
 const onDrop=(e:DragEvent<HTMLDivElement>)=>{
  e.preventDefault();
  e.currentTarget.classList.remove("isDragging");
  pick(Array.from(e.dataTransfer.files||[]));
 };
 const clear=()=>{if(inputRef.current)inputRef.current.value="";onChange([])};
 return <div className="filePicker" onDragOver={e=>{e.preventDefault();e.currentTarget.classList.add("isDragging")}} onDragLeave={e=>e.currentTarget.classList.remove("isDragging")} onDrop={onDrop}>
  <input ref={inputRef} id={id} className="filePickerInput" type="file" accept={accept} multiple={multiple} onChange={e=>pick(Array.from(e.target.files||[]))}/>
  <label className="filePickerButton" htmlFor={id}>Choose file{multiple?"s":""}</label>
  <span className="filePickerHint">or drop {multiple?"files":"a file"} here</span>
  <span className="filePickerName">{files.length?files.length===1?files[0].name:`${files.length} files selected`:"No file selected"}</span>
  {files.length>0&&<button type="button" className="filePickerClear" onClick={clear}>Clear</button>}
 </div>;
}
