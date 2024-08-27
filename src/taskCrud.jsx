import { v4 as uuidv4 } from 'uuid';

import { arrayMoveImmutable } from 'array-move';

async function taskCrud(action) {
    let state = JSON.parse(localStorage.getItem('appData'));

    switch(action.type) {
        // Reorganiza las tareas según el drag-and-drop
        case 'MOVE_TASK':
            return {
            lists: 
                state.lists.map(
                    list => list.id === action.listId ? 
                        {...list, tasks: arrayMoveImmutable(list.tasks, action.fromIndex, action.toIndex)} : list
                )
            };
        default:
            return state;
    }
}

export default taskCrud;