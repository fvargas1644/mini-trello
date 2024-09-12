// Contexto
import React, { useEffect, useState } from 'react';
import initialAppData from '../data/initialAppData.jsx';

export const AppDataContext = React.createContext();

export const DragDataContext = React.createContext();

export function AppDataProvider ({children}) {

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

    return (
        <AppDataContext.Provider value={{ appData, setAppData }}>
            {children}
        </AppDataContext.Provider>
    )
}

export function DragDataProvider({children}){

    
    const [dragData, setDragData] = useState({
        draggedTaskIndex: null, 
        dragTaskData: undefined,
        draggedTask: false,
        draggedListIndex: null, // Estado global para manejar ítem de lista que se está arrastrando
        dragItemType: null, // Estado global para indetificar que item se esta arrastrando
        activeGhostTask: { // Estado global para manejar ítem de tarea que se está arrastrando
            active: false, 
            listId: null, 
            toListIndex: null,
        }

    })

    function updateDragData(updates){
        setDragData(previousData => ({...previousData, ...updates}))
    }

    return (
        <DragDataContext.Provider value={{
            dragData,
            updateDragData
        }}>
            {children}
        </DragDataContext.Provider>
    )
}

