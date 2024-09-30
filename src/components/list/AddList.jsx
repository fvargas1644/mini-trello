import '../../styles/App.css';
import '../../styles/AddList.css'; 

// hooks reutilizables
import { useVisibility } from '../../hooks/useVisibility.jsx';
import { useInputValue } from '../../hooks/useInputValue.jsx';

// hooks para manejar la lógica del componente
import { useAddList } from '../../hooks/list/useAddList.jsx';

function AddList() {
    
    // customHook para controlar la visibilidad de la sección de agregar lista
    const isVisibleAddList = useVisibility({initialState: false})

    // customHook para controlar el valor del input que agrega una lista
    const inputValueAddList = useInputValue({InitialValue: ''})

    const { addList } = useAddList({})
    
    return (
        <>
            {/* Sección para agregar una nueva lista */}
            <div className={`mt-addList-container ${isVisibleAddList.state ? 'is-add': ''}`}>
                <header className='mt-addList-header'>
                    {/* Campo de entrada para la nueva lista */}
                    <textarea
                        className='mt-addList-header-input'
                        placeholder='Nombre de la lista'
                        value={inputValueAddList.value}
                        onChange={inputValueAddList.onChange}
                    />
                    <button className='mt-addList-header-buttonAdd' onClick={() => addList(inputValueAddList)}>
                        Add
                    </button>
                </header>
                {/* Botón para transicionar del input a la vista previa */}
                <button className='mt-addList-header-buttonExit' onClick={isVisibleAddList.hide}>
                    X
                </button>
            </div>

            {/* Botón para mostrar la sección de agregar lista */}
            <button 
                className={`mt-newList-button ${isVisibleAddList.state ? '': 'is-add'}`} 
                onClick={isVisibleAddList.show}
            >
                Agregar Lista
            </button>
        </>
    );
}

export default AddList;
