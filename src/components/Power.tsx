import powerIcon from '../assets/power.webp';
import whitePowerIcon from '../assets/whitePower.svg';
import { useRef, useContext } from 'react';
import { SettingsContext } from '../App';
import Dialog from './Dialog';
import Button from './Button';



export default function Power() {
    const ref = useRef<HTMLDialogElement>(null);
    const power = useContext(settingsContext).power;

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
