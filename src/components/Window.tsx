import { memo, useEffect, useRef, useState } from "react";
import {Square,X,Minus} from 'lucide-react'



interface WindowsProps {
    children?: React.ReactNode,
    appName : string
  }





function Windows({children,appName}:WindowsProps) {
  const [position,setPosition] = useState({x:0,y:0})
  const [size,setSize] = useState({width:600,height:500})
  const [maximized,setMaximized] = useState(false)
  const refToolbar = useRef<HTMLDivElement>(null)
  const refWindow = useRef<HTMLDivElement>(null)
  const clickMouse =  useRef({x:0,y:0})
  const prevSize = useRef({width:0,height:0})
  const prevPosition = useRef({x:0,y:0})

  const refResize = useRef<HTMLDivElement>(null)

  useEffect(()=>{

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - clickMouse.current.x;
      const deltaY = e.clientY - clickMouse.current.y;


      setPosition((prev)=>{
        return {
              x: prev.x + deltaX,
          y: prev.y + deltaY
      }})
      clickMouse.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      // add windows transtion
      refWindow.current?.style.setProperty("transition","width 0.3s, height 0.3s, top 0.3s, left 0.3s")
    };

    const handleMouseDown = (event: Event) => {
      const e = event as MouseEvent;
      clickMouse.current = { x: e.clientX, y: e.clientY };
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      // remove windows transtion 
      refWindow.current?.style.setProperty("transition","none")     
    };


    const toolbarElement = refToolbar.current;
    if (toolbarElement) {
      toolbarElement.addEventListener("mousedown", handleMouseDown);
    }







    function mouseDownResize(e: MouseEvent) {
      const initX = e.clientX;
      const initY = e.clientY;
      const initWidth = size.width;
      const initHeight = size.height;


      // remove windows transtion
      refWindow.current?.style.setProperty("transition","none")

      const handleMouseMove = (e: MouseEvent) => {
        const deltaX = e.clientX - initX;
        const deltaY = e.clientY - initY;

        console.log(deltaX,deltaY);
        setSize({
          width: initWidth + deltaX - 1,
          height: initHeight + deltaY -2,
        });
      };

      const handleMouseUp = () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
        // add windows transtion
        refWindow.current?.style.setProperty("transition","width 0.3s, height 0.3s, top 0.3s, left 0.3s")
      };

      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    const resizeElement = refResize.current;
    if (resizeElement) {
      resizeElement.addEventListener("mousedown", mouseDownResize);
    }

   


    return () => {
      if (toolbarElement) {
        toolbarElement.removeEventListener("mousedown", handleMouseDown);
      }
    };



  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  const maxSize = () => {
    if (maximized) {
      setSize(prevSize.current);
      setPosition(prevPosition.current);
      setMaximized(false);
      return;
    }

    const parentSize = refWindow?.current?.parentElement?.getBoundingClientRect();
    if (!parentSize) return;

    prevSize.current = {
      width: size.width,
      height: size.height,
    };

    prevPosition.current = {
      x: position.x,
      y: position.y,
    };

    setSize({
      width: parentSize.width,
      height: parentSize.height,
    });

    setPosition({
      x: 0,
      y: 0,
    });

    setMaximized(true);
  };

  const minimize = () => {
    setSize({
      width: 0,
      height: 0,
    });

    setPosition({
      x: 0,
      y: 900,
    });
  }





  return <div 
    // use transform to improve performance
    ref={refWindow}
    style={{
      // transform:`translate(${position.x}px,${position.y}px)`,
      top:`${position.y}px`,
      left:`${position.x}px`,
      width:`${size.width}px`,
      height:`${size.height}px`,
      transition:"width 0.3s, height 0.3s, top 0.3s, left 0.3s"
    }}
  className="
  min-w-[300px] min-h-[300px]
  transition-transform duration-75 absolute left-0 top-0 right-0 flex flex-col overflow-hidden rounded">
    {/* toobar */}
    <header 
      ref={refToolbar}
    className="bg-neutral-800 h-10 flex justify-between items-center p-5">

      <h3 className="text-white text-sm font-bold">{appName}</h3>

      <div className="flex gap-2">
        <button
        onClick={minimize}
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
        <button className="flex items-center justify-center p-2 rounded  text-white/80
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
      w-full
      h-full
      relative
      left-0
    ">

      
      {children}



    </div>




    <div
      ref={refResize}
    className="absolute bottom-0 w-full h-2
    cursor-s-resize
    "></div>
  </div>


}



export default memo(Windows)


export function Browser(){
  const iframeRef = useRef<HTMLIFrameElement>(null)


  return <Windows appName="Browser">
    <iframe 
    
    onLoad={()=>{
        iframeRef.current?.style.setProperty("position","relative")
        iframeRef.current?.style.setProperty("left","0")
    }}
    ref={iframeRef}
    src="https://www.google.com/webhp?igu=1" className="w-full h-full" />
  </Windows>




}