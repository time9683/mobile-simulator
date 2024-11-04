
const DB_NAME = 'movil';
// KEY FOR INDEXEDDB for images
export const KEY_IMAGES = 'images';




function openDB() {
    const rq = indexedDB.open(DB_NAME, 1)

    rq.onupgradeneeded = () => {
        const db = rq.result
        db.createObjectStore(KEY_IMAGES, { keyPath: 'id', autoIncrement: true })
    }

    return rq

    
}



export function  saveImage(image: string) {
    const db = openDB()

        db.onsuccess = () => {
        const tx = db.result.transaction(KEY_IMAGES, 'readwrite')
        const store = tx.objectStore(KEY_IMAGES)
        store.add({ image })
        }
}

export  function getImages(): Promise<string[]> {
    return new Promise((resolve) => {
        const db = openDB()
            db.onsuccess = () => {
                const tx = db.result.transaction(KEY_IMAGES, 'readonly')
                const store = tx.objectStore(KEY_IMAGES)
                const rq = store.getAll()
                rq.onsuccess = () => {
                    resolve(rq.result.map((item: {image:string}) => item.image))
                }
            }
    })
}

