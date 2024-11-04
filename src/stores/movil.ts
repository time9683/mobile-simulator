import { create } from "zustand";


interface MovilState {
	currentPage: string,
	power: boolean,
	setPower: (power: boolean) => void,
	// calcule or from the local storage
	initTime: number,
	changePage: (newPage: string) => void,
	setInitTime: (time: number) => void
}



const useMovilStore = create<MovilState>((set) => ({
	currentPage: "home",
	initTime : Date.now(),
	// TODO: power must be off by default in production
	power: true,
	setPower: (power: boolean) => set(() => ({ power })),
	changePage: (newPage: string) => set(() => ({ currentPage: newPage })),
	setInitTime: (time: number) => set(() => ({ initTime: time }))
}))
export default useMovilStore
