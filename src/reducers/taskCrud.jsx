import { v4 as uuidv4 } from 'uuid'; // Importa la función uuidv4 para generar IDs únicos para nuevas tareas
import { arrayMoveImmutable } from 'array-move'; // Importa la función para reordenar elementos en un array de manera inmutable

/**
 * Maneja las acciones relacionadas con la gestión de tareas en el estado.
 * 
 * @param {Object} state - El estado actual que contiene las tareas.
 * @param {Object} action - La acción a realizar, con un tipo y posibles datos adicionales.
 * @returns {Object} - El nuevo estado actualizado según la acción.
 */

async function taskCrud(state, action) {

    switch (action.type) {
        // Acción para crear una nueva tarea en la lista especificada
        case 'CREATE_TASK':
            return {
                lists: state.lists.map(
                    list => list.id === action.listId ?
                        { 
                            ...list, 
                            tasks: [
                                ...list.tasks, 
                                { 
                                    id: uuidv4(), // Genera un nuevo ID único para la tarea
                                    name: action.newTaskName, // Asigna el nombre de la nueva tarea
                                    isVisible: true // Inicialmente la tarea es visible
                                }
                            ] 
                        } 
                        : list // Si la lista no coincide, la retorna sin cambios
                )
            };

        // Acción para reorganizar tareas en la misma lista basada en la posición de arrastre
        case 'MOVE_TASK':
            return {
                lists: state.lists.map(
                    list => list.id === action.listId ?
                        { 
                            ...list, 
                            tasks: arrayMoveImmutable(list.tasks, action.fromIndex, action.toIndex) // Reordena las tareas en la lista
                        } 
                        : list
                )
            };

        // Acción para mover una tarea a otra lista
        case 'TASK_TO_ANOTHER_LIST':
            // Elimina la tarea de la lista de origen
            let deleteTask = {
                lists: state.lists.map(
                    (list, index) => index === action.fromListIndex ?
                        { 
                            ...list, 
                            tasks: list.tasks.filter(task => task.id !== action.task.id) // Filtra la tarea que se mueve fuera
                        } 
                        : list
                )
            };

            // Agrega la tarea a la lista de destino en la posición 0
            let addTask = {
                lists: deleteTask.lists.map(
                    (list, index) => index === action.toListIndex ?
                        { 
                            ...list, 
                            tasks: [action.task, ...list.tasks] // Inserta la tarea al inicio de la lista de destino
                        } 
                        : list
                )
            };

            /* Retorna el estado actualizado, moviendo la tarea a su nueva posición correcta en la lista de destino
               La tarea arrastrada se reubica de acuerdo con la posición original del arrastre, usando un ID fantasma como marcador */
            return {
                lists: addTask.lists.map(
                    (list, index) => index === action.toListIndex ?
                        { 
                            ...list, 
                            tasks: arrayMoveImmutable(
                                list.tasks,
                                list.tasks.findIndex(task => task.id === action.task.id), // Encuentra la posición original de la tarea arrastrada
                                list.tasks.findIndex(task => task.id === -100) // Encuentra la posición del marcador fantasma
                            )
                        } 
                        : list
                )
            };

        // Acción para cambiar el nombre de una tarea existente
        case 'CHANGE_TASK_NAME':
            return {
                lists: state.lists.map(
                    list => list.id === action.listId ? 
                        { 
                            ...list, 
                            tasks: list.tasks.map(
                                task => task.id === action.taskId ? 
                                    { 
                                        ...task, 
                                        name: action.newTaskName // Actualiza el nombre de la tarea
                                    } 
                                    : task
                            ) 
                        } 
                        : list 
                )
            };

        // Acción para alternar la visibilidad de una tarea (la oculta)
        case 'TOGGLE_TASK_VISIBILITY':
            return {
                lists: state.lists.map(
                    list => list.id === action.listId ? 
                        { 
                            ...list, 
                            tasks: list.tasks.map(
                                task => task.id === action.taskId ? 
                                    { 
                                        ...task, 
                                        isVisible: false // Establece la tarea como no visible
                                    } 
                                    : task
                            ) 
                        } 
                        : list 
                )
            };

        // Retorna el estado actual si la acción no es reconocida
        default:
            return state;
    }
}

export default taskCrud; // Exporta la función para que pueda ser utilizada en otros módulos
