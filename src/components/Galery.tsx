import { useState } from "react"

export default function Galery() {
    const [currentImage, setCurrentImage] = useState<number|null>(null)


    if (currentImage !== null) {
      return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <img
          src={`https://placehold.co/600x600?text=${currentImage + 1}`}
          alt={`Photo ${currentImage + 1}`}
          className="w-3/4 h-3/4 object-cover"
          onClick={() => setCurrentImage(null)}
        />
        </div>
      )
      }



    return (
      <main className="w-full p-2 h-screen overflow-auto">
        <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-2">
          {Array.from({ length: 9 }).map((_, index) => (
            <div key={index} className="relative">
              <img
                src={`https://placehold.co/300x300?text=${index + 1}`}
                alt={`Photo ${index + 1}`}
                className="w-full h-full object-cover"
                onClick={() => setCurrentImage(index)}
              />
            </div>
          ))}
        </div>
      </main>
    )
}


