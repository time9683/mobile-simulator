import OSHeader from './components/OSHeader'
import { useState, createContext } from 'react'

export interface SettingsContext {
  power: boolean,
  setPower: (power: boolean) => void
}

export const settingsContext = createContext<SettingsContext>({} as SettingsContext)

export default function App() {
  const [power, setPower] = useState(true)

  return (
    <settingsContext.Provider value={{power, setPower}}>
      <OSHeader />
      <p> filler</p>
    </settingsContext.Provider >
  )
}
