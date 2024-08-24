import { v4 as uuidv4 } from 'uuid';

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
        default:
            return state;
    }
}

export default listCrud;