import { useState, useRef, useContext } from "react";
import { AppDataContext } from '../context/AppContext.jsx'; 
import taskCrud from "../reducers/taskCrud.jsx"; 

//hooks
import { useVisibility } from '../hooks/useVisibility.jsx';
import { useInputValue } from '../hooks/useInputValue.jsx';


function TaskOptions({ task, listId }) {

    // Obtiene el contexto de datos de la aplicación
    const { appData, setAppData } = useContext(AppDataContext);

    // customHook para controlar el valor del nombre de la tarea que se está editando
    const inputValueTaskName = useInputValue({InitialValue: task.name});

    // customHook para controlar la visibilidad del menú de opciones
    const isVisibleMenuOptions = useVisibility({initialState: false})

    // customHook para controlar la visibilidad del campo de entrada del nombre de la tarea
    const isVisibleTaskNameInput = useVisibility({initialState: false})

    // Referencia al campo de entrada para manipularlo directamente
    const taskNameInputRef = useRef(task.name);

    // Función para alternar la visibilidad del campo de entrada del nombre de la tarea
    async function toggleListNameInput() {
        if (!isVisibleTaskNameInput.state) {
            await isVisibleTaskNameInput.show(); // Muestra el campo de entrada
            taskNameInputRef.current.select(); // Selecciona el contenido del campo de entrada para facilitar la edición
        } else {
            isVisibleTaskNameInput.hide(); // Oculta el campo de entrada
        }
        
        isVisibleMenuOptions.hide(); // Oculta el menú de opciones cuando se muestra el campo de entrada
    }

    // Función para manejar cambios en el campo de entrada del nombre de la tarea
    const handleTaskNameInputChange = async (event) => {
        inputValueTaskName.onChange(event); // Actualiza el estado con el nuevo valor del campo
        let data = await taskCrud(
            appData, ({ 
                type: 'CHANGE_TASK_NAME', 
                listId, 
                taskId: task.id, 
                newTaskName: event.target.value
            })
        ); // Llama a la función CRUD para manejar el cambio del nombre
        setAppData(data); // Actualiza el contexto con los nuevos datos
    };

    // Función para manejar eventos de teclado en el campo de entrada del nombre de la tarea
    const handleKeyDownTaskNameInput = (event) => {
        if (event.key === 'Enter' || event.key === 'Escape') {
            isVisibleTaskNameInput.hide(); // Oculta el campo de entrada al presionar Enter o Escape
        }
    };

    // Función para ocultar la tarea (aplicando una clase CSS que la oculta)
    const hideTask = (event) => event.target.closest('.mt-task-container').classList.add('hideTask');

    return (
        <>
            <div className="mt-list-taskName">    
                {/* Muestra el nombre de la tarea y permite editarlo al hacer clic */}
                <p className={isVisibleTaskNameInput.state ? 'is-hidden' : ''} onClick={toggleListNameInput}>
                    {task.name}
                </p>
                {/* Campo de entrada para editar el nombre de la tarea */}
                <textarea 
                    className={`mt-list-taskName-input ${isVisibleTaskNameInput.state ? '' : 'is-hidden'}`}
                    ref={taskNameInputRef}
                    value={inputValueTaskName.value}
                    onKeyDown={handleKeyDownTaskNameInput}
                    onChange={handleTaskNameInputChange}
                    onBlur={() => isVisibleTaskNameInput.hide()} // Si el input pierde foco oculta el input 
                ></textarea>
            </div>
            <div className="mt-task-sectionOptions">
                {/* Botón para mostrar/ocultar el menú de opciones */}
                <button 
                    className={isVisibleMenuOptions.state ? 'is-active' : ''} 
                    onClick={() => isVisibleMenuOptions.toggle()} // Alterna la visibilidad del menu de opciones por click
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 iconOptions">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                    </svg>
                </button>
                <span>
                    {/* Menú de opciones para editar o eliminar la tarea */}
                    <ul className={`mt-task-menuOptions ${isVisibleMenuOptions.state ? '' : 'is-hidden'}`}>
                        <li onClick={toggleListNameInput}>
                            {isVisibleTaskNameInput.state ? 'Actualizar':'Editar'}
                        </li>
                        <li onClick={hideTask}>
                            Eliminar
                        </li>
                    </ul>
                </span>
            </div>
        </>
    );
}

export default TaskOptions;
