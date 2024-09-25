import { AppDataContext } from '../context/AppContext.jsx';
import { useContext } from "react";
import listCrud from "../reducers/listCrud.jsx";

export function useListTitle({ listId}){

    // Obtiene los datos de la aplicación y el setter de contexto para actualizar el estado global
    const { appData, setAppData } = useContext(AppDataContext);

    // Función para manejar cambios en el campo de entrada
    const listNameInputChange = async (event, inputValueListName) => {
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
    const toggleListNameInput = async (isVisibleInputListName, listNameInputRef) => {
        if (!isVisibleInputListName.state) {
            await isVisibleInputListName.show(); // Muestra el campo de entrada
            listNameInputRef.current.select(); // Selecciona el contenido del campo de entrada para edición
        }
    }

    // Función para manejar eventos de teclado en el campo de entrada
    const keyDownListNameInput = (event, isVisibleInputListName) => {
        if (event.key === 'Enter' || event.key === 'Escape') {
            isVisibleInputListName.hide(); // Oculta el campo de entrada si se presiona Enter o Escape
        }
    };

    return {listNameInputChange, toggleListNameInput, keyDownListNameInput}
}