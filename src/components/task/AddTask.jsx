import '../../styles/AddTask.css'

// hooks reutilizables
import { useInputValue } from '../../hooks/useInputValue.jsx';

// hooks para manejar la lógica del componente
import { useAddTask } from '../../hooks/task/useAddTask.jsx';

function AddTask({ listId }) {

    // Recupera los metodos necesarios para la lógica del customHook del componente
    const { addTask } = useAddTask({listId})
    
    // customHook para controlar el valor del input que agrega una tarea
    const inputValueAddTask = useInputValue({InitialValue: ''})

    return (
        <div className="mt-addTask-container">
            {/* Campo de entrada para la nueva tarea */}
            <input
                placeholder='Nueva tarea' 
                value={inputValueAddTask.value} // Valor controlado del input
                onChange={inputValueAddTask.onChange} // Función del hook que maneja los cambios en el input
            />
            {/* Botón para agregar la nueva tarea */}
            <button className="mt-addTask-buttonAdd" onClick={() => addTask(inputValueAddTask)}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6 icon">
                    <path fillRule="evenodd" d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" />
                </svg>
            </button>
        </div>
    );
}

export default AddTask; 