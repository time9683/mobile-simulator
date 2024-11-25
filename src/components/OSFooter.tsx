import Home from './Home.tsx'
import AppTabs from './AppTabs.tsx'


export default function OSFooter () {
    return (
        <footer className="bg-slate-50 flex pl-2 z-10 h-10 items-center">
            <Home />
            <AppTabs/>
        </footer>
    )
}