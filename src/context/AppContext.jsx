// Contexto
import React, {  useState } from 'react';
import initialAppData from '../data/initialAppData.jsx';
import { useAppDataProvider } from '../hooks/useAppDataProvider.jsx';

export const AppDataContext = React.createContext();

export const DragDataContext = React.createContext();

export function AppDataProvider ({children}) {

    const {appData, setAppData} = useAppDataProvider({initialAppData})

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

