import { memo, useCallback, useEffect, useRef, useState } from "react"
import WebFileSys,{FileNode} from "@services/files"
import { ArrowLeftIcon, ArrowRightIcon, Search } from "lucide-react"
import folder from "@/assets/folder.png"
import useMovilStore from "@stores/movil"

import FileNoteIcon from "@/assets/notes.png"
import FileHtmlIcon from "@/assets/htmlFile.webp"

    const icons: { [key: string]: string } = {
        "html": FileHtmlIcon,
        "txt": FileNoteIcon,
    }



    type CreateFileState = {
        isCreating: boolean
        name: string
        type: "file" | "folder" | undefined
    }


interface FileExplorerProps {
    Folder?: string
}




 function FileExplorer({Folder}:FileExplorerProps) {
  const [currentPath, setCurrentPath] = useState(()=>{
        return Folder || "/"
  })
  const refelement = useRef<HTMLDivElement>(null)
  const [selectedFiles, setSelectedFiles] = useState<FileNode|undefined>()
  const [files,setFiles] = useState<FileNode[]>([])

  const [createFileState, setCreateFileState] = useState<CreateFileState>({
    isCreating: false,
    name: "",
    type: undefined,
  })


  const createProcess = useMovilStore((state) => state.addProcess)
  const setContextMenu = useMovilStore((state) => state.setContextMenu)



  const getFiles = useCallback(() => {
      const result = WebFileSys.getFromPath(currentPath);

      if (result.ok) {
          const currentEntry = result.value;
          if (currentEntry.isDirectory) {
              console.log("es un directorio")
              setFiles([...currentEntry.children]);
          } else {
              setFiles([]);
          }
      }else{
          console.log("error",result.error)
      }
  }, [currentPath]);



  function actionHandler(option:string){
        const options: Record<string,()=>void> = {
            "new folder":()=>{
                setCreateFileState({ isCreating: true, name: "", type: "folder" });
            },
            "new file":()=>{
                setCreateFileState({ isCreating: true, name: "", type: "file" });
            },
            "delete":()=>{
                if(selectedFiles){
                    WebFileSys.rm(`${currentPath}${selectedFiles.name}`)
                }
            },
            "open chrome":()=>{
                if(selectedFiles && !selectedFiles.isDirectory){
                createProcess({name:"Viewer",component:()=><></>,maximized:true,urlIcon:"https://cdn-icons-png.flaticon.com/512/732/732200.png",params:selectedFiles.content})
                }
            },

            "open vscode":()=>{
                    createProcess({name:"vscode",component:()=><></>,maximized:true,urlIcon:"https://cdn-icons-png.flaticon.com/512/732/732200.png",params:{
                        workfolder:currentPath,
                    }})
            }
        }

        if(options[option]){
            options[option]()
        }


    }





  useEffect(()=>{




      WebFileSys.suscribe(getFiles)

      getFiles()

      const currentRef = refelement.current;

      currentRef?.addEventListener("contextmenu",(event)=>{
          event.preventDefault()
            setContextMenu(event.clientX,event.clientY,true,"file",selectedFiles,actionHandler)
      })

      currentRef?.addEventListener("click",()=>{
          setTimeout(()=>{
                setContextMenu(0,0,false,"",undefined,()=>{})
                setSelectedFiles(undefined)
          })
      })

      return ()=>{
          currentRef?.removeEventListener("contextmenu",()=>{})
          currentRef?.removeEventListener("click",()=>{})

          WebFileSys.desuscribe(getFiles)
      }

  },[getFiles])

  


  return <div className="w-full h-full bg-neutral-900 text-white relative z-10" ref={refelement}>
      <div className="bg-neutral-950 p-1 flex items-center gap-2">
          <button 
          
          disabled={currentPath == "/"}
          onClick={()=>{ 
              const newPath = currentPath.split("/").slice(0,-2).join("/") + "/"
              setCurrentPath(newPath)
          }} className={`p-2  ${currentPath == "/"  ? "text-neutral-400" : "text-white"  } `}>
              <ArrowLeftIcon size={20} />
          </button>

          <button onClick={()=>{
              setCurrentPath("/")
          }
          } className="p-2">
              <ArrowRightIcon size={20} />
          </button>


          <input type="text" className="bg-neutral-950 border-neutral-700 border px-2" value={currentPath} disabled />
          <label className="relative">
          <input type="text" className="bg-neutral-950 border-neutral-700 border px-2"  placeholder="search"  />
          <Search size={18} className="absolute right-1 top-1 text-neutral-600" />
          </label>


      </div>

  <div className="grid h-full grid-cols-[repeat(auto-fill,74px)] grid-row-[repeat(auto-fill,70px)]  gap-2 p-2 overflow-auto place-content-start">
  {files?.map((file) => {

        const ext = file.name.includes(".") ? file.name.split(".").pop() : "txt"
        let icon =  file.isDirectory ? folder :  icons[ext || "txt"] || FileNoteIcon

        icon =   !file.isDirectory && file.contentType == "app" ? file.content as string : icon


      return  <button className="p-0.5 w-full"
          onContextMenu={(e)=>{
                e.preventDefault()
                setSelectedFiles(file)
                setContextMenu(e.clientX,e.clientY
                    
                    ,true,"file",file,actionHandler)
          }}
          
          onClick={()=>{
               if(file.isDirectory) setCurrentPath(currentPath + file.name + "/")
                if(!file.isDirectory){
                    if(file.contentType == "app"){
                        createProcess({name:file.name,component:()=><></>,maximized:true,urlIcon:file.content as string})
                        return
                    }

                    const extesion = file.name.includes(".") ? file.name.split(".").pop() : "txt"

                    if(extesion == "html"){
                        createProcess({name:"vscode",component:()=><></>,maximized:true,urlIcon:"https://cdn-icons-png.flaticon.com/512/732/732200.png",params:{file:`${currentPath}${file.name}`}})
                        return
                    }

                    if(extesion == "txt"){
                        createProcess({name:"BlockNotes",component:()=><></>,maximized:true,urlIcon:"https://cdn-icons-png.flaticon.com/512/732/732200.png",params:`${currentPath}${file.name}`})
                        return
                    }

                }
          }
          }
          key={file.name}
      
      >
          <figure className="flex flex-col items-center gap-2  hover:bg-neutral-800 aspect-square h-min">
          <picture className="size-12">
          <img src={icon}
          alt="file"   className="object-contain aspect-square"/>
          </picture>
          <figcaption className="text-xs text-wrap">{file.name}</figcaption>
      </figure>
      </button>
  })
}


  {/*is like a file when press enter create a file with the name, and change isCreating to false  */}
{
    createFileState.isCreating && (
        <button className="p-0.5 w-full"      >
          <figure className="flex flex-col items-center gap-2  hover:bg-neutral-800 aspect-square h-min">
          <picture className="size-12">
          <img src={createFileState.type === "folder" ? folder : FileNoteIcon}
          alt="file"   className="object-contain aspect-square"/>
          </picture>
          <input 
            type="text" 
            className="bg-transparent text-center focus:outline-none text-xs text-wrap"
            value={createFileState.name}
            onChange={(e) => setCreateFileState({ ...createFileState, name: e.target.value })}
            onKeyDown={(e) => {
              if (e.key === "Enter") {

                

                let result;
                const fs = WebFileSys;
                if (createFileState.type === "folder") {
                  result = fs.mkdir(currentPath, createFileState.name);
                } else {
                  result = fs.touch(currentPath, createFileState.name);
                }

                if (!result.ok) {
                    setCreateFileState({ isCreating: false, name: "", type: undefined });
                } else {
                  setCreateFileState({ isCreating: false, name: "" , type: undefined});
                }
              }
            }}
            autoFocus
          />
      </figure>
      </button>
    )


}
  
  
  
  
  
  
  </div>






  <footer className="absolute bottom-0 bg-neutral-700 flex w-full">
      <span className="ml-4 text-xs p-1">{files?.length} items |</span>

  </footer>




  </div>
}


export default memo(FileExplorer)