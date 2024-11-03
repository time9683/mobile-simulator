import { useEffect, useState } from "react"
import { Trash,CircleCheckBig } from "lucide-react"
import { useLongPress } from "use-long-press"
import { getImages } from "@/services/indexdb"
const IMAGES = [
  "https://placehold.co/300x300?text=1",
  "https://placehold.co/300x300?text=2",
  "https://placehold.co/300x300?text=3",
  "https://placehold.co/300x300?text=4",
  "https://placehold.co/300x300?text=5",
  "https://placehold.co/300x300?text=6",
  "https://placehold.co/300x300?text=7",
  "https://placehold.co/300x300?text=8",
  "https://placehold.co/300x300?text=9",
]


export default function Galery() {
    // const [clickTime, setClickTime] = useState<number>(0)
    const [images, setImages] = useState(IMAGES)
    const [selectedImages, setSelectedImages] = useState<string[]>([])
    const [currentImage, setCurrentImage] = useState<number|null>(null)
    const bind = useLongPress((_,meta)=>{
      if (!selectedImages.includes(meta.context as string)){
      setSelectedImages((prev)=>[...prev,meta.context as string])
      }
    },{
      onCancel:(_,meta)=>{
        // if image is already selected, remove it
        if (selectedImages.includes(meta.context as string)){
        setSelectedImages((prev)=>prev.filter((image)=>image!==meta.context))
        }else{
            setCurrentImage(images.indexOf(meta.context as string))
        }
      }
    })

    useEffect(()=>{
      async function updateImages(){
        const images = getImages()
        if (images){
          const data = await images
          console.log(data.length)
          setImages((prev)=>{
            const newImages = data.filter((image)=>!prev.includes(image))
            return [...prev,...newImages]
          })
        }
      }

      updateImages()

    },[])



    if (currentImage !== null) {
      return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <img
          src={images[currentImage]}
          alt={`Photo ${currentImage + 1}`}
          className="object-cover aspect-[9/16] "
          onClick={() => setCurrentImage(null)}
        />
        </div>
      )
      }

      function onDrop(event: React.DragEvent<HTMLDivElement>) {
        event.preventDefault()
        const files = event.dataTransfer.files
        const images = Array.from(files).filter((file) => file.type.startsWith("image/"))
        const urls = images.map((image) => URL.createObjectURL(image))
        setImages((prev) => [...prev, ...urls])
      }



    



    return (
      <main className="w-full p-2 h-screen overflow-auto" onDrop={onDrop} 
      onDragOver={(event)=>event.preventDefault()}

      >
        <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,261.578px))] gap-2">
          {
            images.map((image, index) => (
              <div className="relative aspect-square" key={image}>
                <img
                  draggable="false"
                  src={image}
                  alt={`Photo ${index + 1}`}
                  className={`w-full object-contain aspect-square`}
                 
                  {...bind(image)}     
                />

                {
                  selectedImages.includes(image) && (
                    <div className="absolute bottom-2 right-2">
                      <CircleCheckBig size={24} color="#146eff" />
                    </div>
                  )
                }

              </div>
            ))

          }
  

        </div>
        {
          selectedImages.length > 0 && (
            <div className="fixed bottom-0 left-0 right-0 bg-gray-900 p-2 flex justify-between items-center">
              <p className="text-white">{selectedImages.length} selected</p>
              <button
                onClick={() => {
                  setImages((prev) => prev.filter((image) => !selectedImages.includes(image)))
                  setSelectedImages([])
                }}
                className="text-white"
              >
                <Trash size={24} />
              </button>
            </div>
          )
        }
      </main>
    )
}


