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

    // Estado para indetificar que item se esta arrastrando
    const [dragItemType, setDragItemType] = useState(null)

    // Estado local para manejar ítem de lista que se está arrastrando
    const [draggedListIndex, setDraggedListIndex] = useState(null);

    // Estado local para manejar ítem de tarea que se está arrastrando
    const [dragTaskData, setDragTaskData] = useState(undefined);
    const [draggedTask, setDraggedTask] = useState(false);
    const [activeGhostTask, setActiveGhostTask] = useState({ active: false, listId: null, isDropOtherList: false })
    const [draggedTaskIndex, setDraggedTaskIndex] = useState(null);

    return (
        <DragDataContext.Provider value={{
            draggedTaskIndex,
            setDraggedTaskIndex,
            dragTaskData,
            setDragTaskData,
            draggedTask,
            setDraggedTask,
            draggedListIndex,
            setDraggedListIndex,
            dragItemType,
            setDragItemType,
            activeGhostTask,
            setActiveGhostTask
        }}>
            {children}
        </DragDataContext.Provider>
    )
}

