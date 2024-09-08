import { useRef, useState, useContext } from "react";
import listCrud from "../reducers/listCrud.jsx";
import { AppDataContext } from '../context/AppContext.jsx';

function ListTitle({ listName, listId }) {

    // Obtiene los datos de la aplicación y el setter de contexto para actualizar el estado global
    const { appData, setAppData } = useContext(AppDataContext);

    // Estado que controla si el campo de entrada del nombre de la lista está visible o no
    const [listNameInputVisible, setListNameInputVisible] = useState(false);

    // Estado que maneja el valor del nombre de la lista que se está editando
    const [newListNameInputValue, setNewListNameInputValue] = useState(listName);

    // Referencia al campo de entrada para manipularlo directamente, como seleccionar el texto
    const listNameInputRef = useRef(null);

    // Determina las clases CSS para el campo de entrada basado en su visibilidad
    const listNameInputClassName = listNameInputVisible ? 'mt-list-header-listName-input' : 'mt-list-header-listName-input is-hidden';

    // Determina la clase CSS del título basado en la visibilidad del campo de entrada
    const listNameTitleClassName = listNameInputVisible ? 'is-hidden' : '';

    // Función para manejar cambios en el campo de entrada
    const handleListNameInputChange = async (event) => {
        // Actualiza el estado con el nuevo valor del campo de entrada
        setNewListNameInputValue(event.target.value);

        // Realiza una actualización en el contexto global a través de listCrud
        let data = await listCrud(appData, {
            type: 'CHANGE_LIST_NAME',
            id: listId,
            name: event.target.value
        });
        setAppData(data);
    };

    // Función para alternar la visibilidad del campo de entrada del nombre de la lista
    async function toggleListNameInput() {
        if (!listNameInputVisible) {
            await setListNameInputVisible(true); // Muestra el campo de entrada
            listNameInputRef.current.select(); // Selecciona el contenido del campo de entrada para edición
        }
    }

    // Función para manejar eventos de teclado en el campo de entrada
    const handleKeyDownListNameInput = (event) => {
        if (event.key === 'Enter' || event.key === 'Escape') {
            setListNameInputVisible(false); // Oculta el campo de entrada si se presiona Enter o Escape
        }
    };

    // Función para manejar el evento blur en el campo de entrada
    const handleListNameOnBlur = () => setListNameInputVisible(false);

    return (
        <div className='mt-list-header-listName' onClick={toggleListNameInput}>
            {/* Contenedor para el nombre de la lista */}
            <h3 className={listNameTitleClassName}>
                {listName}
            </h3>
            <textarea
                className={listNameInputClassName} // Clase del campo de entrada que cambia basado en su visibilidad
                onKeyDown={handleKeyDownListNameInput} // Maneja el evento de teclado
                onBlur={handleListNameOnBlur} // Oculta el campo de entrada cuando se pierde el foco
                ref={listNameInputRef} // Referencia al campo de entrada
                value={newListNameInputValue} // Valor actual del campo de entrada
                onChange={handleListNameInputChange} // Maneja el evento de cambio de valor en el campo de entrada
            ></textarea>
        </div>
    );
}

export default ListTitle;
