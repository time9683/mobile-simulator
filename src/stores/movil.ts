import { create } from "zustand";
import {Socket} from 'socket.io-client'
type NetworkStatus = 'connected' | 'disconnected';
import { FileNode } from "@/services/files";
import { Option } from "@components/ContextMenu";

interface MinimalProcess {
	name: string
	urlIcon: string
	component: React.FC
	maximized: boolean
	params?: unknown
}


export interface Process  extends MinimalProcess{
	pid: number
	user: string
	priority: number
	cpu: number
	memory: number
	time: string
}




interface MovilState {
	openFiles: FileNode[],
	ContextMenu:{
		x:number,
		y:number,
	visible:boolean,
	 context:string,
	 file:FileNode|undefined
	 actionHandler:(option:Option) => void
	}
	setContextMenu:(x:number,y:number,visible:boolean,context:string,file:FileNode|undefined,actionHandler:(option:Option) => void) => void
	OpenFile: (file:FileNode) => void
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
	socket:Socket| null,
	process: Process[],
	addProcess: (process: MinimalProcess) => void,
	removeProcess: (process: Process) => void,
	maximizeProcess: (process: Process) => void,
	UpdateAllProcesses: (process: Process[]) => void,
	changePage: (newPage: string) => void,
	setInitTime: (time: number) => void,
	setIconAppCoordinates:  (x:number,y:number) => void
	setSocket:(socket:Socket) => void,
	EntryCallId:number|null,
	setEntryCallId:(number:number|null) => void
}



const useMovilStore = create<MovilState>((set) => ({
	currentPage: "home",
	ContextMenu:{
		x:0,
		y:0,
		visible:false,
		context:"",
		file:undefined,
		actionHandler:()=>{},
	},
	setContextMenu:(x:number,y:number,visible:boolean,context:string,file:FileNode|undefined,actionHandler:(option:Option) => void) => set(() => ({ContextMenu:{x,y,visible,context,file,actionHandler}})),
	initTime : Date.now(),
	openFiles:[],
	process: [],
	addProcess: (process: MinimalProcess) => set((state) => {
		// if (state.process.some((p) => p.name === process.name)) {
		// 	return state;
		// }

		// add the rest of the elements to the process
		const newProcess: Process = {
			...process,
			pid: state.process.length + 2,
			user: "time",
			priority: 20,
			cpu: 0,
			memory: 0,
			time: "0:00.00",
		};
		
		return { process: [...state.process, newProcess] };
	}),
	removeProcess: (process: Process) => set((state) => ({ process: state.process.filter((p) => p.pid !== process.pid) })),
	UpdateAllProcesses: (process: Process[]) => set(() => ({ process })),
	// TODO: power must be off by default in production
	power: true,
	setPower: (power: boolean) => set(() => ({ power })),
	battery: 100,
	setBattery: (battery: number) => set(() => ({ battery })),
	networkStatus: 'disconnected',
	IconAppCoordintes:null,
	socket:null,
	EntryCallId:null,
	maximizeProcess: (process: Process) => set((state) => ({
		process: state.process.map((p) => {
			if (p.pid === process.pid) {
				return { ...p, maximized: !p.maximized };
			}
			return p;
		}),
	})),
	setIconAppCoordinates:(x:number,y:number) => set(()=> ({IconAppCoordintes:{x,y}})),
	setNetworkStatus: (status: NetworkStatus) => set(() => ({ networkStatus: status })),
	changePage: (newPage: string) => set(() => ({ currentPage: newPage })),
	setInitTime: (time: number) => set(() => ({ initTime: time })),
	setSocket:(socket:Socket) => set(() => ({socket})),
	setEntryCallId:(EntryCallId:number|null) => set(()=> ({EntryCallId})),
	OpenFile: (file:FileNode) =>  set((state) => ({openFiles:[...state.openFiles,file]}))
}))
export default useMovilStore
