import powerIcon from '../assets/power.webp';
import { useRef } from 'react';
import Dialog from './Dialog';
import Button from './Button';

// TODO:
// 1. Create app context for settings and general states
// 2. Add on/off functionality to the power button
export default function Power() {
    const ref = useRef<HTMLDialogElement>(null);

    return (
        <>
            <button onClick={() => {
                ref.current?.showModal();
            }}>
                <img src={powerIcon} width='20' alt='Power'/>
            </button>
            <Dialog someRef={ref}>
                <p> ¿Desea apagar el dispositivo? </p>
                <div>
                    <Button onClick={() => ref.current?.close()}
                        className='bg-blue-500 border-blue-700 hover:bg-blue-400 hover:border-blue-500'
                    >
                        Cancelar
                    </Button>
                    <Button onClick={() => {
                            ref.current?.close()
                        }}
                        className='bg-red-500 border-red-700 hover:bg-red-400 hover:border-red-500'
                    >
                        Apagar
                    </Button>
                </div>
            </Dialog>
        </>
    )
}
