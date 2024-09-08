// Importa la función para generar identificadores únicos
import { v4 as uuidv4 } from 'uuid';

// Importa la función para mover elementos en una lista de manera inmutable
import { arrayMoveImmutable } from 'array-move';

/**
 * Maneja las acciones relacionadas con la gestión de listas en el estado.
 * 
 * @param {Object} state - El estado actual que contiene las listas.
 * @param {Object} action - La acción a realizar, con un tipo y posibles datos adicionales.
 * @returns {Object} - El nuevo estado actualizado según la acción.
 */
async function listCrud(state, action) {

    switch(action.type) {
        // Acción para crear una nueva lista
        case 'CREATE_LIST':
            // Verifica que el nombre de la lista no esté vacío antes de agregarla
            return {
                lists: [
                    ...state.lists, // Mantiene las listas existentes
                    { 
                        id: uuidv4(), // Genera un nuevo ID único para la lista
                        name: action.newListName, // Usa el nombre de la lista proporcionado en la acción
                        isVisible: true, // La lista se crea como visible por defecto
                        tasks: [] // Inicializa la lista con un array vacío de tareas
                    }
                ]
            };
        
        // Acción para mover una lista dentro del array
        case 'MOVE_LIST':
            return {
                lists: arrayMoveImmutable(state.lists, action.fromIndex, action.toIndex) // Mueve la lista de la posición de origen a la posición de destino
            };
        
        // Acción para cambiar el nombre de una lista existente
        case 'CHANGE_LIST_NAME':
            return {
                lists: state.lists.map(
                    list => list.id === action.id ? { ...list, name: action.name } : list // Actualiza el nombre de la lista si el ID coincide
                )
            };
        
        // Acción para alternar la visibilidad de una lista
        case 'TOGGLE_LIST_VISIBILITY':
            return {
                lists: state.lists.map(
                    list => list.id === action.id ? { ...list, isVisible: !list.isVisible } : list // Alterna el estado de visibilidad de la lista si el ID coincide
                )
            };
        
        // Retorna el estado actual si la acción no coincide con ninguno de los casos anteriores
        default:
            return state;
    }
}

// Exporta la función listCrud para que pueda ser utilizada en otros módulos
export default listCrud;
