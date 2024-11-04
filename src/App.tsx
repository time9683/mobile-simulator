import { useEffect, useState, createContext } from 'react'
import useMovilStore from '@stores/movil'
import OSHeader from '@components/OSHeader'
import OSFooter from '@components/OSFooter'
import Page from '@components/page'
import Power from '@components/Power'

export interface SettingsContext {
  power: boolean,
  setPower: (power: boolean) => void
}
//en vez de utilizar el contexto,deberias utilizar la store de zustand
export const settingsContext = createContext<SettingsContext>({} as SettingsContext)

export default function App() {
  const setInitTime =  useMovilStore((state) => state.setInitTime)
  // TODO: power must be off by default in production
  const [power, setPower] = useState(true)

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
      <settingsContext.Provider value={{power, setPower}}>
        <div className='bg-slate-800 h-screen flex items-center justify-center'>
          <Power />
        </div>
      </settingsContext.Provider >
    )
  }

  return (
    <settingsContext.Provider value={{power, setPower}}>
      <div className="h-screen w-screen flex flex-col overflow-hidden">
        <OSHeader />
        {/* <p> filler</p> */}
        <Page />
        <OSFooter />
      </div>
    </settingsContext.Provider >
  )
}
