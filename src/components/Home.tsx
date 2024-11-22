import homeIcon from '../assets/dragon.png';
import useMovilStore from '@stores/movil';

export default function Home() {
    const changePage = useMovilStore((state) => state.changePage);
    
    return (
        <button className='m-1' onClick={() => {changePage('home')}}>
            <img src={homeIcon} alt="Home" width='30' />
        </button>
    )
}