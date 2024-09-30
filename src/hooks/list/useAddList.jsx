import { useContext } from 'react';
import listCrud from '../../reducers/listCrud.jsx'; 
import { AppDataContext } from '../../context/AppContext.jsx';

export function useAddList({}){

    // Desestructuración del contexto para obtener y actualizar los datos de la aplicación
    const { appData, setAppData } = useContext(AppDataContext);

    // Función para manejar la adición de una nueva lista
    const addList = async (inputValueAddList) => {
        // Verifica que el input no esté vacío antes de agregar la lista
        if (inputValueAddList.value !== '') {
            // Llama a la función listCrud para crear una nueva lista y obtiene los datos actualizados
            let data = await listCrud(appData, { type: 'CREATE_LIST', newListName: inputValueAddList.value });

            // Limpia el valor del input después de agregar la lista
            await inputValueAddList.resetValue();

            // Actualiza el estado global de la aplicación con los datos actualizados
            setAppData(data);
        }
    };

    return {addList}
}