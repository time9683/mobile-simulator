import Network from './Network'
import Power from './Power'
import Time from './Time'

export default function OSHeader() {

    return (
        <header className='bg-slate-50 w-screen flex justify-between px-2'>
            {/* Time format comes from settings, not statically typed */}
            <Time />
            <p className='font-medium'>VenecOS</p>
            <div className='min-w-12 justify-between flex'>
                <Network />
                <Power />
            </div>
            
        </header>
    )
}

