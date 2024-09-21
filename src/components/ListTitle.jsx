import { useRef, useState, useContext } from "react";
import listCrud from "../reducers/listCrud.jsx";
import { AppDataContext } from '../context/AppContext.jsx';

//hooks
import { useVisibility } from '../hooks/useVisibility.jsx';
import { useInputValue } from '../hooks/useInputValue.jsx';

function ListTitle({ listName, listId }) {

    // Obtiene los datos de la aplicación y el setter de contexto para actualizar el estado global
    const { appData, setAppData } = useContext(AppDataContext);

    // customHook para controlar la visibilidad del campo de entrada del nombre de la lista
    const isVisibleInputListName = useVisibility({initialState: false})

    // customHook para controlar el valor del nombre de la lista que se está editando
    const inputValueListName = useInputValue({InitialValue: listName})

    // Referencia al campo de entrada para manipularlo directamente, como seleccionar el texto
    const listNameInputRef = useRef(null);

    // Función para manejar cambios en el campo de entrada
    const handleListNameInputChange = async (event) => {
        // Actualiza el estado con el nuevo valor del campo de entrada
        inputValueListName.onChange(event)

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
        if (!isVisibleInputListName.state) {
            await isVisibleInputListName.show(); // Muestra el campo de entrada
            listNameInputRef.current.select(); // Selecciona el contenido del campo de entrada para edición
        }
    }

    // Función para manejar eventos de teclado en el campo de entrada
    const handleKeyDownListNameInput = (event) => {
        if (event.key === 'Enter' || event.key === 'Escape') {
            isVisibleInputListName.hide(); // Oculta el campo de entrada si se presiona Enter o Escape
        }
    };

    return (
        <div className='mt-list-header-listName' onClick={toggleListNameInput}>
            <h3 className={isVisibleInputListName.state ? 'is-hidden': ''}>
                {listName}
            </h3>
            <textarea
                className={`mt-list-header-listName-input ${isVisibleInputListName.state ? '': 'is-hidden'}`} 
                onKeyDown={handleKeyDownListNameInput} // Maneja el evento de teclado
                onBlur={() => isVisibleInputListName.hide()} // Oculta el campo de entrada cuando se pierde el foco
                ref={listNameInputRef} 
                value={inputValueListName.value} 
                onChange={handleListNameInputChange} 
            ></textarea>
        </div>
    );
}

export default ListTitle;
