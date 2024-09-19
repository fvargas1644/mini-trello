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
    const {newInputValue, change} = useInputValue({inputValue: task.name});

    // customHook para controlar la visibilidad del menú de opciones
    const isVisibleMenuOptions = useVisibility({initialState: false})

    // customHook para controlar la visibilidad del campo de entrada del nombre de la tarea
    const isVisibleTaskNameInput = useVisibility({initialState: false})

    // Referencia al campo de entrada para manipularlo directamente
    const taskNameInputRef = useRef(task.name);

    // Determina las clases CSS del menú de opciones y del campo de entrada basado en su visibilidad
    const menuOptionsClassName = isVisibleMenuOptions.isVisible ? 'mt-task-menuOptions' : 'mt-task-menuOptions is-hidden';
    const isActiveOptionsTaskButton = isVisibleMenuOptions.isVisible ? 'is-active' : ''; 
    const taskNameInputClassName = isVisibleTaskNameInput.isVisible ? 'mt-list-taskName-input' : 'mt-list-taskName-input is-hidden';
    const taskNameTitleClassName = isVisibleTaskNameInput.isVisible ? 'is-hidden' : '';

    // Función para alternar la visibilidad del campo de entrada del nombre de la tarea
    async function toggleListNameInput() {
        if (!isVisibleTaskNameInput.isVisible) {
            await isVisibleTaskNameInput.show(); // Muestra el campo de entrada
            taskNameInputRef.current.select(); // Selecciona el contenido del campo de entrada para facilitar la edición
        } else {
            isVisibleTaskNameInput.hide(); // Oculta el campo de entrada
        }
        
        isVisibleMenuOptions.hide(); // Oculta el menú de opciones cuando se muestra el campo de entrada
    }

    // Función para manejar cambios en el campo de entrada del nombre de la tarea
    const handleTaskNameInputChange = async (event) => {
        change(event); // Actualiza el estado con el nuevo valor del campo
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

    // Función para manejar el evento blur en el campo de entrada, ocultando el campo de entrada
    const handleTaskNameOnBlur = () => isVisibleTaskNameInput.hide();

    // Función para alternar la visibilidad del menú de opciones de la tarea
    const handleMenuOptionsTaskView = () => isVisibleMenuOptions.toggle();

    // Función para ocultar la tarea (aplicando una clase CSS que la oculta)
    const hideTask = (event) => event.target.closest('.mt-task-container').classList.add('hideTask');

    return (
        <>
            <div className="mt-list-taskName">    
                {/* Muestra el nombre de la tarea y permite editarlo al hacer clic */}
                <p className={taskNameTitleClassName} onClick={toggleListNameInput}>
                    {task.name}
                </p>
                {/* Campo de entrada para editar el nombre de la tarea */}
                <textarea 
                    className={taskNameInputClassName}
                    ref={taskNameInputRef}
                    value={newInputValue}
                    onKeyDown={handleKeyDownTaskNameInput}
                    onChange={handleTaskNameInputChange}
                    onBlur={handleTaskNameOnBlur}
                ></textarea>
            </div>
            <div className="mt-task-sectionOptions">
                {/* Botón para mostrar/ocultar el menú de opciones */}
                <button onClick={handleMenuOptionsTaskView} className={isActiveOptionsTaskButton}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 iconOptions">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                    </svg>
                </button>
                <span>
                    {/* Menú de opciones para editar o eliminar la tarea */}
                    <ul className={menuOptionsClassName}>
                        <li onClick={toggleListNameInput}>
                            {isVisibleTaskNameInput.isVisible ? 'Actualizar':'Editar'}
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
