import useMovilStore from "@stores/movil.ts"
import { useEffect, useRef, useState } from "react"
import { getRowAndColumn } from "@/utils"
import Galery from "@components/Galery"
import ProcessList from "@components/ProcessList"
import Camara from "@components/camara"
import Phone from "@components/Phone"

export default function Page() {
    const currentPage = useMovilStore((state) => state.currentPage)

    switch (currentPage) {
        case "home":
            return <Home />;
        case "chrome":
            return <iframe src="https://www.google.com/webhp?igu=1" className="w-full h-full" />;
        case "netflix":
            return <iframe src="https://fmovies2u.in/movies/" className="w-full h-full" />;
        case "spotify":
            return <iframe src="https://honey-tyagi-spotify-clone.vercel.app/login/login.html" className="w-full h-full" />;
        case "amazon":
            return <iframe src="https://www.mercadolibre.com.ve/" className="w-full h-full" />;
        case "youtube":
            return <iframe src="https://www.dailymotion.com/co" className="w-full h-full" />;
        case "galeria":
            return <Galery />;
        case "procesos":
            return <ProcessList />;
        case "camara":
            return <Camara />;
        case "telefono":
            return <Phone />;
    }

    return <Home />
}


function Home() {


    return (
        <main id="home" className="flex w-full p-2 h-screen">
            <Block />
            {/* <Block /> */}
        </main>

    )
}


interface App {
    name: string
    urlIcon: string
    column?: number 
    row?: number 
    // component: React.FC
}
// whatsapp, facebook, instagram, twitter, youtube, tiktok, netflix, spotify, amazon, linkedin
const APPs: App[] = [
    {
        name: "whatsapp",
        urlIcon: "https://cdn-icons-png.flaticon.com/512/733/733585.png"
    },
    {
        name: "chrome",
        urlIcon: "https://cdn-icons-png.flaticon.com/512/732/732200.png"
    },
    {
        name: "netflix",
        urlIcon: "https://cdn-icons-png.flaticon.com/512/870/870910.png"
    },
    {
        name: "spotify",
        urlIcon: "https://cdn-icons-png.flaticon.com/512/174/174872.png"
    },
    {
        name: "amazon",
        urlIcon: "https://cdn-icons-png.flaticon.com/512/732/732217.png"
    },
    {
        name: "youtube",
        urlIcon: "https://cdn-icons-png.flaticon.com/512/1384/1384060.png"
    },
    {
        "name":"galeria",
        "urlIcon":"https://static.vecteezy.com/system/resources/previews/042/712/634/non_2x/google-gallery-icon-logo-symbol-free-png.png"
    },
    {
        name:"procesos",
        urlIcon:"https://cdn-icons-png.flaticon.com/512/10239/10239999.png"
    },
    {
        name: "camara",
        urlIcon: "https://cdn-icons-png.flaticon.com/512/1373/1373061.png"
        
    },
    {
        name: "telefono",
        urlIcon: "https://cdn.iconscout.com/icon/free/png-256/free-apple-phone-icon-download-in-svg-png-gif-file-formats--logo-call-apps-pack-user-interface-icons-493154.png?f=webp&w=256"
    }
]


function Block() {
    // localstorage for block position
    // const [apps, setApps] = useState<App[]>((localStorage.getItem("apps") && JSON.parse(localStorage.getItem("apps") as string)) || APPs)
    const [apps, setApps] = useState<App[]>(APPs)

    const [ElementDrag, setElementDrag] = useState<HTMLElement | null>(null)
    // drag enter for manage the drop
    // const [ElementDrop, setElementDrop] = useState<HTMLElement | null>(null)
    function setAppsPosition(appName: string, row: number, column: number) {
        setApps((apps) => {
            const newApps = [...apps];
            const existingAppIndex = newApps.findIndex(app => app.row === row && app.column === column);
            const movingAppIndex = newApps.findIndex(app => app.name === appName);

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
    }




    function handleDragStart(event: React.DragEvent<HTMLDivElement>) {
        setElementDrag(event.currentTarget)
    }


    useEffect(() => {
        if (ElementDrag) {
            setTimeout(()=>{

                ElementDrag.style.display = "none"
            })


            ElementDrag.addEventListener("dragend", (event) => {
                
                const { clientX: x, clientY: y } = event as DragEvent;
                const [row, column] = getRowAndColumn(x, y, 98);
                // console.log(row, column)
                ElementDrag.style.display = "flex";
                setAppsPosition(ElementDrag.textContent as string, row, column);
                setElementDrag(null);
            })


        }
    }, [ElementDrag])


    return <section className="grid grid-cols-[repeat(auto-fill,90px)] grid-rows-[repeat(auto-fill,90px)]  w-full gap-2">
        {
            apps.map((app, index) => {
                return <IconApp 
                setAppsPosition={setAppsPosition}
                key={app.name} {...app} onDragStart={handleDragStart} index={index} />
            })
           
        }
    </section>
}


interface IconAppProps extends App {
    onDragStart: (event: React.DragEvent<HTMLDivElement>) => void
    setAppsPosition: (appName: string, row: number, column: number) => void
    index?: number
}


function IconApp(props: IconAppProps) {
    const setPage = useMovilStore((state) => state.changePage)
    const { row, column } = props;
    const ref = useRef<HTMLDivElement>(null)


    useEffect(() => {
        // console.log(column,row)
        // if column and row are  not null or undefined, then set the position of the app
        if (column !== undefined || row !== undefined) return;
        const timeoutId = setTimeout(() => {
            if (ref.current) {
                // console.log("xd")
                const { x, y } = ref.current.getBoundingClientRect();
                const [newRow, newColumn] = getRowAndColumn(x, y, 98);
                props.setAppsPosition(props.name, newRow, newColumn);
            }
        }, 100);

        return () => clearTimeout(timeoutId);
    }, [ref,column,row,props]);


    const style = column !== undefined && row !== undefined ? { gridColumnStart: `${column}`, gridRowStart: `${row}` } : {};

    return <div
    ref={ref}
    onClick={() => {
        setPage(props.name)
    }}



    onDragStart={(event)=>{
        console.log("drag",props.index)
        props.onDragStart(event)
    }
    }  draggable="true"
    style={style}    
    className={` w-[90px] aspect-square rounded flex flex-col items-center justify-center`}
    >
        <img src={props.urlIcon} alt={props.name} className="w-full  object-contain" />
        <p className="text-center text-white">{props.name}</p>
    </div>
}
