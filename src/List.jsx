import './styles/list.css'
import React, { useState, useRef } from 'react'
import listCrud from './listCrud.jsx'
import ListTitle from './ListTitle.jsx';
import Task from './Task.jsx';

function List(props) {

    // Estado local para manejar el índice del ítem que se está arrastrando
    const [draggedListIndex, setDraggedListIndex] = useState(null);

    // Función para ocultar la lista, llama a la función proporcionada a través de props
    const hideList = (event) => event.target.closest('.mt-list-container').classList.add('hidden');

    // Maneja el inicio del arrastre de una lista
    const handleListDragStart = (event, index) => {
        // Obtiene el elemento padre conainer de list
        let listContainer = event.target.closest('.mt-list-container')

        // Usa ese elemeto para crear la imagen arrastrable
        event.dataTransfer.setDragImage(listContainer, 120, 10)

        // Reduce la opacidad del elemento container de list
        listContainer.style.opacity = "0.08";
        console.log(index)
        // Actualiza el estado local con el índice de la lista arrastrada
        setDraggedListIndex(index);

        // Permite el movimiento
        event.dataTransfer.effectAllowed = 'move';
    };

    // Maneja el evento cuando el ítem arrastrado pasa sobre otro ítem
    const handleListDragOver = async (event, targetIndex) => {
        event.preventDefault(); // Necesario para permitir el drop

        // Si hay un ítem arrastrado y se está pasando sobre una lista diferente
        if (draggedListIndex !== null && targetIndex !== draggedListIndex) {
            let data = await listCrud({ type: 'MOVE_LIST', fromIndex: draggedListIndex, toIndex: targetIndex });
            props.initialHandleUpdateLocalStorage(data)
            // Actualiza el índice de la lista arrastrada
            setDraggedListIndex(targetIndex);
        }
    };
    const handleListDrop = (event) => {
        event.preventDefault(); // Necesario para permitir el drop

        // Restaura la opacidad del elemento container de list
        event.target.closest('.mt-list-container').style.opacity = "1";

        // Resetea el estado del ítem arrastrado
        setDraggedListIndex(null);
    }

    const handleListAnimationEnd = async (event, listId) => {
        // Despacha la acción de ocultar la lista si la animación es de ocultar
        if (event.animationName === 'list-fade-out') {
            let data = await listCrud({ type: 'TOGGLE_LIST_VISIBILITY', id: listId });
            props.initialHandleUpdateLocalStorage(data)
        }
    }


    return (
        <>
            {props.appData.lists.map((list, index) => (
                list.isVisible && (
                    <React.Fragment key={list.id}>
                    <article 
                        className='mt-list-container'
                        onAnimationEnd={(event) => handleListAnimationEnd(event, list.id)} // Maneja el fin de la animación
                    >
                        <header
                            className="mt-list-header" // Clase del contenedor principal
                            draggable // Habilita el arrastrar en el contenedor
                            onDragStart={(event) => handleListDragStart(event, index)} // Maneja el inicio del arrastre
                            onDragOver={(event) => handleListDragOver(event, index)} // Maneja el arrastre sobre el contenedor
                            onDrop={handleListDrop} // Maneja el evento de soltar
                            onDragEnd={handleListDrop} // Maneja el evento de fin del arrastre
                            onAnimationEnd={(event) => handleListAnimationEnd(event, list.id)} 
                        >
                            <ListTitle
                                listName={list.name}
                                listId={list.id}
                                initialHandleUpdateLocalStorage={props.initialHandleUpdateLocalStorage}
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
                            initialHandleUpdateLocalStorage={props.initialHandleUpdateLocalStorage}
                        />

                    </article>
                    </React.Fragment>
                )
                
            ))}
        </>
    )

}

export default List;