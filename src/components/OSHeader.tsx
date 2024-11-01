import Network from './Network'
import Power from './Power'
import Time from './Time'

export default function OSHeader() {

    return (
        <header>
            {/* Time format comes from settings, not statically typed */}
            <Time format='12h'/>
            <p>VenecOS</p>
            <Network />
            <Power />
        </header>
    )
}

