import Time from './Time'

function OSHeader() {

    return (
        <header>
            {/* Time format comes from settings, not statically typed */}
            <Time format='12h'/>
            <h1>OS Header</h1>
        </header>
    )
}

export default OSHeader