import '../styles/list.css'
import React, { useContext } from 'react'
import ListTitle from './ListTitle.jsx';
import Task from './Task.jsx';
import { AppDataContext, DragDataContext } from '../context/AppContext.jsx'
import ListCard from './ListCard.jsx';

function List() {

    // Accede al contexto de datos de la aplicación, que contiene la información de las listas
    const { appData } = useContext(AppDataContext);

    // Accede al contexto de datos de arrastre, que maneja el estado del ítem que se está arrastrando
    const { updateDragData } = useContext(DragDataContext);

    // Función para ocultar la lista cuando se hace clic en el botón de ocultar
    const hideList = (event) => event.target.closest('.mt-list-container').classList.add('hideList');

    // Maneja el inicio del arrastre de una lista
    const handleListDragStart = (event, index) => {

        updateDragData({
            draggedListIndex: index, // Actualiza el estado local con el índice de la lista arrastrada
            dragItemType: 'list' // Establece el tipo de ítem arrastrado como 'list'
        })

        // Obtiene el elemento padre contenedor de la lista
        let listContainer = event.target.closest('.mt-list-container');

        // Crea una imagen arrastrable para representar el ítem arrastrado en el cursor
        event.dataTransfer.setDragImage(listContainer, 120, 10);

        // Reduce la opacidad del contenedor de la lista durante el arrastre para dar retroalimentación visual
        listContainer.style.opacity = "0.08";
        
        // Permite el movimiento del elemento arrastrado
        event.dataTransfer.effectAllowed = 'move';
    };

    // Maneja el evento cuando se termina el arrastre
    const handleListDragEnd = (event) => {
        event.preventDefault(); // Necesario para permitir el drop

        // Restaura la opacidad del contenedor de la lista después del arrastre
        event.target.closest('.mt-list-container').style.opacity = "1";

        // Resetea el estado del ítem arrastrado
        updateDragData({
            draggedListIndex: null, // Actualiza el estado global con el índice de la lista arrastrada
            dragItemType: null
        })
    }

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
