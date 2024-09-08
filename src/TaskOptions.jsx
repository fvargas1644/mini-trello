import { useState, useRef, useContext } from "react";
import { AppDataContext } from './AppContext.jsx'; // Contexto para manejar datos de la aplicación
import taskCrud from "./taskCrud.jsx"; // Función para realizar operaciones CRUD sobre las tareas

function TaskOptions({ task, listId }) {

    // Obtiene el contexto de datos de la aplicación
    const { appData, setAppData } = useContext(AppDataContext);

    // Estado para controlar la visibilidad del menú de opciones
    const [menuOptionsIsVisible, setMenuOptionsIsVisible] = useState(false);
    
    // Estado para controlar la visibilidad del campo de entrada del nombre de la tarea
    const [taskNameInputIsVisible, setTaskNameInputIsVisible] = useState(false);

    // Referencia al campo de entrada para manipularlo directamente
    const taskNameInputRef = useRef(task.name);

    // Estado para manejar el valor del nombre de la tarea que se está editando
    const [newTaskNameInputValue, setNewTaskNameInputValue] = useState(task.name);

    // Determina las clases CSS del menú de opciones y del campo de entrada basado en su visibilidad
    const menuOptionsClassName = menuOptionsIsVisible ? 'mt-task-menuOptions' : 'mt-task-menuOptions is-hidden';
    const isActiveOptionsTaskButton = menuOptionsIsVisible ? 'is-active' : ''; 
    const taskNameInputClassName = taskNameInputIsVisible ? 'mt-list-taskName-input' : 'mt-list-taskName-input is-hidden';
    const taskNameTitleClassName = taskNameInputIsVisible ? 'is-hidden' : '';

    // Función para alternar la visibilidad del campo de entrada del nombre de la tarea
    async function toggleListNameInput() {
        if (!taskNameInputIsVisible) {
            await setTaskNameInputIsVisible(true); // Muestra el campo de entrada
            taskNameInputRef.current.select(); // Selecciona el contenido del campo de entrada para facilitar la edición
        } else {
            setTaskNameInputIsVisible(false); // Oculta el campo de entrada
        }
        
        setMenuOptionsIsVisible(false); // Oculta el menú de opciones cuando se muestra el campo de entrada
    }

    // Función para manejar cambios en el campo de entrada del nombre de la tarea
    const handleTaskNameInputChange = async (event) => {
        setNewTaskNameInputValue(event.target.value); // Actualiza el estado con el nuevo valor del campo
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
            setTaskNameInputIsVisible(false); // Oculta el campo de entrada al presionar Enter o Escape
        }
    };

    // Función para manejar el evento blur en el campo de entrada, ocultando el campo de entrada
    const handleTaskNameOnBlur = () => setTaskNameInputIsVisible(false);

    // Función para alternar la visibilidad del menú de opciones de la tarea
    const handleMenuOptionsTaskView = () => setMenuOptionsIsVisible(!menuOptionsIsVisible);

    // Función para ocultar la tarea (aplicando una clase CSS que la oculta)
    const hideTask = (event) => event.target.closest('.mt-task-container').classList.add('hide');

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
                    value={newTaskNameInputValue}
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
                            {taskNameInputIsVisible ? 'Actualizar':'Editar'}
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
