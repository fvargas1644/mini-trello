import { v4 as uuidv4 } from 'uuid';

import { arrayMoveImmutable } from 'array-move';

async function listCrud(state, action) {

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
            return {
                lists: arrayMoveImmutable(state.lists, action.fromIndex, action.toIndex)
            }
        // Cambia el nombre de la lista
        case 'CHANGE_LIST_NAME':
            return {
                lists: 
                    state.lists.map(
                        list => list.id === action.id ? { ...list, name: action.name } : list
                    )
                }
        // Alterna la visibilidad de una lista (la oculta)
        case 'TOGGLE_LIST_VISIBILITY':
            return {
                lists: state.lists.map(
                    list => list.id === action.id ? { ...list, isVisible: !list.isVisible } : list
                )
            };
        default:
            return state;
    }
}

export default listCrud;