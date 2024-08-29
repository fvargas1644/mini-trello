import './styles/App.css'
import { useState, useContext } from 'react';
import listCrud from './listCrud.jsx' 
import {AppDataContext} from './AppContext.jsx'

function AddList (props) {

    const { appData, setAppData } = useContext(AppDataContext);

    // Estado local para manejar la visibilidad de la sección de agregar lista
    const [isAddListVisible, setIsAddListVisible] = useState(false);

    // Estado local para manejar el valor del input de nueva lista
    const [newListInputValue, setNewListInputValue] = useState('');

    // Clases CSS dinámicas para la sección de agregar lista
    const addListContainerClassName = isAddListVisible ? 'mt-addList-container is-add' : 'mt-addList-container';
    const newListButtonClassName = isAddListVisible ? 'mt-newList-button' : 'mt-newList-button is-add';

    // Muestra la sección de agregar lista
    const toggleAddListSection = () => setIsAddListVisible(true)

    // Esconde la sección de agregar lista
    const hideAddListSection = () => setIsAddListVisible(false)

    // Función para manejar cambios en el input de nueva lista
    const handleInputChange = (event) => setNewListInputValue(event.target.value)

    const handleAddList = async () => {
        if(newListInputValue !== ''){
            
            let data = await listCrud(appData, {type: 'CREATE_LIST', newListName: newListInputValue})

            await setNewListInputValue('')

            setAppData(data)
        }
    };


    return (
        <>
            <div className={addListContainerClassName}>
                <header className='mt-addList-header'>
                    <textarea
                        className='mt-addList-header-input'
                        placeholder='Nombre de la lista'
                        value={newListInputValue}
                        onChange={handleInputChange}
                    />
                    <button className='mt-addList-header-buttonAdd' onClick={handleAddList}>Add</button>
                </header>

                <button className='mt-addList-header-buttonExit' onClick={hideAddListSection}>X</button>
            </div>
            <button className={newListButtonClassName} onClick={toggleAddListSection}>
                Agregar Lista
            </button>
        </>
      
    )    
}

export default AddList;