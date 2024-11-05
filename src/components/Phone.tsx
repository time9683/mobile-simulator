import { useState, useEffect, useCallback } from 'react'
import { Button } from "@/components/ui/button"
import { Mic, Hash, Phone, PhoneOff, Volume2, Keyboard } from 'lucide-react'
import Dial from '../assets/dial.wav'

export default function Component() {
  const [number, setNumber] = useState('')
  const [inCall, setInCall] = useState(false)
  const [callDuration, setCallDuration] = useState(0)
  const [validated, setValidated] = useState(false)
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null)

  useEffect(() => {
    setAudio(new Audio(Dial))
  }, [])

  const playDialSound = useCallback(() => {
    if (audio) {
      audio.currentTime = 0
      audio.play()
    }
  }, [audio])

  const addDigit = (digit: string) => {
    setNumber(prev => (prev + digit).slice(-20))
    playDialSound()
  }

  const deleteDigit = () => {
    setNumber(prev => prev.slice(0, -1))
  }

  const startCall = () => {
    setInCall(true)
    // Simulating call validation after 3 seconds
    setTimeout(() => setValidated(true), 3000)
  }

  const endCall = () => {
    setInCall(false)
    setValidated(false)
    setCallDuration(0)
  }

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (inCall && validated) {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [inCall, validated])

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const dialPad = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['*', '0', '#']
  ]

  if (inCall) {
    return (
      <div className="flex flex-col items-center justify-between h-full bg-gray-100 p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">{number}</h2>
          <p className="text-lg">
            {validated ? `${formatDuration(callDuration)}` : 'Calling...'}
          </p>
        </div>
        <div className="grid grid-cols-3 gap-4 w-full max-w-xs">
          <Button variant="ghost" size="lg" className="aspect-square">
            <Mic className="h-6 w-6" />
          </Button>
          <Button variant="ghost" size="lg" className="aspect-square">
            <Keyboard className="h-6 w-6" />
          </Button>
          <Button variant="ghost" size="lg" className="aspect-square">
            <Volume2 className="h-6 w-6" />
          </Button>
        </div>
        <Button 
          variant="destructive" 
          size="lg" 
          className="rounded-full aspect-square"
          onClick={endCall}
        >
          <PhoneOff className="h-6 w-6" />
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-between h-full bg-gray-100 p-6">
      <div className="text-4xl font-light mb-6 h-12 overflow-hidden">
        {number}
      </div>
      <div className="grid grid-cols-3 gap-4 w-full max-w-xs">
        {dialPad.map((row, rowIndex) => (
          row.map((digit, colIndex) => (
            <Button
              key={`${rowIndex}-${colIndex}`}
              variant="ghost"
              size="lg"
              className="aspect-square text-2xl font-light"
              onClick={() => addDigit(digit)}
            >
              {digit}
            </Button>
          ))
        ))}
        <Button
          variant="ghost"
          size="lg"
          className="aspect-square text-lg font-light"
          onClick={deleteDigit}
        >
          Delete
        </Button>
        <Button
          variant="ghost"
          size="lg"
          className="aspect-square bg-green-500 hover:bg-green-600 text-white rounded-full"
          onClick={startCall}
        >
          <Phone className="h-6 w-6" />
        </Button>
      </div>
    </div>
  )
}