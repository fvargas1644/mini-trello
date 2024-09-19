import { useState, useContext } from "react"
import taskCrud from "../reducers/taskCrud.jsx"
import { AppDataContext } from '../context/AppContext.jsx'
import '../styles/AddTask.css'

//hooks
import { useInputValue } from '../hooks/useInputValue.jsx';

// Define el componente funcional AddTask que recibe listId como prop
function AddTask({ listId }) {

    // Utiliza el hook useContext para obtener y modificar los datos del contexto
    const { appData, setAppData } = useContext(AppDataContext);

    // customHook para controlar el valor del input que agrega una tarea
    const {newInputValue, change, resetInput} = useInputValue({inputValue: ''});

    // Maneja la adición de una nueva tarea
    const handleAddTask = async () => {
        // Verifica que el campo de entrada no esté vacío
        if (newInputValue !== '') {

            // Llama a la función taskCrud para crear una nueva tarea
            let data = await taskCrud(appData, { type: 'CREATE_TASK', listId, newTaskName: newInputValue });

            // Limpia el valor del input después de agregar la tarea
            await resetInput('');

            // Actualiza los datos del contexto con los nuevos datos
            setAppData(data);
        }
    };

    return (
        <div className="mt-addTask-container">
            {/* Campo de entrada para la nueva tarea */}
            <input
                placeholder='Nueva tarea' // Texto de marcador de posición
                value={newInputValue} // Valor controlado del input
                onChange={change} // Función que maneja los cambios en el input
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