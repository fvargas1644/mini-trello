import { v4 as uuidv4 } from 'uuid';

import { arrayMoveImmutable } from 'array-move';

async function listCrud(action) {
    let state = JSON.parse(localStorage.getItem('appData'));

    switch(action.type) {
         // Crea una nueva lista si el nombre no está vacío
        case 'CREATE_LIST':
            return {
                lists: [
                    ...state.lists,
                    { id: uuidv4(), name: action.newListName, isVisible: true, tasks: [] }
                ]
            }     
        // Reorganiza las listas según el drag-and-drop
        case 'MOVE_LIST':
            console.log("Llegamos")
            return {
                lists: arrayMoveImmutable(state.lists, action.fromIndex, action.toIndex)
            }
        case 'CHANGE_LIST_NAME':
            return {
                lists: 
                    state.lists.map(list => list.id === action.id ? 
                    { ...list, name: action.name } : list)
                }
        default:
            return state;
    }
}

export default listCrud;