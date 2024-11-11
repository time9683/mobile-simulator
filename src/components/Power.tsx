import { useRef } from 'react';
import useMovilStore from '@stores/movil';
import powerIcon from '../assets/power.webp';
import whitePowerIcon from '../assets/whitePower.svg';
import Dialog from './Dialog';
import Button from './Button';

export default function Power() {
    const ref = useRef<HTMLDialogElement>(null);
    const  power = useMovilStore(state => state.power)
    const setPower = useMovilStore(state => state.setPower)

    if (!power) {
        return (
            <button onClick={() => setPower(true)}>
                <img src={powerIcon} width='20' alt='Power'/>
            </button>
        )
    }

    return (
        <>
            <button onClick={() => {
                ref.current?.showModal();
            }}>
                <img src={whitePowerIcon} width='20' alt='Power'/>
            </button>
            <Dialog someRef={ref}>
                <p> ¿Desea apagar el dispositivo? </p>
                <div className='flex justify-center'>
                    <Button onClick={() => ref.current?.close()}
                        className='bg-red-500 border-red-700 hover:bg-red-400 hover:border-red-500'
                    >
                        No
                    </Button>
                    <Button onClick={() => {
                            ref.current?.close()
                            setPower(false)
                        }}
                        className='bg-green-500 border-green-700 hover:bg-green-400 hover:border-green-500 ml-2'
                    >
                        Sí
                    </Button>
                </div>
            </Dialog>
        </>
    )
}
