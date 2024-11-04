import { useRef, useEffect, useState } from 'react';
import Dialog from './Dialog';
import cellularIcon from '../assets/cellular.webp';
import noNetworkIcon from '../assets/noNetwork.webp';
import wifiIcon from '../assets/wifi.webp';
import useMovilStore from '@stores/movil';

// Appending the navigator.connection interface (Thanks TS!)
interface NavigatorNetworkInformation extends Navigator{
  readonly connection?: NetworkInformation
}

type Megabit = number
type Millisecond = number
type EffectiveConnectionType = '2g' | '3g' | '4g' | 'slow-2g'

interface NetworkInformation extends EventTarget {
  readonly effectiveType?: EffectiveConnectionType
  readonly downlink?: Megabit
  readonly rtt?: Millisecond
  readonly saveData?: boolean
  onchange?: EventListener
}

type NetworkType = 'wifi' | 'cellular';

export default function Network() {
    const { networkStatus, setNetworkStatus } = useMovilStore()

    const ref = useRef<HTMLDialogElement>(null);

    // Network type is hardcoded for now, as the API ain't implemented in browsers yet
    const type: NetworkType = 'wifi';
    let icon, statusMsg, effectiveType = '';

    // If there's a connection, then show the appropriate icon
    if (networkStatus === 'connected') {
        if (type === 'wifi') {
            icon = wifiIcon
            statusMsg = 'Conectado a la red Wi-Fi'
        } else {
            icon = cellularIcon
            effectiveType = (navigator as NavigatorNetworkInformation).connection?.effectiveType ?? ''
            statusMsg = `Conectado a la red celular ${effectiveType}`
        }
    } else {
        icon = noNetworkIcon
        statusMsg = 'Sin conexión'
    }

    // Figure out the network status and update it every second
    useEffect(() => {
        const interval = setInterval(() => {
            // If there's no rtt, then there's no connection
            setNetworkStatus((navigator as NavigatorNetworkInformation).connection?.rtt === 0 ? 'disconnected' : 'connected')
        }, 1000)
        return () => clearInterval(interval);
    }, [])

    return (
        <>
            <button onClick={() => {
                ref.current?.showModal();
            }}>
                <img src={icon} width='20' alt='Network'/>
            </button>
            <Dialog someRef={ref} onClick={() => ref.current?.close()}>
                <p> {statusMsg} </p>
            </Dialog>
        </>
    )
}