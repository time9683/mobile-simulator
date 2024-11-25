import homeIcon from '../assets/dragon.png';
import useMovilStore from '@stores/movil';

export default function Home() {
    const process = useMovilStore((state) => state.process);
    const maximizeProcess = useMovilStore((state) => state.maximizeProcess);
    
    return (
        // TODO: It ain't necessary to change the page to home if
        <button className='m-1' onClick={() => {
            process.forEach((p) => {
                maximizeProcess(p)
            })
            console.log(process)
        }}>
            <img src={homeIcon} alt="Home" width='30' />
        </button>
    )
}