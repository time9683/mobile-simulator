import useMovilStore from "@stores/movil"
import { useEffect, useRef } from "react"

export default function Camara() {
    const changePage =  useMovilStore((state) => state.changePage)
    const videoRef = useRef<HTMLVideoElement>(null)

    useEffect(() => {
        if (videoRef.current) {
            navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
                videoRef.current!.srcObject = stream
            })
        }
    }, [])

    return <main className="grid grid-rows-[auto_1fr_auto] w-full max-h-screen h-full bg-black place-content-center">

        <div className="bg-black w-full h-20">

        </div>
        <video ref={videoRef} autoPlay={true} className="w-full object-cover h-full" />
        <div className="w-full h-[90px] bg-black flex justify-center items-center p-2 relative">

      {/* middle button white */}
      <button 
      onClick={()=> changePage('galeria')}
      className="
      bg-white rounded h-14 aspect-square absolute left-4"></button>
        <button
        className="w-16 h-16 bg-white rounded-full"
        ></button>

        </div>
    </main>
}