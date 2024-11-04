import useMovilStore from '@stores/movil'
import OSHeader from './components/OSHeader'
import Page from '@components/page'
import { useEffect } from 'react'
export default function App() {
  const setInitTime =  useMovilStore((state) => state.setInitTime)

  useEffect(() => {
    // verifica si ya se ha guardado el tiempo de inicio
    if (!localStorage.getItem('initTime')) {
      setInitTime(Date.now())
      localStorage.setItem('initTime', Date.now().toString())
    } else {
      setInitTime(Number(localStorage.getItem('initTime')))
    }
  })


  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden">
      <OSHeader />
      {/* <p> filler</p> */}
      <Page />
    </div>
  )
}
