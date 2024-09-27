import { useContext } from 'react';
import initialAppData from '../data/initialAppData.jsx';
import { AppDataContext } from '../context/AppContext.jsx';

function AppTitle({children}){

    // Contexto de la aplicación. Recupera los datos de la APP
    const {setAppData} = useContext(AppDataContext)

    const handleResetData = async () => {
        await setAppData(initialAppData) // Restaura los datos iniciales de la App
        window.location.reload(); // Recarga la página para resetear los estados
    }

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