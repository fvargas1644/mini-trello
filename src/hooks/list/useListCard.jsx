import { AppDataContext, DragDataContext } from '../../context/AppContext.jsx';
import { useContext } from 'react';
import listCrud from "../../reducers/listCrud.jsx";

export function useListCard({ listId, listIndex }) {

    // Usa el contexto para obtener los datos de la aplicación y la función para actualizarlos
    const { appData, setAppData } = useContext(AppDataContext);

    // Usa el contexto para manejar el estado relacionado con el arrastre y la interfaz de usuario
    const {
        dragData,
        updateDragData
    } = useContext(DragDataContext);

    const listAnimationEnd = async (event) => {
        // Verifica si la animación es la de ocultar la lista
        if (event.animationName === 'list-fade-out') {
            // Realiza una operación de CRUD para ocultar la lista
            let data = await listCrud(appData, { type: 'TOGGLE_LIST_VISIBILITY', id: listId });
            setAppData(data); // Actualiza el estado de la aplicación con la nueva información
        }
    };

    const listDragOver = async (event) => {
        event.preventDefault(); // Necesario para permitir que el elemento sea soltado aquí

        // Verifica si el ítem arrastrado es una lista
        if (dragData.dragItemType === 'list') {
            // Si hay una lista arrastrada y se está pasando sobre una lista diferente
            if (dragData.draggedListIndex !== null && listIndex !== dragData.draggedListIndex) {
                // Realiza una operación de CRUD para mover la lista a una nueva posición
                let data = await listCrud(
                    appData, {
                    type: 'MOVE_LIST',
                    fromIndex: dragData.draggedListIndex,
                    toIndex: listIndex
                });
                setAppData(data); // Actualiza el estado de la aplicación

                updateDragData({
                    draggedListIndex: listIndex // Actualiza el índice de la lista arrastrada
                })
            }
        } else {
            // Si el ítem arrastrado es una tarea
            if (dragData.draggedTask) {
                // Verifica si la tarea se está moviendo entre listas diferentes
                if (listId !== dragData.dragTaskData.fromListId) {
                    // Si la tarea fantasma está activo y su lista asociada es diferente, actualiza la lista
                    if (dragData.activeGhostTask.active) {
                        if (dragData.activeGhostTask.listId !== listId) {
                            updateDragData({
                                activeGhostTask: {
                                    ...dragData.activeGhostTask,
                                    listId,
                                    toListIndex: listIndex
                                }
                            });
                        }
                    } else {
                        // Activa la tarea fantasma con la nueva lista
                        updateDragData({
                            activeGhostTask: {
                                active: true,
                                listId,
                                toListIndex: listIndex
                            }
                        });
                    }
                } else {
                    // Si la tarea regresa a la misma lista, desactiva la taera fantasma
                    updateDragData({
                        activeGhostTask: {
                            active: false,
                            listId: null,
                            toListIndex: null
                        }
                    });
                }
            }
        }
    };

    return { listAnimationEnd, listDragOver }
}