import '../styles/AddTask.css'

// hooks reutilizables
import { useInputValue } from '../hooks/useInputValue.jsx';

// hooks para manejar la lógica del componente
import { useAddTask } from '../hooks/useAddTask.jsx';

// Define el componente funcional AddTask que recibe listId como prop
function AddTask({ listId }) {

    const { AddTask } = useAddTask()
    
    // customHook para controlar el valor del input que agrega una tarea
    const inputValueAddTask = useInputValue({InitialValue: ''})

    // Maneja la adición de una nueva tarea
    const handleAddTask = () => AddTask(inputValueAddTask, listId)

    return (
        <div className="mt-addTask-container">
            {/* Campo de entrada para la nueva tarea */}
            <input
                placeholder='Nueva tarea' // Texto de marcador de posición
                value={inputValueAddTask.value} // Valor controlado del input
                onChange={inputValueAddTask.onChange} // Función que maneja los cambios en el input
            />
            {/* Botón para agregar la nueva tarea */}
            <button className="mt-addTask-buttonAdd" onClick={handleAddTask}>
                {/* Icono SVG para el botón */}
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6 icon">
                    <path fillRule="evenodd" d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" />
                </svg>
            </button>
        </div>
    );
}

export default AddTask; // Exporta el componente AddTask para su uso en otras partes de la aplicación