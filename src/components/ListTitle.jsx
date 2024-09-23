import { useRef, useState, useContext } from "react";
import listCrud from "../reducers/listCrud.jsx";
import { AppDataContext } from '../context/AppContext.jsx';

//hooks
import { useVisibility } from '../hooks/useVisibility.jsx';
import { useInputValue } from '../hooks/useInputValue.jsx';

import { useListTitle } from '../hooks/useListTitle.jsx';

function ListTitle({ listName, listId }) {

    const {listNameInputChange, toggleListNameInput, keyDownListNameInput} = useListTitle()

    // customHook para controlar la visibilidad del campo de entrada del nombre de la lista
    const isVisibleInputListName = useVisibility({initialState: false})

    // customHook para controlar el valor del nombre de la lista que se está editando
    const inputValueListName = useInputValue({InitialValue: listName})

    // Referencia al campo de entrada para manipularlo directamente, como seleccionar el texto
    const listNameInputRef = useRef(null);

    return (
        <div
            onClick={() => toggleListNameInput(isVisibleInputListName, listNameInputRef)} 
            className='mt-list-header-listName'
        >
            <h3 className={isVisibleInputListName.state ? 'is-hidden': ''}>
                {listName}
            </h3>
            <textarea
                className={`mt-list-header-listName-input ${isVisibleInputListName.state ? '': 'is-hidden'}`} 
                onKeyDown={(event) => keyDownListNameInput(event, isVisibleInputListName)} // Maneja el evento de teclado
                onBlur={() => isVisibleInputListName.hide()} // Oculta el campo de entrada cuando se pierde el foco
                ref={listNameInputRef} 
                value={inputValueListName.value} 
                onChange={(event) => listNameInputChange(event, listId, inputValueListName)} 
            ></textarea>
        </div>
    );
}

export default ListTitle;
