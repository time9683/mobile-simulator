import { create } from "zustand";


interface MovilState {
	currentPage: string,
	// calcule or from the local storage
	initTime: number,
	changePage: (newPage: string) => void,
	setInitTime: (time: number) => void
}



const useMovilStore = create<MovilState>((set) => ({
	currentPage: "home",
	initTime : Date.now(),
	changePage: (newPage: string) => set(() => ({ currentPage: newPage })),
	setInitTime: (time: number) => set(() => ({ initTime: time }))
}))
export default useMovilStore
