import { memo, useEffect, useRef, useState } from "react";
import {Square,X,Minus} from 'lucide-react'
import { motion, useDragControls } from "framer-motion";



interface WindowsProps {
    children?: React.ReactNode,
    appName : string,
    minimized?: boolean
    TogleMinimized : () => void
    remove: () => void
  }


function Windows({children,appName,minimized,TogleMinimized,remove}:WindowsProps) {
  const [position,setPosition] = useState({x:0,y:0})
  const [size,setSize] = useState({width:600,height:500})
  const [maximized,setMaximized] = useState(false)
  const refToolbar = useRef<HTMLDivElement>(null)
  const refWindow = useRef<HTMLDivElement>(null)
  const prevSize = useRef({width:600,height:500})
  const prevPosition = useRef({x:0,y:0})

  const dragsControls = useDragControls()
  const refResize = useRef<HTMLDivElement>(null)
  const refResizeRight = useRef<HTMLDivElement>(null)
  const [isResize,setIsResize] = useState(false)

  useEffect(()=>{
    if(minimized){
      savePrevState()
      setSize({width:0,height:0})
      setPosition({x:0,y:1000})
      setMaximized(false)
    }else{
      setSize(prevSize.current)
      setPosition(prevPosition.current)
    }
  }
  ,[minimized])
  


  function savePrevState(){
    prevSize.current = {
      width: size.width,
      height: size.height,
    };
    const {x,y} = refWindow.current?.getBoundingClientRect() || {x:0,y:0}

    prevPosition.current = {
      x,
      y
    };


  }






  useEffect(()=>{

    function mouseDownResize(e: MouseEvent, side: string) {
      const initX = e.clientX;
      const initY = e.clientY;
      const initWidth = size.width;
      const initHeight = size.height

      setIsResize(true)
      const handleMouseMove = (e: MouseEvent) => {
      // const deltaX = e.clientX - initX;
      // const deltaY = e.clientY - initY;

      if (side === "bottom") {
        setSize((prevSize) => ({
        width: prevSize.width,
        // calculate the height
        height: initHeight + e.clientY - initY - 1,
        }));
      } else if (side === "right") {
        setSize((prevSize) => ({
        width: initWidth + e.clientX - initX - 1,
        height: prevSize.height,
        }));

      }
      };

      const handleMouseUp = () => {
      setIsResize(false)
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      };

      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    const resizeElement = refResize.current;
    const resizeElementRight = refResizeRight.current;
    if (resizeElement && resizeElementRight) {
      resizeElement.addEventListener("mousedown", (e) => mouseDownResize(e, "bottom"));
      resizeElementRight.addEventListener("mousedown", (e) => mouseDownResize(e, "right"));
    }

   

    return ()=>{
      if (resizeElement && resizeElementRight) {
        resizeElement.removeEventListener("mousedown",(e) => mouseDownResize(e, "bottom"));
        resizeElementRight.removeEventListener("mousedown", (e) => mouseDownResize(e, "right"));
      }
    }



  },[size.width,size.height])

  const maxSize = () => {
    if (maximized) {
      setSize(prevSize.current);
      setPosition(prevPosition.current);
      setMaximized(false);
      return;
    }

    const parentSize = refWindow?.current?.parentElement?.parentElement?.getBoundingClientRect();
  
    if (!parentSize) return;
    console.log(parentSize)
    const {x,y} = refWindow?.current?.getBoundingClientRect() || {x:0,y:0}


    prevSize.current = {
      width:  size.width,
      height: size.height
    };

    prevPosition.current = {
      x ,
      y
    };

  

    setSize({
      width: parentSize.width,
      // the 40 is the height of the toolbar
      height: parentSize.height - 40,
    });

    setMaximized(true);
  };




  const animations ={
    opacity:1,scale:1,width:size.width,height:size.height,y:position.y,x:position.x,
  }



  // calculate transform to move to 0,0
  const calculateTransform = () => {
    if (!refWindow.current) return { x: 0, y: 0 };

    const rect = refWindow.current.getBoundingClientRect();
    const parentRect = refWindow.current.parentElement?.parentElement?.getBoundingClientRect();

    if (!parentRect) return { x: 0, y: 0 };

    const xTransform = -rect.left + parentRect.left;
    const yTransform = -rect.top + parentRect.top;

    return { x: xTransform, y: yTransform };
  };

  const { x: transformX, y: transformY } = calculateTransform();



  const trans =  maximized ? {transform:`translate(${transformX}px,${transformY}px)`,zIndex:1000} : {transform:"none"}
  const transition =   isResize ? {type: "spring", damping: 30, stiffness: 300,duration:0} : {
    type: "spring",
    damping: 30,
    stiffness: 300,
  }


  return <motion.div
    initial={{opacity:0,scale:0.5,width:0,height:0,top:0,left:0}}
    animate={animations}
    exit={{opacity:0,scale:0.5}}
    drag 
    dragControls={dragsControls}
    dragListener={false}
    transition={
      transition
    }



    // style={{
    //   width:`${size.width}px`,
    //   height:`${size.height}px`,
    // }}
  className={`
  select-none
  min-w-[300px] min-h-[300px] 
  ${maximized ? "z-20" : "z-10"}
   absolute  flex flex-col rounded
   `}>
    {/* toobar */}

    <section
  ref={refWindow}
    className="w-full h-full transition-transform"
    style={
      trans
    }
    >


    <header 
      ref={refToolbar}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onPointerDown={(event:any)=>dragsControls.start(event)}
    className="bg-neutral-800 h-10 flex justify-between items-center p-5">

      <h3 className="text-white text-sm font-bold">{appName}</h3>

      <div className="flex gap-2">
        <button
        onClick={TogleMinimized}
        className="flex items-center justify-center p-2 rounded  text-white/80
        hover:bg-neutral-700/80 transition
        ">
          <Minus size={20} />
        </button>
        <button className="flex items-center justify-center p-2 rounded text-white/80
        hover:bg-neutral-700/80 transition-colors
        "
        
        onClick={maxSize}
        >
          <Square size={20} />
        </button>
        <button 
        onClick={remove}
        className="flex items-center justify-center p-2 rounded  text-white/80
        hover:bg-red-500/80 transition-colors
        ">
          <X size={20} />
        </button>
      </div>

    </header>

    {/* content */}
    <div
    className="
      bg-white
      relative
      h-full
    ">

      
      {children}



    <div
      ref={refResize}
    className="absolute bottom-0 w-full h-3
    cursor-s-resize
    "></div>

<div
      ref={refResizeRight}
    className="absolute right-0 top-0 h-full w-3
    cursor-e-resize
    "></div>
    </div>


    </section>
  
  </motion.div>


}




export default memo(Windows)


// export function Browser(){
//   const iframeRef = useRef<HTMLIFrameElement>(null)


//   return <Windows appName="Browser">
//     <iframe 
    
//     onLoad={()=>{
//         iframeRef.current?.style.setProperty("position","relative")
//         iframeRef.current?.style.setProperty("left","0")
//     }}
//     ref={iframeRef}
//     src="https://www.google.com/webhp?igu=1" className="w-full h-full" />
//   </Windows>




// }


