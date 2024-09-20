import '../styles/App.css';
import '../styles/AddList.css'; 

// hooks reutilizables
import { useVisibility } from '../hooks/useVisibility.jsx';
import { useInputValue } from '../hooks/useInputValue.jsx';

// hooks para manejar la lógica del componente
import { useAddList } from '../hooks/useAddList.jsx';


function AddList() {
    
    // customHook para controlar la visibilidad de la sección de agregar lista
    const isVisibleAddList = useVisibility({initialState: false})

    // customHook para controlar el valor del input que agrega una lista
    const inputValueAddList = useInputValue({InitialValue: ''})

    const { addList } = useAddList({})

    // Clases CSS dinámicas basadas en el estado de visibilidad de la sección de agregar lista
    const addListContainerClassName = isVisibleAddList.state ? 'mt-addList-container is-add' : 'mt-addList-container';
    const newListButtonClassName = isVisibleAddList.state ? 'mt-newList-button' : 'mt-newList-button is-add';

    const handleAddList = () => addList(inputValueAddList)
    
    return (
        <>
            {/* Sección para agregar una nueva lista */}
            <div className={addListContainerClassName}>
                <header className='mt-addList-header'>
                    <textarea
                        className='mt-addList-header-input'
                        placeholder='Nombre de la lista'
                        value={inputValueAddList.value}
                        onChange={inputValueAddList.onChange}
                    />
                    <button className='mt-addList-header-buttonAdd' onClick={handleAddList}>
                        Add
                    </button>
                </header>
                <button className='mt-addList-header-buttonExit' onClick={isVisibleAddList.hide}>
                    X
                </button>
            </div>

            {/* Botón para mostrar la sección de agregar lista */}
            <button className={newListButtonClassName} onClick={isVisibleAddList.show}>
                Agregar Lista
            </button>
        </>
    );
}

export default AddList;
