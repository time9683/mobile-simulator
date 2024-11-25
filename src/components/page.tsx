import useMovilStore from "@stores/movil.ts"
import { useEffect, useRef, useState, CSSProperties, memo, useCallback } from "react"
import { getRowAndColumn } from "@/utils"
import Galery from "@components/Galery"
import ProcessList from "@components/ProcessList"
import Camara from "@components/camara"
import {  AnimatePresence } from "framer-motion"
import Phone from "@components/Phone"
import Recorder from "@components/Recorder"
import Whatsapp from "@components/Whassapp"
import NavigationView from "./NavigationView"
import  Windows from "./Window"
import FileExplorer from "./FileExplorer"
import BlockNotes from "./BlockNotes"

import FileNoteIcon from "@/assets/notes.png"
import FileHtmlIcon from "@/assets/htmlFile.webp"
import WebFileSys from "@/services/files"
import Folder from "@/assets/folder.png"






import Vscode from "./vscode"
import { FileNode } from "@/services/files"
import ContentMenu, { Option, OptionExplorer, OptionFile } from "./ContextMenu"

function Iframe({ url }: { url: string }) {
    const refElement = useRef<HTMLIFrameElement>(null)

    


    return <iframe 
    
    onLoad={()=>{

        refElement.current?.style.setProperty("position","relative")
        refElement.current?.style.setProperty("left","0 ")


    }}

    ref={refElement}
    src={url} className="w-full h-full" />
}













const getSecondPage = (page: string,params?:unknown): JSX.Element | null => {
    const PageComponents: { [key: string]: JSX.Element } = {
        "Navigation": <NavigationView />,
        "Chrome": <Iframe url="https://www.google.com/webhp?igu=1" />,
        "Netflix": <Iframe url="https://fmovies2u.in/movies/" />,
        "Spotify": <Iframe url="https://honey-tyagi-spotify-clone.vercel.app/login/login.html" />,
        "Amazon": <Iframe url="https://www.mercadolibre.com.ve/" />,
        "Youtube": <Iframe url="https://www.dailymotion.com/co" />,
        "Galeria": <Galery />,
        "Procesos": <ProcessList />,
        "Camara": <Camara />,
        "Telefono": <Phone />,
        "Recorder": <Recorder />,
        "Whatsapp": <Whatsapp />,
        "FileExplorer": <FileExplorer  Folder={(params as {folder?:string})?.folder}  />,
        "BlockNotes" : <BlockNotes FileName={params as string ?? ""}  />,
        // this show a string html in a iframe processes
        "Viewer" :  <iframe srcDoc={params as string ?? ""} className="w-full h-full" />,
        "vscode":  <Vscode file={(params as {file?:string})?.file}  workFolder={(params as {workfolder?:string})?.workfolder} 
            />


    }
    return PageComponents[page] || null
}



// const width = 90
// const height = 114
const MemoHome = memo(Home)
const MemoBlock = memo(Block)
const MemoIconApp = memo(IconApp)



export default function Page() {
    // const currentPage = useMovilStore((state) => state.currentPage)
    const OpenAplications = useMovilStore((state)=> state.process)
    const changeMinimized = useMovilStore((state) => state.maximizeProcess)
    const removeProcess = useMovilStore((state) => state.removeProcess)

    return (
        <div className="relative h-full">

            <AnimatePresence>
            {
                OpenAplications.map((app) => {
                    return <Windows 
                    key={app.pid}
                    TogleMinimized={()=>changeMinimized(app)}
                    minimized={!app.maximized}
                    remove={()=>removeProcess(app)}
                    appName={app.name} >{
                        getSecondPage(app.name,app.params)
                    }</Windows>
                    
                }
            

                )
            }
            </AnimatePresence>

            <MemoHome />
            <ContentMenu/>
        </div>
    );
}


function Home() {
    const style: CSSProperties & { [key: string]: string } = {
        // "--bg-wallpaper": "url(https://img.asmedia.epimg.net/resizer/v2/NZTAJMVYTVHDJMOWYTEK3KKE6U.webp?auth=058fa8d2b79580189b58fd9d21735ad0c0d746352ae3bbc18185b915535e01c3&width=1472&height=1104&smart=true)"
    }

    return (
        <main id="home"
            style={style}
            className="flex w-full p-2 h-full bg-black">
            <MemoBlock />
        </main>

    )
}


interface App{
    node:FileNode
    column?: number
    row?: number
}
// const APPs: App[] = [
//     {
//         name: "Whatsapp",
//         urlIcon: "https://cdn-icons-png.flaticon.com/512/733/733585.png"
//     },
//     {
//         name: "Chrome",
//         urlIcon: "https://cdn-icons-png.flaticon.com/512/732/732200.png"
//     },
//     {
//         name: "Netflix",
//         urlIcon: "https://cdn-icons-png.flaticon.com/512/870/870910.png"
//     },
//     {
//         name: "Spotify",
//         urlIcon: "https://cdn-icons-png.flaticon.com/512/174/174872.png"
//     },
//     {
//         name: "Amazon",
//         urlIcon: "https://cdn-icons-png.flaticon.com/512/732/732217.png"
//     },
//     {
//         name: "Youtube",
//         urlIcon: "https://cdn-icons-png.flaticon.com/512/1384/1384060.png"
//     },
//     {
//         "name": "Galeria",
//         "urlIcon": "https://static.vecteezy.com/system/resources/previews/042/712/634/non_2x/google-gallery-icon-logo-symbol-free-png.png"
//     },
//     {
//         name: "Procesos",
//         urlIcon: "https://cdn-icons-png.flaticon.com/512/10239/10239999.png"
//     },
//     {
//         name: "Camara",
//         urlIcon: "https://cdn-icons-png.flaticon.com/512/1373/1373061.png"

//     },
//     {
//         name: "Telefono",
//         urlIcon: "https://cdn.iconscout.com/icon/free/png-256/free-apple-phone-icon-download-in-svg-png-gif-file-formats--logo-call-apps-pack-user-interface-icons-493154.png?f=webp&w=256"
//     },
//     {
//         name: "Recorder",
//         urlIcon: "https://cdn-icons-png.flaticon.com/512/3817/3817556.png"
//     },

//     {
//         name: "FileExplorer",
//         urlIcon: "https://cdn-icons-png.flaticon.com/512/732/732223.png"
//     },
//     {
//         name: "BlockNotes",
//         urlIcon: FileNoteIcon
//     },
//     {
//         name:"vscode",
//         urlIcon:"https://cdn-icons-png.flaticon.com/512/732/732212.png"
//     }
// ]

type CreateFileState = {
    isCreating: boolean
    name: string
    type: "file" | "folder" | undefined
}


function Block() {
    // localstorage for block position
    // const [apps, setApps] = useState<App[]>((localStorage.getItem("apps") && JSON.parse(localStorage.getItem("apps") as string)) || APPs)
    const [apps, setApps] = useState<App[]>(()=>{
        const result = WebFileSys.getFromPath("/Desktop")
        if(result.ok && result.value.isDirectory){
            return result.value.children.map((node)=>({node}))
        }
        return []
    })
    const setContextMenu = useMovilStore((state) => state.setContextMenu)
    const createProcess = useMovilStore((state) => state.addProcess)
    const [ElementDrag, setElementDrag] = useState<HTMLElement | null>(null)
    const refElement = useRef<HTMLDivElement>(null)
    const [createFileState, setCreateFileState] = useState<CreateFileState>({
        isCreating: false,
        name: "",
        type: undefined,
      })

    function updateApps(){
        const result = WebFileSys.getFromPath("/Desktop")
        if(result.ok && result.value.isDirectory){
            setApps(result.value.children.map((node)=>({node}))
            )
        }
    }


    function handleActions(option: Option){
        const options: Record<OptionExplorer,()=>void> = {
            "new folder":()=>{
                setCreateFileState({ isCreating: true, name: "", type: "folder" });
                
            },
            "new file":()=>{
                setCreateFileState({ isCreating: true, name: "", type: "file" });
            },
            "paste":()=>{
                console.log("paste")
            },
        
        "open vscode":()=>{
                createProcess({name:"vscode",component:()=><></>,maximized:true,urlIcon:"https://cdn-icons-png.flaticon.com/512/732/732200.png",params:{
                    workfolder:"/Desktop",
                }})
            }
        
        }

        if(option in options){
            options[option as OptionExplorer]()
        }

    }





    useEffect(()=>{
        WebFileSys.suscribe(updateApps)
        refElement.current?.addEventListener("contextmenu",(e)=>{
            e.preventDefault()
            setContextMenu(e.clientX,e.clientY,true,"file",undefined,handleActions)
        }

        )

        refElement.current?.addEventListener("click",()=>{
            setContextMenu(0,0,false,"",undefined,()=>{})
        }
        )

        return ()=>{
            WebFileSys.desuscribe(updateApps)
            refElement.current?.removeEventListener("contextmenu",()=>{})
            refElement.current?.removeEventListener("click",()=>{})

        }
    },[])



















    const setAppsPosition = useCallback((appName: string, row: number, column: number) => {
        setApps((apps) => {
            const newApps = [...apps];
            const existingAppIndex = newApps.findIndex(app => app.row === row && app.column === column);
            const movingAppIndex = newApps.findIndex(app => app.node.name === appName);

            if (existingAppIndex !== -1) {
                // Swap positions
                const tempRow = newApps[existingAppIndex].row;
                const tempColumn = newApps[existingAppIndex].column;
                newApps[existingAppIndex].row = newApps[movingAppIndex].row;
                newApps[existingAppIndex].column = newApps[movingAppIndex].column;
                newApps[movingAppIndex].row = tempRow;
                newApps[movingAppIndex].column = tempColumn;
            } else {
                // Update position
                newApps[movingAppIndex] = { ...newApps[movingAppIndex], row, column };
            }

            localStorage.setItem("apps", JSON.stringify(newApps));
            return newApps;
        });
    }, []);




    const handleDragStart = useCallback((event: React.DragEvent<HTMLDivElement>) => {
        setElementDrag(event.currentTarget)
    }, []);


    useEffect(() => {
        if (ElementDrag) {
            setTimeout(() => {
                ElementDrag.style.display = "none"
            })

            const handleDragEnd = (event: DragEvent) => {
                const { clientX: x, clientY: y } = event;
                const [row, column] = getRowAndColumn(x, y, 98);

                // Ensure the app is within the screen bounds
                const maxRow = Math.floor(window.innerHeight / 98);
                const maxColumn = Math.floor(window.innerWidth / 98);
                const boundedRow = Math.min(Math.max(row, 1), maxRow);
                const boundedColumn = Math.min(Math.max(column, 1), maxColumn);

                ElementDrag.style.display = "flex";
                setAppsPosition(ElementDrag.textContent as string, boundedRow, boundedColumn);
                setElementDrag(null);
            };

            ElementDrag.addEventListener("dragend", handleDragEnd);

            return () => {
                ElementDrag.removeEventListener("dragend", handleDragEnd);
            };


        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ElementDrag])


    return <section className="grid grid-cols-[repeat(auto-fill,90px)] grid-rows-[repeat(auto-fill,90px)]  w-full gap-2 relative "
        ref={refElement}
    >
        {
            apps.map((app, index) => {
                return <MemoIconApp
                    setAppsPosition={setAppsPosition}
                    key={app.node.name} {...app} onDragStart={handleDragStart} index={index} />
            })

        
        }

        {
            createFileState.isCreating &&         <button className="p-0.5 w-full"      >
            <figure className="flex flex-col items-center gap-2  hover:bg-neutral-800 aspect-square h-min">
            <picture className="size-2/3">
            <img src={createFileState.type === "folder" ? Folder : FileNoteIcon}
            alt="file"   className="object-contain aspect-square"/>
            </picture>
            <input 
              type="text" 
              className="bg-transparent text-center focus:outline-none  text-wrap text-white"
              value={createFileState.name}
              onChange={(e) => setCreateFileState({ ...createFileState, name: e.target.value })}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
  
                  
  
                //   let _result;
                  const fs = WebFileSys;
                  if (createFileState.type === "folder") {
                      fs.mkdir("/Desktop", createFileState.name);
                  } else {
                      fs.touch("/Desktop", createFileState.name);
                  }
  
                    setCreateFileState({ isCreating: false, name: "" , type: undefined});
                }
              }}
              autoFocus
            />
        </figure>
        </button>
        }
    </section>
}


interface IconAppProps extends App {
    onDragStart: (event: React.DragEvent<HTMLDivElement>) => void
    setAppsPosition: (appName: string, row: number, column: number) => void
    index?: number
}

const Icons  :  {[key:string]:string} = {
    "html":FileHtmlIcon,
    "txt":FileNoteIcon,
}



function IconApp(props: IconAppProps) {
    const setPage = useMovilStore((state) => state.changePage)
    const setIconPosition = useMovilStore((state) => state.setIconAppCoordinates)
    const addProcess = useMovilStore((state) => state.addProcess)
    const setContextMenu = useMovilStore((state) => state.setContextMenu)
    const { row, column } = props;
    const ref = useRef<HTMLDivElement>(null)


    useEffect(() => {
        if (column !== undefined || row !== undefined) return;
        const timeoutId = setTimeout(() => {
            if (ref.current) {
                // console.log("xd")
                const { x, y } = ref.current.getBoundingClientRect();
                const [newRow, newColumn] = getRowAndColumn(x, y, 98);
                props.setAppsPosition(props.node.name, newRow, newColumn);
            }
        }, 100);

        return () => clearTimeout(timeoutId);
    }, [ref, column, row, props]);


    const style = column !== undefined && row !== undefined ? { gridColumnStart: `${column}`, gridRowStart: `${row}` } : {};

    const handleClick = useCallback(() => {
        if (ref.current) {
            const { x, y } = ref.current.getBoundingClientRect();
            setIconPosition(x, y)
        }
        if(props.node.isDirectory){
            // open file explorer
            addProcess({ name: "FileExplorer", urlIcon: "https://cdn-icons-png.flaticon.com/512/732/732223.png", component: () => null, maximized: true ,params:{
                folder:`/Desktop/${props.node.name}`,
            }})
            return
        }

        if(props.node.contentType == "app"){
            addProcess({ name: props.node.name, urlIcon: props.node.content as string, component: () => null, maximized: true })
            return
        }
        // if is html use, vscode, if is txt use blocknotes
        const defaultOpen =  props.node.name.includes(".") ? props.node.name.split(".").pop() : "txt"
        
        if(defaultOpen == "html"){
            const vscode = WebFileSys.getFromPath("/Desktop/vscode")
            if(vscode.ok && !vscode.value.isDirectory){
                addProcess({ name: "vscode", urlIcon: vscode.value.content as string, component: () => null, maximized: true,params:`/Desktop/${props.node.name}` })
                return
            }
        }

        if(defaultOpen == "txt"){
            addProcess({ name: "BlockNotes", urlIcon: FileNoteIcon, component: () => null, maximized: true,params:`/Desktop/${props.node.name}` })
            return
        }




    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [addProcess, props.node.name, setIconPosition, setPage])


    function handleActions(option:Option){
        const options: Record<OptionFile,()=>void> = {
            "delete": () => {
                WebFileSys.rm(`/Desktop/${props.node.name}`)
            },
            "open chrome": () => {

                if (!props.node.isDirectory) {

                    addProcess({ name: "Viewer", component: () => null, maximized: true, urlIcon: "https://cdn-icons-png.flaticon.com/512/732/732200.png", params: props.node.content })
                }
            },
            cut: function (): void {
                throw new Error("Function not implemented.")
            },
            copy: function (): void {
                throw new Error("Function not implemented.")
            }
        }

        options[option as OptionFile]()
    }




    const ext = props.node.name.includes(".") ? props.node.name.split(".").pop() : "txt"
    let icon =  props.node.isDirectory ? Folder :  Icons[ext || "txt"] || FileNoteIcon

    icon =   !props.node.isDirectory && props.node.contentType == "app" ? props.node.content as string : icon


    return <div
        ref={ref}
        onClick={handleClick}
        onContextMenu={(e)=>{
            e.preventDefault()
            setContextMenu(e.clientX,e.clientY,true,"file",props.node,handleActions)
        }}



        onDragStart={(event) => {
            //  console.log("drag", props.index)
            props.onDragStart(event)
        }
        } draggable="true"
        style={style}
        className={` w-[90px] aspect-square rounded flex flex-col items-center justify-center`}
    >
        <img src={icon} alt={props.node.name} className="w-2/3  object-contain " />
        <p className="text-center text-white">{props.node.name}</p>
    </div>
}
