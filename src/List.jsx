import './styles/list.css'
import React, { useState, useContext } from 'react'
import listCrud from './listCrud.jsx'
import ListTitle from './ListTitle.jsx';
import Task from './Task.jsx';
import { AppDataContext, DragDataContext } from './AppContext.jsx'
import ListCard from './ListCard.jsx';

function List(props) {

    const { appData } = useContext(AppDataContext);

    // Estado local para manejar el índice del ítem que se está arrastrando
    const { setDraggedListIndex, setDragItemType } = useContext(DragDataContext);

    // Función para ocultar la lista, llama a la función proporcionada a través de props
    const hideList = (event) => event.target.closest('.mt-list-container').classList.add('hidden');

    // Maneja el inicio del arrastre de una lista
    const handleListDragStart = (event, index) => {
        setDragItemType('list')
        // Obtiene el elemento padre conainer de list
        let listContainer = event.target.closest('.mt-list-container')

        // Usa ese elemeto para crear la imagen arrastrable
        event.dataTransfer.setDragImage(listContainer, 120, 10)

        // Reduce la opacidad del elemento container de list
        listContainer.style.opacity = "0.08";

        // Actualiza el estado local con el índice de la lista arrastrada
        setDraggedListIndex(index);

        // Permite el movimiento
        event.dataTransfer.effectAllowed = 'move';
    };


    const handleListDragEnd = (event) => {
        //console.log("Auí")
        console.log("R")
        event.preventDefault(); // Necesario para permitir el drop

        // Restaura la opacidad del elemento container de list
        event.target.closest('.mt-list-container').style.opacity = "1";

        // Resetea el estado del ítem arrastrado
        setDraggedListIndex(null);
        //setDragItemType(null)
    }

    const iniHanDragEndTask = ()=> {
        console.log("Termina")
    }

    return (
        <>
            {appData.lists.map((list, index) => (
                list.isVisible && (
                    <React.Fragment key={list.id}>
                        <ListCard
                            listId={list.id}
                            listIndex={index}
                        >
                            <header
                                className="mt-list-header" // Clase del contenedor principal
                                draggable // Habilita el arrastrar en el contenedor
                                onDragStart={(event) => handleListDragStart(event, index)} // Maneja el inicio del arrastre
                                //onDragOver={(event) => handleListDragOver(event, index)} // Maneja el arrastre sobre el contenedor
                                //onDrop={handleListDrop} // Maneja el evento de soltar
                                onDragEnd={handleListDragEnd} // Maneja el evento de fin del arrastre
                                //onAnimationEnd={(event) => handleListAnimationEnd(event, list.id)}
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
                                iniHanDragEndTask={iniHanDragEndTask}
                            />

                        </ListCard>

                    </React.Fragment>
                )

            ))}
        </>
    )

}

export default List;