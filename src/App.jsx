import React, { useEffect, useState } from 'react';
import initialAppData from './data/initialAppData.jsx';
import List from './List.jsx';
import AddList from './AddList.jsx';
import './styles/App.css';
import { AppDataContext, DragDataContext } from './AppContext.jsx';

// Componente principal de la aplicación
function App() {

    // Estado para almacenar los datos de la aplicación
    const [appData, setAppData] = useState(initialAppData);

    // Estado para manejar actualizaciones que deben reflejarse en el localStorage
    const [updateLocalStorage, setUpdateLocalStorage] = useState(false);

    // Estado para indetificar que item se esta arrastrando
    const [dragItemType, setDragItemType] = useState(null)

    // Estado local para manejar ítem de lista que se está arrastrando
    const [draggedListIndex, setDraggedListIndex] = useState(null);
    
    // Estado local para manejar ítem de tarea que se está arrastrando
    const [dragTaskData, setDragTaskData] = useState(undefined);
    const [draggedTask, setDraggedTask] = useState(false);
    const [activeGhostTask, setActiveGhostTask] = useState({active: false, listId: null, isDropOtherList: false, toListIndex: null})
    const [draggedTaskIndex, setDraggedTaskIndex] = useState(null);


    // useEffect para cargar datos iniciales al montar el componente
    useEffect(() => {

        // Verificar si el localStorage tiene datos almacenados
        if (localStorage.getItem('appData') === null) {
            // Si no hay datos, se almacenan los datos por defecto
            localStorage.setItem('appData', JSON.stringify(initialAppData));
        } else {
            // Si hay datos en el localStorage, se cargan en el estado de la aplicación
            setAppData(initialAppData);
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
        <>

            <section className='mt-list-section'>
                { /* Contexto de la APP*/}
                <AppDataContext.Provider value={{ appData, setAppData }}>
                    { /* Contexto de las funciones de arrastre en las tareas*/}

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
                        {/* Renderizar el componente las Listas */}
                        <List />
                        {/* Renderizar el componente AddList para añadir nuevas listas */}
                        <AddList />
                    </DragDataContext.Provider>
                </AppDataContext.Provider>
            </section>
        </>
    );
}

export default App;
