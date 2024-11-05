
const DB_NAME = 'movil';
// KEY FOR INDEXEDDB for images
export const KEY_IMAGES = 'images';
export const CONTACTS = 'contacts';

export interface Contact {
    name: string,
    number: string,
}


function openDB() {
    const rq = indexedDB.open(DB_NAME, 1)

    rq.onupgradeneeded = () => {
        const db = rq.result
        db.createObjectStore(KEY_IMAGES, { keyPath: 'id', autoIncrement: true })
        db.createObjectStore(CONTACTS, { keyPath: 'id', autoIncrement: true })
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

export function saveContact(contact: Contact) {
    const db = openDB()

    db.onsuccess = () => {
        const tx = db.result.transaction(CONTACTS, 'readwrite')
        const store = tx.objectStore(CONTACTS)
        store.add({contact})
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

export function getContacts(): Promise<Contact[]> {
    return new Promise((resolve) => {
        const db = openDB()

        db.onsuccess = () => {
            const tx = db.result.transaction(CONTACTS, 'readonly')
            const store = tx.objectStore(CONTACTS)
            const rq = store.getAll()
            rq.onsuccess = () => {
                resolve(rq.result.map((contact: Contact) => contact))
            }
        }
    })
}

