import { create } from "zustand";

type NetworkStatus = 'connected' | 'disconnected';

interface MovilState {
	currentPage: string,
	power: boolean,
	setPower: (power: boolean) => void,
	battery: number,
	setBattery: (battery: number) => void,
	networkStatus: NetworkStatus,
	setNetworkStatus: (status: NetworkStatus) => void,
	// calcule or from the local storage
	initTime: number,
	IconAppCoordintes : { x:number,y:number } | null
	changePage: (newPage: string) => void,
	setInitTime: (time: number) => void,
	setIconAppCoordinates:  (x:number,y:number) => void
}



const useMovilStore = create<MovilState>((set) => ({
	currentPage: "home",
	initTime : Date.now(),
	// TODO: power must be off by default in production
	power: true,
	setPower: (power: boolean) => set(() => ({ power })),
	battery: 100,
	setBattery: (battery: number) => set(() => ({ battery })),
	networkStatus: 'disconnected',
	IconAppCoordintes:null,
	setIconAppCoordinates:(x:number,y:number) => set(()=> ({IconAppCoordintes:{x,y}})),
	setNetworkStatus: (status: NetworkStatus) => set(() => ({ networkStatus: status })),
	changePage: (newPage: string) => set(() => ({ currentPage: newPage })),
	setInitTime: (time: number) => set(() => ({ initTime: time }))
}))
export default useMovilStore
