import { useRef, useState, useContext } from "react";
import listCrud from "./listCrud";
import {AppDataContext} from './AppContext.jsx'


function ListTitle({listName, listId}) {

    const { appData, setAppData } = useContext(AppDataContext);
    // Estado para controlar si el campo de entrada del nombre de la lista está visible o no
    const [listNameInputVisible, setListNameInputVisible] = useState(false)

    // Estado para manejar el valor del nombre de la lista que se está editando
    const [newListNameInputValue, setNewListNameInputValue] = useState(listName)

    // Referencia al campo de entrada para manipularlo directamente
    const listNameInputRef = useRef(listName);

    // Determina las clases CSS del campo de entrada basado en su visibilidad
    const listNameInputClassName = listNameInputVisible ? 'mt-list-header-listName-input' : 'mt-list-header-listName-input is-hidden'

    // Determina la clase CSS del título basado en la visibilidad del campo de entrada
    const listNameTitleClassName = listNameInputVisible ? 'is-hidden' : ''


    // Función para manejar cambios en el campo de entrada, actualiza el estado y llama a la función proporcionada a través de props
    const handleListNameInputChange = async (event) => {
        setNewListNameInputValue(event.target.value) // Actualiza el estado con el nuevo valor
        let data = await listCrud(appData, ({ type: 'CHANGE_LIST_NAME', id: listId, name: event.target.value})) // Llama a la función proporcionada para manejar el cambio
        setAppData(data)
    }

    // Función para alternar la visibilidad del campo de entrada del nombre de la lista
    async function toggleListNameInput() {
        if (listNameInputVisible === false) {
            await setListNameInputVisible(true) // Muestra el campo de entrada
            listNameInputRef.current.select() // Selecciona el contenido del campo de entrada
        }
    }

    // Función para manejar eventos de teclado en el campo de entrada del nombre de la lista
    const handleKeyDownListNameInput = (event) => {
        if (event.key === 'Enter') {
            setListNameInputVisible(false) // Oculta el campo de entrada al presionar Enter
        }
    };

    // Función para manejar el evento blur en el campo de entrada, ocultando el campo de entrada
    const handleListNameOnBlur = () => setListNameInputVisible(false)

    return (
        <div className='mt-list-header-listName' onClick={toggleListNameInput}> {/* Contenedor para el nombre de la lista */}
            <h3 className={listNameTitleClassName}>{listName}</h3> {/* Título de la lista */}
            <textarea
                className={listNameInputClassName} // Clase del campo de entrada
                onKeyDown={handleKeyDownListNameInput} // Maneja el evento de teclado
                onBlur={handleListNameOnBlur} // Maneja el evento de pérdida de foco
                ref={listNameInputRef} // Referencia al campo de entrada
                value={newListNameInputValue} // Valor del campo de entrada
                onChange={handleListNameInputChange} // Maneja el evento de cambio
            ></textarea>
        </div>
    )
}

export default ListTitle;