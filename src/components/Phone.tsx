import { useState, useEffect, useCallback, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mic, Phone, PhoneOff, Volume2, Keyboard, Users, UserPlus} from 'lucide-react'
import Dial from '../assets/dial.wav'
import Dialog from './Dialog.tsx'
import {saveContact, getContacts, Contact} from "@/services/indexdb"
import useMovilStore from '@stores/movil.ts'
import SimplePeer from 'simple-peer'



export default function Component() {
  const setIdfrom = useMovilStore((state) => state.setEntryCallId)
  const idFrom = useMovilStore((state)=> state.EntryCallId)

  const [number, setNumber] = useState( idFrom?.toString() || '')
  const [inCall, setInCall] = useState(false)
  const [callDuration, setCallDuration] = useState(0)
  const [validated, setValidated] = useState(false)
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null)
  const [contacts, setContacts] = useState<Contact[]>([])
  const [newContactName, setNewContactName] = useState('')
  const contactsRef = useRef<HTMLDialogElement>(null);
  const addContactRef = useRef<HTMLDialogElement>(null);

  const remoteAudioRef = useRef<HTMLAudioElement>(null)
  const localAudioRef = useRef<HTMLAudioElement>(null)
  // const [peer, setPeer] = useState<SimplePeer.Instance | null>(null)
  const peer = useRef<SimplePeer.Instance | null>(null)

  const socket = useMovilStore((state) => state.socket)

  const createPeer = useCallback(async (number: string, initiator: boolean) => {
    if (!localAudioRef.current){
      console.error('localAudioRef.current is null')
      return
    }

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    if (!stream) {
      console.error('stream is null')
      return
    }

    const newPeer = new SimplePeer({
      stream: stream,
      initiator: initiator,
      trickle: true,
    });

    newPeer.on("signal", (signal) => {
      socket?.emit("signal", { targetId: number, signal });
    });

    newPeer.on("connect", () => {
      console.log('Peer connected');
      setValidated(true);
    });

    newPeer.on("stream", (stream) => {
      if (remoteAudioRef.current) {
        remoteAudioRef.current.srcObject = stream;
      } else {
        console.error('remoteAudioRef.current is null')
      }
    });

    newPeer.on("error", () => {
      console.log('Peer closed');
    });
    if(socket){
      socket.off('signal', handleSignal);
      socket.on('signal', handleSignal);
    }
     peer.current = newPeer;
  }, [socket]);

  const handleSocketEvents = useCallback(() => {
    if (socket) {
      console.log("creando eventos de socket")
      socket.on('rejectCall', handleRejectCall);
      socket.on("CancelCall", handleCancelCall);
      socket.on("acceptCall", handleAcceptCall);

      return () => {
        socket.off('rejectCall', handleRejectCall);
        socket.off('CancelCall', handleCancelCall);
        socket.off('acceptCall', handleAcceptCall);
        socket.off('signal', handleSignal);
        peer.current?.destroy();
      }
    }
  }, [socket, peer]);

  const handleRejectCall = () => {
    console.log('rejectCall event');
    setInCall(false);
    setValidated(false);
    setCallDuration(0);
    setIdfrom(null);
    peer.current?.destroy();
    peer.current = null;
  };

  const handleCancelCall = () => {
    console.log('CancelCall event');
    setInCall(false);
    setValidated(false);
    setIdfrom(null);
    setCallDuration(0);
    peer.current?.destroy();
    peer.current = null;
  };

  const handleAcceptCall = async () => {
    setValidated(true);
  };

  const handleSignal = ({ signal }:{signal:string}) => {
    console.log("socket signal event");
    if (peer.current) {
      console.log('signal event');
      peer.current.signal(signal);
    }
  };

  useEffect(() => {
    if (idFrom !== null && !peer.current ) {
      setNumber(idFrom.toString());
      const initiatePeer = async () => {
        console.log("creating peer from idFrom");
        await createPeer(idFrom.toString(), true);
        setValidated(true);
        setInCall(true);
      }
      initiatePeer();
    }
  }, [idFrom, createPeer]);

  useEffect(() => {
    handleSocketEvents();
  }, [handleSocketEvents]);

  useEffect(() => {
    setAudio(new Audio(Dial));
  }, []);

  const playDialSound = useCallback(() => {
    if (audio) {
      audio.currentTime = 0;
      audio.play();
    }
  }, [audio]);

  const addDigit = (digit: string) => {
    setNumber(prev => (prev + digit).slice(-20));
    playDialSound();
  };

  const deleteDigit = () => {
    setNumber(prev => prev.slice(0, -1));
  };

  const startCall = async () => {
    if (number.length > 0) {
      if (number === null) return;
      console.log("creating peer");
      await createPeer(number.toString(), false);
      setInCall(true);
      socket?.emit('call', { targetId: number });
    }
  };

  const endCall = () => {
    setInCall(false);
    setValidated(false);
    setCallDuration(0);
    peer.current?.destroy();
    peer.current = null;
    setIdfrom(null);
    socket?.emit('CancelCall', { targetId: number });
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (inCall && validated) {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [inCall, validated]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const dialPad = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['*', '0', '#']
  ];

  if (inCall) {
    return (
      <div className="flex flex-col items-center justify-between h-full bg-gray-100 p-6">
        <audio ref={remoteAudioRef} autoPlay />
        <audio ref={localAudioRef} autoPlay muted />
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
      <audio ref={remoteAudioRef} autoPlay />
      <audio ref={localAudioRef} autoPlay muted />
      <div className="text-4xl font-light mb-6 h-12 overflow-hidden">
        {number}
      </div>
      {(number.length > 0) ? 
        <Button
          variant="outline"
          size="sm"
          className="mt-4"
          onClick={() => addContactRef.current?.showModal()}
        >
          <UserPlus className="h-4 w-4 mr-2" />
          Añadir Contacto
        </Button>  : ''
      }

      <Dialog someRef={addContactRef}>
        <div className='flex justify-between'>
          <p className='font-bold'> Nuevo contacto </p>
          <button onClick={() => {addContactRef.current?.close()}}>
            <p className='font-light text-sm' > x </p>
          </button>
        </div>
        <div className="mt-4 space-y-4">
          <Input
            placeholder="Contact Name"
            value={newContactName}
            onChange={(e) => setNewContactName(e.target.value)}
          />
          <div>Número: {number}</div>
          <Button onClick={async () => {await saveContact({name: newContactName, number: number})}}>Añadir Contacto</Button>
        </div>
      </Dialog>
      
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
        <Button variant="ghost" size="lg" className="aspect-square" onClick={async () => {
          contactsRef.current?.showModal()
          setContacts(await getContacts())
          console.log(contacts)
        }}>
          <Users className="h-6 w-6" />
        </Button>
        <Dialog someRef={contactsRef}>
          <div className='flex justify-between min-w-40'>
            <p className='font-bold'> Contactos </p>
            <button onClick={() => {contactsRef.current?.close()}}>
              <p className='font-light text-sm' > x </p>
            </button>
          </div>
          <div className="mt-4 space-y-2">
            {contacts.map((contact, index) => (
              <div key={index} className="flex justify-between items-center" onClick={() => {
                setNumber(contact.number)
                startCall()
                contactsRef.current?.close()
              }}>
                <span>{contact.name}</span>
                <span>{contact.number}</span>
              </div>
            ))}
          </div>
        </Dialog>
      </div>
    </div>
  )
}