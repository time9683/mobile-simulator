import { Editor } from "@monaco-editor/react";
import { useEffect,useRef,useState } from "react";
import  WebFileSys from "@services/files";


const extToLanguage: { [key: string]: string } = {
  "html": "html",
  "txt": "plaintext",
  "js": "javascript",
  "css": "css",
}




interface VscodeProps {
  file?: string,
  workFolder?: string
  }



  type finderItem = {
    name: string
    path: string
  }


export default function Vscode({file,workFolder}:VscodeProps){
  const [currentFile,setCurrentFile] = useState<string>("")
  const [content,setContent] = useState<string>("")
  const [finder,setFinder] = useState({
    visible: false,
    files: [] as finderItem[]
  })
  const [isDirty,setIsDirty] = useState(false)


  const refElement = useRef<HTMLDivElement>(null)
  const refFinder = useRef<HTMLDivElement>(null)

  useEffect(()=>{
    if(currentFile === "") return
    const result = WebFileSys.getFromPath(currentFile)
    if(result.ok){
      const file = result.value
      if(!file.isDirectory){
        console.log(file)
        setContent(file.content as string)
      }else{
        alert("No es un archivo")
      }
    }else{
      alert(result.error)
    }
  },[currentFile])

  function getSubFiles(path:string):finderItem[]{
    const result = WebFileSys.getFromPath(path)
    if(!result.ok){
      alert(result.error)
      return []
    }

    if (!result.value.isDirectory) {
      alert("No es un directorio")
      return []
    }

    return result.value.children.map((file) => {
      if (file.isDirectory) {
        return false
      }
      return {
        name: file.name,
        path: `${path}/${file.name}`
      }
    } ).filter((file) => file !== false)
  }






  useEffect(()=>{
    function handleKeyDown(event:KeyboardEvent){
      if(event.ctrlKey && event.key === "p"){
        event.preventDefault()
        const result = WebFileSys.getFromPath(workFolder || "/Documents")

        if(!result.ok){
          alert(result.error)
          return
        }

        if (!result.value.isDirectory) {
          alert("No es un directorio")
          return
        }

        const files : finderItem[] = result.value.children.map((file) => {
          // get sub files if is a directory
          if (file.isDirectory) {
            return getSubFiles(`${workFolder || "/Documents"}${file.name}`)
          }

          return {
            name: file.name,
            path: ((workFolder || "/Documents") + "/" + file.name)
            
          }

        }
        ).flat() as finderItem[]


      
      

        setFinder({
          visible: true,
          files:files
        });
      }

      if (event.ctrlKey && event.key === "s") {
        event.preventDefault()
        console.log(currentFile)
        const result = WebFileSys.WriteFile(currentFile,content)
        if(!result.ok){
          alert(result.error)
        }

        setIsDirty(false)
      }


      if(event.key === "Escape"){
        setFinder({
          visible: false,
          files: []
        })
      }


    }
    window.addEventListener("keydown",handleKeyDown)
    return () => window.removeEventListener("keydown",handleKeyDown)
  },[currentFile,content])


  useEffect(()=>{
    if(file){
      setCurrentFile(file)
    }
  },[file])



  const  ext = currentFile.split(".").pop() || ""
  const language = extToLanguage[ext as string] || "plaintext"



  return <div ref={refElement} className="h-full w-full relative">
  { finder.visible &&  (<div 
  ref={refFinder}
  className=" w-72 shadow-lg shadow-neutral-900 top-1 rounded absolute bg-neutral-800  left-0 right-0 m-auto text-white z-10 ">
      {finder.files.map((file,index) => <li className="list-none
      w-full
      "> <button 
       {...{autoFocus: index === 0}}
      tabIndex={0}
      key={file.path}
      className="
      text-start
        hover:bg-neutral-700 p-1
        text-sm
        w-full
        pl-4
        cursor-pointer
        focus:outline-none
        focus:bg-neutral-700
      " onClick={() => {

        setCurrentFile(file.path)
        setFinder({
          visible: false,
          files: []
        })

      }}>
        
        {file.name}
        <span className="text-gray-400 ml-2 text-xs">
          {file.path.split("/").slice(0,-1).join("/")}
          {

          }
        </span>
        </button></li>)}  
    </div>)
}
    
 { currentFile ? ( 
  <>
  <Editor  height="100%" language={language}
  value={content} onChange={(value)=>{
    
    setIsDirty(true)
    setContent(value as string)}}
  theme="vs-dark" />
  <span className="absolute bottom-1 left-1 text-white text-sm p-1 bg-blue-500"> {currentFile.split("/").at(-1)} 
  {isDirty && <span className="text-sm ml-2">* </span>}
  </span>
  </>
 )
  :(
    // say to user press ctrl + p to open the finder
    <div className="w-full h-full flex justify-center items-center bg-neutral-900">
      <span className="text-white text-lg flex gap-2">Press 
        <kbd className="bg-neutral-700 p-1 rounded ">Ctrl</kbd> 
        + <kbd className="bg-neutral-700 p-1 rounded ">p</kbd>to open the finder</span>
        
      </div>
  

  )}
  
  </div> 
}