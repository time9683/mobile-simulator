import { useEffect, useState } from 'react';
import useMovilStore from '@stores/movil';


// Appending the navigator.battery interface (Thanks again TS!)
interface NavigatorBatteryManager extends Navigator {
    getBattery(): Promise<BatteryManager>
}

interface BatteryManager extends EventTarget {
    readonly charging: boolean,
    readonly chargingTime: number,
    readonly dischargingTime: number,
    readonly level: number,
    readonly onchargingchange: EventListener,
    readonly onchargingtimechange: EventListener,
    readonly ondischargingtimechange: EventListener,
    readonly onlevelchange: EventListener
}


export default function Battery() {
    const { battery, setBattery } = useMovilStore()
    const [color, setColor] = useState('#000000')

    useEffect(() => {
        const interval = setInterval(() => {
            (navigator as NavigatorBatteryManager).getBattery().then(batteryManager => {
                setBattery(Math.round(batteryManager.level * 100))
                
                if (batteryManager.level < 0.15) {
                    setColor('#ff004d')
                }
                else {
                    setColor('#000000')
                }
            })
        }, 1000)
        return () => clearInterval(interval)
    }, [])

    return (
        <div className='pl-2 pr-1 flex items-center'>
            <div className='flex items-center my-0.5 px-0.5 border-[0.09rem] border-slate-900 rounded-e rounded-s h-3/4'>
                <svg id="#1f6e43ff" width="30" height='12.5' className='rounded-sm'>
                    <rect width={`${battery}%`} height="100%" fill={color}/>
                </svg>
            </div>
            <svg id="#1f6e43ff" width="2.5" height='10' className='rounded-e-sm'>
                    <rect width='100%' height="100%" fill='#000000'/>
            </svg>
            <p className='font-thin text-xs pl-1'>{battery}%</p>
        </div>
    )
}