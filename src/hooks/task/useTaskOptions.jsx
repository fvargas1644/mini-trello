import { AppDataContext } from '../../context/AppContext.jsx'; 
import taskCrud from "../../reducers/taskCrud.jsx";
import { useContext } from 'react';

export function useTaskOptions({task, listId}){

    // Obtiene el contexto de datos de la aplicación
    const { appData, setAppData } = useContext(AppDataContext);

    // Función para alternar la visibilidad del campo de entrada del nombre de la tarea
    async function toggleTaskNameInput(isVisibleTaskNameInput, taskNameInputRef, isVisibleMenuOptions) {
        if (!isVisibleTaskNameInput.state) {
            await isVisibleTaskNameInput.show(); // Muestra el campo de entrada
            taskNameInputRef.current.select(); // Selecciona el contenido del campo de entrada para facilitar la edición
        } else {
            isVisibleTaskNameInput.hide(); // Oculta el campo de entrada
        }
        
        isVisibleMenuOptions.hide(); // Oculta el menú de opciones cuando se muestra el campo de entrada
    }

    // Función para manejar cambios en el campo de entrada del nombre de la tarea
    const taskNameInputChange = async (event, inputValueTaskName) => {
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
    const keyDownTaskNameInput = (event, isVisibleTaskNameInput) => {
        if (event.key === 'Enter' || event.key === 'Escape') {
            isVisibleTaskNameInput.hide(); // Oculta el campo de entrada al presionar Enter o Escape
        }
    };

    return {toggleTaskNameInput, taskNameInputChange, keyDownTaskNameInput}

}