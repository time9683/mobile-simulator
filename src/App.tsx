import { useEffect,useState } from 'react'
import useMovilStore from '@stores/movil'
import OSHeader from '@components/OSHeader'
import OSFooter from '@components/OSFooter'
import Page from '@components/page'
import Power from '@components/Power'
import EntryCall from '@components/Entrycall'


export default function App() {
  const [incomingCall, setIncomingCall] = useState(false)
  const setInitTime =  useMovilStore((state) => state.setInitTime)
  // TODO: power must be off by default in production
  const power = useMovilStore((state) => state.power)

  useEffect(() => {
    // verifica si ya se ha guardado el tiempo de inicio
    if (!localStorage.getItem('initTime')) {
      setInitTime(Date.now())
      localStorage.setItem('initTime', Date.now().toString())
    } else {
      setInitTime(Number(localStorage.getItem('initTime')))
    }
  })

  if (!power) {
    return (
        <div className='bg-slate-800 h-screen flex items-center justify-center'>
          <Power />
        </div>
    )
  }

  return (
      <div className="h-dvh w-screen flex flex-col overflow-hidden relative">
        <EntryCall IdFrom="Mako el estafador" isVisible={incomingCall} setIsVisible={setIncomingCall} />
        <OSHeader />
        {/* <p> filler</p> */}
        <Page />
        <OSFooter />
      </div>
  )
}
