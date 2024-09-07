import { v4 as uuidv4 } from 'uuid';

import { arrayMoveImmutable } from 'array-move';

async function taskCrud(state, action) {

    switch(action.type) {
        // Crea una nueva tarea
        case 'CREATE_TASK':
            return {
                lists: 
                    state.lists.map(
                        list => list.id === action.listId ? 
                            { ...list, tasks: [...list.tasks, {id: uuidv4(), name: action.newTaskName, isVisible: true}] } : list)
            };
        // Reorganiza las tareas según el drag-and-drop
        case 'MOVE_TASK':
            return {
                lists: 
                    state.lists.map(
                        list => list.id === action.listId ? 
                            {...list, tasks: arrayMoveImmutable(list.tasks, action.fromIndex, action.toIndex)} : list
                )
            };
        
        case 'TASK_TO_ANOTHER_LIST':
            // Elimina la tarea de la lista de donde proviene el drag
            let deleteTask = {
                lists: 
                    state.lists.map(
                        (list, index) => index === action.fromListIndex ?
                        {...list, tasks: list.tasks.filter(task => task.id !== action.task.id) }
                        : list
                    )
            }

            // Agrega la tarea a la lista donde se suelta el drag en la posición 0
            let addTask = {
                lists: 
                    deleteTask.lists.map(
                        (list, index) => index === action.toListIndex ?
                        {...list, tasks: [action.task, ...list.tasks] }
                        : list
                    )
            }

            /* Retorna nuestros cambios anteriores más un cambio de posición en la lista de destino del drag, 
                entre la tarea fantasma y la tarea agregada 
                (Esto es para que la tarea que arrastramos quede posicionada en donde la soltamos y no en la posición 0)
            */
            return {
                lists: 
                addTask.lists.map(
                    (list, index) => index === action.toListIndex ?
                        {...list, tasks: arrayMoveImmutable(
                            list.tasks, 
                            list.tasks.findIndex(task => task.id ===action.task.id ), 
                            list.tasks.findIndex(task => task.id === -100)
                        )}
                        : list
                )
            }
            
        default:
            return state;
    }
}

export default taskCrud;