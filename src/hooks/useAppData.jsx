import { useEffect, useState } from 'react';

export function useAppData({initialAppData}){
    // Estado para almacenar los datos de la aplicación
    const [appData, setAppData] = useState(initialAppData);

    // Estado para manejar actualizaciones que deben reflejarse en el localStorage
    const [updateLocalStorage, setUpdateLocalStorage] = useState(false);

    // useEffect para cargar datos iniciales al montar el componente
    useEffect(() => {

        // Verificar si el localStorage tiene datos almacenados
        if (localStorage.getItem('appData') === null) {
            // Si no hay datos, se almacenan los datos por defecto
            localStorage.setItem('appData', JSON.stringify(initialAppData));
        } else {
            // Si hay datos en el localStorage, se cargan en el estado de la aplicación
            setAppData(JSON.parse(localStorage.getItem('appData')));
        }
    }, []);

    // useEffect para actualizar el localStorage cuando cambia appData
    useEffect(() => {
        if (updateLocalStorage) {
            // Actualiza el localStorage
            localStorage.setItem('appData', JSON.stringify(appData));
        } else {
            setUpdateLocalStorage(true)
        }
    }, [appData]);

    return {appData, setAppData}
}