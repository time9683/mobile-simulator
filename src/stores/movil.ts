import { create } from "zustand";


interface MovilState {
	currentPage: string,
	changePage: (newPage: string) => void
}



const useMovilStore = create<MovilState>((set) => ({
	currentPage: "home",
	changePage: (newPage: string) => set(() => ({ currentPage: newPage }))
}))
export default useMovilStore
