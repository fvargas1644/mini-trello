import '../styles/App.css';
import { useContext } from 'react';
import listCrud from '../reducers/listCrud.jsx'; 
import { AppDataContext } from '../context/AppContext.jsx';
import '../styles/AddList.css'; 

//hooks
import { useVisibility } from '../hooks/useVisibility.jsx';
import { useInputValue } from '../hooks/useInputValue.jsx';


function AddList() {
    // Desestructuración del contexto para obtener y actualizar los datos de la aplicación
    const { appData, setAppData } = useContext(AppDataContext);

    // customHook para controlar la visibilidad de la sección de agregar lista
    const {isVisible, show, hide} = useVisibility(false)

    // customHook para controlar el valor del input que agrega una lista
    const {newInputValue, change, resetInput} = useInputValue({})

    // Clases CSS dinámicas basadas en el estado de visibilidad de la sección de agregar lista
    const addListContainerClassName = isVisible ? 'mt-addList-container is-add' : 'mt-addList-container';
    const newListButtonClassName = isVisible ? 'mt-newList-button' : 'mt-newList-button is-add';


    // Función para manejar la adición de una nueva lista
    const handleAddList = async () => {
        // Verifica que el input no esté vacío antes de agregar la lista
        if (newInputValue !== '') {
            // Llama a la función listCrud para crear una nueva lista y obtiene los datos actualizados
            let data = await listCrud(appData, { type: 'CREATE_LIST', newListName: newInputValue });

            // Limpia el valor del input después de agregar la lista
            await resetInput();

            // Actualiza el estado global de la aplicación con los datos actualizados
            setAppData(data);
        }
    };

    return (
        <>
            {/* Sección para agregar una nueva lista */}
            <div className={addListContainerClassName}>
                <header className='mt-addList-header'>
                    <textarea
                        className='mt-addList-header-input'
                        placeholder='Nombre de la lista'
                        value={newInputValue}
                        onChange={change}
                    />
                    <button className='mt-addList-header-buttonAdd' onClick={handleAddList}>
                        Add
                    </button>
                </header>
                <button className='mt-addList-header-buttonExit' onClick={hide}>
                    X
                </button>
            </div>

            {/* Botón para mostrar la sección de agregar lista */}
            <button className={newListButtonClassName} onClick={show}>
                Agregar Lista
            </button>
        </>
    );
}

export default AddList;
