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

    // Estado para manejar la bandera de actualización del localStorage
    const [updateLocalStorage, setUpdateLocalStorage] = useState(false);

    // Estado para identificar el tipo de ítem que se está arrastrando (tarea o lista)
    const [dragItemType, setDragItemType] = useState(null);

    // Estado local para manejar el índice de la lista que se está arrastrando
    const [draggedListIndex, setDraggedListIndex] = useState(null);
    
    // Estado local para manejar los datos de la tarea que se está arrastrando
    const [dragTaskData, setDragTaskData] = useState(undefined);
    // Estado para verificar si se está arrastrando una tarea
    const [draggedTask, setDraggedTask] = useState(false);
    // Estado para manejar el estado del "fantasma" de la tarea durante el arrastre
    const [activeGhostTask, setActiveGhostTask] = useState({active: false, listId: null, isDropOtherList: false});
    // Estado para manejar el índice de la tarea que se está arrastrando
    const [draggedTaskIndex, setDraggedTaskIndex] = useState(null);

    // useEffect para cargar datos iniciales al montar el componente
    useEffect(() => {
        // Verificar si hay datos almacenados en el localStorage
        if (localStorage.getItem('appData') === null) {
            // Si no hay datos, almacenar los datos iniciales en el localStorage
            localStorage.setItem('appData', JSON.stringify(initialAppData));
        } else {
            // Si hay datos, cargarlos en el estado de la aplicación
            setAppData(JSON.parse(localStorage.getItem('appData')));
        }
    }, []);

    // useEffect para actualizar el localStorage cuando cambia appData
    useEffect(() => {
        if (updateLocalStorage) {
            // Actualizar el localStorage con los datos actuales de appData
            localStorage.setItem('appData', JSON.stringify(appData));
        } else {
            // Si no se debe actualizar el localStorage aún, activar la bandera
            setUpdateLocalStorage(true);
        }
    }, [appData]);

    return (
        <>

            <section className='mt-list-section'>
                {/* Contexto de la aplicación para proporcionar appData y setAppData */}
                <AppDataContext.Provider value={{ appData, setAppData }}>
                    {/* Contexto para manejar el arrastre y la manipulación de tareas y listas */}
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
                        {/* Renderizar el componente que muestra las listas */}
                        <List />
                        {/* Renderizar el componente para añadir nuevas listas */}
                        <AddList />
                    </DragDataContext.Provider>
                </AppDataContext.Provider>
            </section>
        </>
    );
}

export default App;
