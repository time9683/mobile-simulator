import { useEffect,useState } from 'react'
import useMovilStore from '@stores/movil'
import OSHeader from '@components/OSHeader'
import OSFooter from '@components/OSFooter'
import Page from '@components/page'
import Power from '@components/Power'
import EntryCall from '@components/Entrycall'
import { io } from 'socket.io-client'
// get url from vite env
const url =  import.meta.env.VITE_SOCKET_URL as string

export default function App() {
  const [incomingCall, setIncomingCall] = useState(false)
  const setInitTime =  useMovilStore((state) => state.setInitTime)
  // TODO: power must be off by default in production
  const power = useMovilStore((state) => state.power)
  const setSocket = useMovilStore((state) => state.setSocket)
  const socket = useMovilStore((state) => state.socket)
  const [idFrom, setIdFrom] = useState('')

  useEffect(()=>{
    const socketInstace = io(url,{
      transports:['websocket','polling']
    })
    setSocket(socketInstace)

    const number = prompt("ingrese el numero del dispositivo a simular")
    // const randomNumber = Math.floor(Math.random() * 1000)
    socketInstace.emit("register",{userId:number})
    return () => {
      socketInstace.disconnect()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  useEffect(()=>{
    if(socket){
      socket.on('incomingCall',({from})=>{
        console.log("incoming call")
        setIdFrom(from)
        setIncomingCall(true)
      })

      // the person cancel the call incoming
      socket.on('CancelCall',()=>{
        console.log("call canceled")
        setIncomingCall(false)
      }
    )
    }
  },[socket])




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
        <EntryCall IdFrom={idFrom} isVisible={incomingCall} setIsVisible={setIncomingCall} />
        <OSHeader />
        {/* <p> filler</p> */}
        <Page />
        <OSFooter />
      </div>
  )
}
