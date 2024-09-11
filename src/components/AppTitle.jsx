import { useContext } from 'react';
import initialAppData from '../data/initialAppData.jsx';
import { AppDataContext } from '../context/AppContext.jsx';

function AppTitle({children}){

    const {setAppData} = useContext(AppDataContext)

    const handleResetData = () => setAppData(initialAppData)

    return (
        <div className='mt-title'>
                <h1>{children}</h1>
                <span>Fernando Vargas </span>
                <button
                    onClick={handleResetData}
                    className='mt-button-ResetData'
                >
                    Restablecer Datos
                </button>

            </div>
    )
}

export default AppTitle;