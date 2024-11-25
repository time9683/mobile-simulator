import WebFileSys from "@services/files"
import { useEffect, useRef, useState } from "react"


interface BlockNotesProps {
  FileName : string
}



export default function BlockNotes({FileName}:BlockNotesProps) {
  const [currentFile,setCurrentFile] = useState<string>(FileName)
  const [content,setContent] = useState<string>("")
  // this is to know if the user has made changes to the file
  const [isDirty,setIsDirty] = useState(false)
  const refElement = useRef<HTMLTextAreaElement>(null)

  useEffect(()=>{
     if(currentFile === "") return
     const result = WebFileSys.getFromPath(currentFile)
      if(result.ok){
        const file = result.value
        if(!file.isDirectory){
          setContent(file.content as string)
        }else{
          alert("No es un archivo")
        }
      }else{
        alert(result.error)
      }
  },[currentFile])

  useEffect(()=>{
    function handleKeyDown(event:KeyboardEvent){

    
      if(event.ctrlKey && event.key === "s"){
        if(currentFile === "") {
          event.preventDefault()
          const name = prompt("Enter the name of the file")
          if(name === null) return
          const result = WebFileSys.touch("/",name)
          if(!result.ok){
            alert(result.error)
            return
          }
          WebFileSys.WriteFile("/"+name,content)
          setCurrentFile(`/${name}`)
          setIsDirty(false)
          return
        } 





        event.preventDefault()
        saveFile()
      }
    }

    document.addEventListener("keydown",handleKeyDown)

    return ()=>{
      document.removeEventListener("keydown",handleKeyDown)
    }

    
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[content])


  function saveFile(){
    if(currentFile === "") return
    console.log("saving file")
    const result = WebFileSys.WriteFile(currentFile,content)
    if(result.ok){
      console.log(result.value.content)
      setIsDirty(false)
    }else{
      alert(result.error)
    }
  }





  function handleChange(event: React.ChangeEvent<HTMLTextAreaElement>){
    setContent(event.target.value)
    setIsDirty(true)
  }



  return (
    <div className="bg-neutral-900 text-white h-full relative">
      {isDirty && (
        <div className="absolute top-0 right-0 m-2 p-1 bg-red-600 text-white text-xs rounded">
          Unsaved Changes
        </div>
      )}
      <textarea
        ref={refElement}
        value={content}
        onChange={handleChange}
        className="h-full w-full bg-neutral-900 text-white focus:outline-none p-2"
      ></textarea>
    </div>
  )













}