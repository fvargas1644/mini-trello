import { useContext } from "react"
import taskCrud from '../reducers/taskCrud.jsx'; 
import { AppDataContext } from '../context/AppContext.jsx';

export function useAddTask(){
    // Utiliza el hook useContext para obtener y modificar los datos del contexto
    const { appData, setAppData } = useContext(AppDataContext);

    const AddTask = async (inputValueAddTask, listId) => {
        // Verifica que el campo de entrada no esté vacío
        if (inputValueAddTask.value !== '') {

            // Llama a la función taskCrud para crear una nueva tarea
            let data = await taskCrud(appData, { type: 'CREATE_TASK', listId, newTaskName: inputValueAddTask.value });

            // Limpia el valor del input después de agregar la tarea
            await inputValueAddTask.resetValue();

            // Actualiza los datos del contexto con los nuevos datos
            setAppData(data);
        }
    };

    return { AddTask}
}