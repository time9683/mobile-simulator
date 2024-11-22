import { memo, useCallback, useEffect, useRef, useState } from "react"
import WebFileSys,{FileSystemEntry} from "@services/files"
import { ArrowLeftIcon, ArrowRightIcon, Search } from "lucide-react"
import folder from "@/assets/folder.png"

 function FileExplorer() {
  const [currentPath, setCurrentPath] = useState("/")
  const refelement = useRef<HTMLDivElement>(null)
  const [contextMenu, setContextMenu] = useState(false)
  const [files,setFiles] = useState<FileSystemEntry[]>([])

  const [userClickContext, setUserClickContext] = useState({x:0,y:0})


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





  useEffect(()=>{


      WebFileSys.suscribe(()=>{
          getFiles()
      })

      getFiles()

      refelement.current?.addEventListener("contextmenu",(event)=>{
          event.preventDefault()
          setUserClickContext({x:event.offsetX,y:event.offsetY})
          setContextMenu(true)
      })

      refelement.current?.addEventListener("click",()=>{
          setTimeout(()=>{

              setContextMenu(false)
          })
      })

      return ()=>{
          refelement.current?.removeEventListener("contextmenu",()=>{})
          refelement.current?.removeEventListener("click",()=>{})
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
      return  <button className="p-0.5 w-full"
          onAuxClick={()=>{
              console.log("esto es un click aux")
          }}
          
          onClick={()=>{
               if(file.isDirectory) setCurrentPath(currentPath + file.name + "/")
          }
          }
      
      >
          <figure className="flex flex-col items-center gap-2  hover:bg-neutral-800 aspect-square h-min">
          <picture className="size-12">
          <img src={ file.isDirectory ?  folder
          : "https://cdn-icons-png.flaticon.com/512/732/732223.png"}
          alt="file"   className="object-contain aspect-square"/>
          </picture>
          <caption>{file.name}</caption>
      </figure>
      </button>
  })
}
  </div>


  <footer className="absolute bottom-0 bg-neutral-700 flex w-full">
      <span className="ml-4 text-xs p-1">{files?.length} items |</span>

  </footer>


  {
  contextMenu &&
      <div className="bg-neutral-800  border-neutral-600 border w-52 h-min z-20"
      
      style={{position:"absolute",top:`${userClickContext.y}px`,left:`${userClickContext.x}px`}}
      >
      {
          ["new folder","new file","paste","cut","copy","delete"].map((option)=>{
              return <button 
              onClick={()=>{

                  if(option === "new folder"){
                      const fs  = WebFileSys
                      const randomN = Math.floor(Math.random()*1000)
                      const result =   fs.mkdir(currentPath,`newDir ${randomN}`)
                      if(!result.ok){
                          alert(result.error)
                      }
                  }

                  if (option === "new file"){
                      const fs  = WebFileSys
                      const randomN = Math.floor(Math.random()*1000)
                      const result =   fs.touch(currentPath,`newFile ${randomN}`)
                      if(!result.ok){
                          alert(result.error)
                      }
                  }


              }}
              
              className="w-full p-2  border-neutral-700 text-xs
              hover:bg-neutral-700 hover:text-neutral-100
              
              ">{option}</button>
          }
          )
      }

  </div>
}

  </div>
}


export default memo(FileExplorer)