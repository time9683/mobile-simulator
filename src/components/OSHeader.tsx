import Battery from './Battery'
import Network from './Network'
import Power from './Power'
import Time from './Time'

export default function OSHeader() {

    return (
        <header className='bg-slate-950 text-slate-50 w-screen flex justify-between px-2 z-10'>
            {/* Time format comes from settings, not statically typed */}
            <Time />
            <p className='text-slate-50 font-medium pointer-events-none'>MariOS</p>
            <div className='min-w-12 justify-between flex'>
                <Network />
                <Battery />
                <Power />
            </div>
            
        </header>
    )
}

