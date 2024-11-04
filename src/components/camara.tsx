import useMovilStore from "@stores/movil"
import { useEffect, useRef, useState } from "react"
import {getImages, saveImage as saveDb} from "@services/indexdb"

export default function Camara() {
    const changePage =  useMovilStore((state) => state.changePage)
    const [image, setImage] = useState<string | null>(null)
    const videoRef = useRef<HTMLVideoElement>(null)
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        let streamRef: MediaStream | null = null

        async function setLatImage() {
            const images = await getImages()
            if (images) {
                setImage(images[images.length - 1])
            }
        }



        if (videoRef.current) {
            navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
                videoRef.current!.srcObject = stream
                streamRef = stream
            })
        }
        setLatImage()
       
        return () => {
            if (streamRef) {
                console.log("stop")
                streamRef.getTracks().forEach((track) => {
                    track.stop()
                })
            }
        }


    }, [])





    function saveImage() {
        if (canvasRef.current && videoRef.current) {
            const context = canvasRef.current.getContext("2d")
            canvasRef.current.width = videoRef.current.videoWidth
            canvasRef.current.height = videoRef.current.videoHeight
            context?.drawImage(videoRef.current, 0, 0)
            const data = canvasRef.current.toDataURL("image/png")
            // create blob url to preview image
            setImage(data)
            // save image
             saveDb(data)
        }
    }




    return <main className="grid grid-rows-[auto_1fr_auto] w-full max-h-screen h-full bg-black place-content-center">

        <div className="bg-black w-full h-20">

        </div>
        <video ref={videoRef} autoPlay={true} className="w-full object-cover h-full" />
        <div className="w-full h-[90px] bg-black flex justify-center items-center p-2 relative">

      {/* middle button white */}
      <button 
      onClick={()=> changePage('galeria')}
      className="
      bg-white rounded h-14 aspect-square absolute left-4">
        {/* show the image if is difent of null */}
        {image && <img src={image} className="w-full h-full object-cover" />}
      </button>
        <button onClick={saveImage}
        className="w-16 h-16 bg-white rounded-full"
        ></button>

        </div>
        <canvas ref={canvasRef} className="hidden"></canvas>
    </main>
}