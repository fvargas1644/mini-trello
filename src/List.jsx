import './styles/list.css'
import { useState, useRef } from 'react'
import listCrud from './listCrud.jsx'

function List(props){

    // Estado para manejar el valor del nombre de la lista que se está editando
    const [newListNameInputValue, setNewListNameInputValue] = useState(props.listName)

    // Estado para controlar si el campo de entrada del nombre de la lista está visible o no
    const [listNameInputVisible, setListNameInputVisible] = useState(false)

    // Referencia al campo de entrada para manipularlo directamente
    const listNameInputRef = useRef(null);

    // Determina las clases CSS del campo de entrada basado en su visibilidad
    const listNameInputClassName = listNameInputVisible ? 'mt-list-header-listName-input' : 'mt-list-header-listName-input is-hide'

    // Determina la clase CSS del título basado en la visibilidad del campo de entrada
    const listNameTitleClassName = listNameInputVisible ? 'is-hide' : ''

    // Estado local para manejar el índice del ítem que se está arrastrando
    const [draggedListIndex, setDraggedListIndex] = useState(null);

    // Función para alternar la visibilidad del campo de entrada del nombre de la lista
    async function toggleListNameInput() {
        if (listNameInputVisible === false) {
            await setListNameInputVisible(true) // Muestra el campo de entrada
            listNameInputRef.current.select() // Selecciona el contenido del campo de entrada
        }
    }

    // Función para manejar cambios en el campo de entrada, actualiza el estado y llama a la función proporcionada a través de props
    const handleListNameInputChange = (event) => {
        setNewListNameInputValue(event.target.value) // Actualiza el estado con el nuevo valor
        //props.initialHandleListNameInputChange(props.listId, event.target.value) // Llama a la función proporcionada para manejar el cambio
    }

    
    // Función para manejar eventos de teclado en el campo de entrada del nombre de la lista
    const handleKeyDownListNameInput = (event) => {
        if (event.key === 'Enter') {
            setListNameInputVisible(false) // Oculta el campo de entrada al presionar Enter
        }
    };

    // Función para manejar el evento blur en el campo de entrada, ocultando el campo de entrada
    const handleListNameOnBlur = () => setListNameInputVisible(false)

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

        console.log(targetIndex, draggedListIndex)

        // Si hay un ítem arrastrado y se está pasando sobre una lista diferente
        if (draggedListIndex !== null && targetIndex !== draggedListIndex) {
            console.log("Llegamos al if")
            let data = await listCrud({type: 'MOVE_LIST', fromIndex: draggedListIndex,toIndex: targetIndex});
            props.initialHandleUpdateLocalStorage(data)
            // Actualiza el índice de la lista arrastrada
            setDraggedListIndex(targetIndex);
        }
    };
    const handleListDrop = (event) => props.initialHandleListDrop(event)
    const handleListAnimationEnd = (event, listId) => props.initialHandleListAnimationEnd(event, listId)


    return(
        <article className='mt-list-container'>
            <header 
                className="mt-list-header" // Clase del contenedor principal
                draggable // Habilita el arrastrar en el contenedor
                onDragStart={(event) => handleListDragStart(event, props.listIndex)} // Maneja el inicio del arrastre
                onDragOver={(event) => handleListDragOver(event, props.listIndex)} // Maneja el arrastre sobre el contenedor
                //onDrop={handleListDrop} // Maneja el evento de soltar
                //onDragEnd={handleListDrop} // Maneja el evento de fin del arrastre
                //onAnimationEnd={(event) => handleListAnimationEnd(event, props.listId)} // Maneja el fin de la animación
            >
                    <div className='mt-list-header-listName' onClick={toggleListNameInput}> {/* Contenedor para el nombre de la lista */}
                        <h3 className={listNameTitleClassName}>{props.listName}</h3> {/* Título de la lista */}
                        <textarea 
                            className={listNameInputClassName} // Clase del campo de entrada
                            onKeyDown={handleKeyDownListNameInput} // Maneja el evento de teclado
                            onBlur={handleListNameOnBlur} // Maneja el evento de pérdida de foco
                            ref={listNameInputRef} // Referencia al campo de entrada
                            value={newListNameInputValue} // Valor del campo de entrada
                            onChange={handleListNameInputChange} // Maneja el evento de cambio
                        ></textarea>
                    </div>
                    <button 
                        onClick={hideList} // Maneja el clic en el botón para ocultar la lista
                        className="mt-list-button-hideList"> {/* Clase del botón para ocultar */}
                        X
                    </button>
            </header>

        </article>

    )

}

export default List;