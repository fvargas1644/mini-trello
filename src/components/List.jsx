import '../styles/list.css'
import React, { useContext } from 'react'
import ListTitle from './ListTitle.jsx';
import Task from './Task.jsx';
import { AppDataContext } from '../context/AppContext.jsx'
import ListCard from './ListCard.jsx';

// hooks para manejar la lógica del componente
import { useList } from '../hooks/useList.jsx';

function List() {

    // Accede al contexto de datos de la aplicación, que contiene la información de las listas
    const { appData } = useContext(AppDataContext);

    const { listDragStart, listDragEnd } = useList()

    // Función para ocultar la lista cuando se hace clic en el botón de ocultar
    const hideList = (event) => event.target.closest('.mt-list-container').classList.add('hideList');

    // Maneja el inicio del arrastre de una lista
    const handleListDragStart = (event, index) => listDragStart(event, index)

    // Maneja el evento cuando se termina el arrastre
    const handleListDragEnd = (event) => listDragEnd(event)

    return (
        <>
            {appData.lists.map((list, index) => (
                list.isVisible && (
                    <React.Fragment key={list.id}>
                        <ListCard
                            listId={list.id}
                            listIndex={index}
                            tasks={list.tasks}
                        >
                            <header
                                className="mt-list-header" // Clase del contenedor principal para la lista
                                draggable // Habilita el arrastrar en el contenedor
                                onDragStart={(event) => handleListDragStart(event, index)} // Maneja el inicio del arrastre
                                onDragEnd={handleListDragEnd} // Maneja el fin del arrastre
                            >
                                <ListTitle
                                    listName={list.name}
                                    listId={list.id}
                                />
                                <button
                                    onClick={hideList} // Maneja el clic en el botón para ocultar la lista
                                    className="mt-list-button-hideList"> {/* Clase del botón para ocultar */}
                                    X
                                </button>
                            </header>
                            <Task
                                tasks={list.tasks}
                                listId={list.id}
                                listIndex={index}
                            />
                        </ListCard>
                    </React.Fragment>
                )
            ))}
        </>
    )
}

export default List;
