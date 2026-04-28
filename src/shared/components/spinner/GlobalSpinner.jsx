import { useSelector } from 'react-redux';
import Spinner from './spinner';

const GlobalSpinner = () => {
    const spinners = useSelector((state) => state.system.spinners);
    
    if (spinners.length === 0) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-[99999] bg-black bg-opacity-50 flex items-center justify-center">
            <Spinner />
        </div>
    );
};

export default GlobalSpinner; 