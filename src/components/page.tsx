import useMovilStore from "@stores/movil.ts"
import { useEffect, useRef, useState } from "react"
import { getRowAndColumn } from "@/utils"

export default function Page() {
    const currentPage = useMovilStore((state) => state.currentPage)

    if (currentPage == "home") {
        return <Home />
    }


    if (currentPage == "chrome"){
        return <iframe src="https://www.google.com/webhp?igu=1" className="w-full h-full" />
    }

    if (currentPage == "netflix"){
        return <iframe src="https://fmovies2u.in/movies/" className="w-full h-full" />
    }

    if (currentPage == "spotify"){
        return <iframe src="https://honey-tyagi-spotify-clone.vercel.app/login/login.html" className="w-full h-full" />
    }

    if (currentPage == "amazon"){
        return <iframe src="https://www.mercadolibre.com.ve/" className="w-full h-full" />
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
    // component: React.FC
}
// whatsapp, facebook, instagram, twitter, youtube, tiktok, netflix, spotify, amazon, linkedin
const apps = [
    {
        name: "whatsapp",
        urlIcon: "https://cdn-icons-png.flaticon.com/512/733/733585.png"
    },
    {
        name: "facebook",
        urlIcon: "https://cdn-icons-png.flaticon.com/512/733/733547.png"
    },
    {
        name: "instagram",
        urlIcon: "https://cdn-icons-png.flaticon.com/512/733/733558.png"
    },
    {
        name: "twitter",
        urlIcon: "https://cdn-icons-png.flaticon.com/512/733/733579.png"
    },
    {
        name: "chrome",
        urlIcon: "https://cdn-icons-png.flaticon.com/512/732/732200.png"
    },
    {
        name: "tiktok",
        urlIcon: "https://cdn-icons-png.flaticon.com/512/3046/3046121.png"
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
        name: "linkedin",
        urlIcon: "https://cdn-icons-png.flaticon.com/512/733/733561.png"
    }


]

function Block() {
    const [ElementDrag, setElementDrag] = useState<HTMLElement | null>(null)
    // drag enter for manage the drop
    // const [ElementDrop, setElementDrop] = useState<HTMLElement | null>(null)

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
                console.log(row, column)
                ElementDrag.style.display = "flex";
                ElementDrag.style.gridColumnStart = `${column}`;
                ElementDrag.style.gridRowStart = `${row}`
                setElementDrag(null);

            })


        }
    }, [ElementDrag])


    return <section className="grid grid-cols-[repeat(auto-fill,90px)] grid-rows-[repeat(auto-fill,90px)]  w-full gap-2">
        {
            apps.map((app, index) => {
                return <IconApp key={app.name} {...app} onDragStart={handleDragStart} index={index} />
            })
           
        }
    </section>
}


interface IconAppProps extends App {
    onDragStart: (event: React.DragEvent<HTMLDivElement>) => void
    index?: number
}


function IconApp(props: IconAppProps) {
    const setPage = useMovilStore((state) => state.changePage)
    const ref = useRef<HTMLDivElement>(null)

    const [column, setColumn] = useState<number|null>(null);
    const [row, setRow] = useState<number|null>(null);

    // calculate the column and row start base in the position of the element
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (ref.current) {
                const { x, y } = ref.current.getBoundingClientRect();
                const [newRow, newColumn] = getRowAndColumn(x, y, 98);
                setRow(newRow);
                setColumn(newColumn);
            }
        }, 100);

        return () => clearTimeout(timeoutId);
    }, [ref]);


    const style = column !== null && row !== null ? { gridColumnStart: `${column}`, gridRowStart: `${row}` } : {};

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
