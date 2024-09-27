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

    // Recupera los metodos necesarios para la lógica del customHook del componente
    const { listDragStart, listDragEnd } = useList()

    // Función para ocultar la lista cuando se hace clic en el botón de ocultar
    const hideList = (event) => event.target.closest('.mt-list-container').classList.add('hideList');

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
                                className="mt-list-header" 
                                draggable // Habilita el arrastrar en el contenedor
                                onDragStart={(event) => listDragStart(event, index)} // Maneja el inicio del arrastre
                                onDragEnd={(event) => listDragEnd(event)} // Maneja el fin del arrastre
                            >
                                <ListTitle
                                    listName={list.name}
                                    listId={list.id}
                                />
                                {/* Botón eliminar la lista */}
                                <button
                                    onClick={hideList} // Maneja el clic en el botón para ocultar la lista
                                    className="mt-list-button-hideList"> 
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
