import '../styles/App.css';
import { useState, useContext } from 'react';
import listCrud from '../reducers/listCrud.jsx'; 
import { AppDataContext } from '../context/AppContext.jsx';
import '../styles/AddList.css'; 

function AddList() {
    // Desestructuración del contexto para obtener y actualizar los datos de la aplicación
    const { appData, setAppData } = useContext(AppDataContext);

    // Estado local para controlar la visibilidad de la sección de agregar lista
    const [isAddListVisible, setIsAddListVisible] = useState(false);

    // Estado local para almacenar el valor del input de nueva lista
    const [newListInputValue, setNewListInputValue] = useState('');

    // Clases CSS dinámicas basadas en el estado de visibilidad de la sección de agregar lista
    const addListContainerClassName = isAddListVisible ? 'mt-addList-container is-add' : 'mt-addList-container';
    const newListButtonClassName = isAddListVisible ? 'mt-newList-button' : 'mt-newList-button is-add';

    // Función para mostrar la sección de agregar lista
    const toggleAddListSection = () => setIsAddListVisible(true);

    // Función para ocultar la sección de agregar lista
    const hideAddListSection = () => setIsAddListVisible(false);

    // Función para manejar los cambios en el input de nueva lista
    const handleInputChange = (event) => setNewListInputValue(event.target.value);

    // Función para manejar la adición de una nueva lista
    const handleAddList = async () => {
        // Verifica que el input no esté vacío antes de agregar la lista
        if (newListInputValue !== '') {
            // Llama a la función listCrud para crear una nueva lista y obtiene los datos actualizados
            let data = await listCrud(appData, { type: 'CREATE_LIST', newListName: newListInputValue });

            // Limpia el valor del input después de agregar la lista
            await setNewListInputValue('');

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
                        value={newListInputValue}
                        onChange={handleInputChange}
                    />
                    <button className='mt-addList-header-buttonAdd' onClick={handleAddList}>
                        Add
                    </button>
                </header>
                <button className='mt-addList-header-buttonExit' onClick={hideAddListSection}>
                    X
                </button>
            </div>

            {/* Botón para mostrar la sección de agregar lista */}
            <button className={newListButtonClassName} onClick={toggleAddListSection}>
                Agregar Lista
            </button>
        </>
    );
}

export default AddList;
