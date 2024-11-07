import { create } from "zustand";
import {Socket} from 'socket.io-client'
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
	socket:Socket| null
	changePage: (newPage: string) => void,
	setInitTime: (time: number) => void,
	setIconAppCoordinates:  (x:number,y:number) => void
	setSocket:(socket:Socket) => void,
	EntryCallId:number|null,
	setEntryCallId:(number:number|null) => void
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
	socket:null,
	EntryCallId:null,
	setIconAppCoordinates:(x:number,y:number) => set(()=> ({IconAppCoordintes:{x,y}})),
	setNetworkStatus: (status: NetworkStatus) => set(() => ({ networkStatus: status })),
	changePage: (newPage: string) => set(() => ({ currentPage: newPage })),
	setInitTime: (time: number) => set(() => ({ initTime: time })),
	setSocket:(socket:Socket) => set(() => ({socket})),
	setEntryCallId:(EntryCallId:number|null) => set(()=> ({EntryCallId}))
}))
export default useMovilStore
