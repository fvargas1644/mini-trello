import { v4 as uuidv4 } from 'uuid';

import { arrayMoveImmutable } from 'array-move';
import Task from './Task';

async function taskCrud(state, action) {

    switch(action.type) {
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
            let indexTaskFromList = state.lists[action.fromListIndex].tasks.findIndex(task => task.id === action.task.id)

            if(indexTaskFromList !== -1){
                state.lists[action.fromListIndex].tasks.splice(indexTaskFromList,1)
                
                return {
                    lists: 
                      state.lists.map(list => list.id === action.toListId ? 
                        { ...list, tasks: [action.task, ...list.tasks] } : list),
                };
            }
            
        default:
            return state;
    }
}

export default taskCrud;