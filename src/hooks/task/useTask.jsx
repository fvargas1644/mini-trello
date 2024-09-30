import taskCrud from "../../reducers/taskCrud.jsx";
import { useContext } from 'react';
import { AppDataContext, DragDataContext } from '../../context/AppContext.jsx';

export function useTask({ listId, listIndex, tasks }) {
    // Accede al contexto de datos de la aplicación para obtener y actualizar los datos globales
    const { appData, setAppData } = useContext(AppDataContext);

    // Accede al contexto de arrastre para obtener y actualizar el estado relacionado con el arrastre
    const {
        dragData,
        updateDragData
    } = useContext(DragDataContext);

    // Maneja el inicio del arrastre
    const taskDragStart = async (event, index, task) => {
        event.target.style.opacity = "0.3"; // Reduce la opacidad del elemento arrastrado
        event.dataTransfer.effectAllowed = 'move'; // Permite el movimiento del elemento

        updateDragData({
            draggedTaskIndex: index, // Actualiza el índice de la tarea arrastrada
            dragTaskData: { // Establece los datos del arrastre
                fromListId: listId,
                fromListIndex: listIndex,
                task
            },
            draggedTask: true, // Marca que una tarea está siendo arrastrada
            dragItemType: 'task', // Actualiza el tipo de item de arrastre a task
        })
    };

    // Determina si el área de destino del arrastre está dentro del rango aceptable
    const areaDragOver = async (taskId, event, area) => {
        let inArea = false;
        const dropArea = document.getElementById(taskId);
        const rect = dropArea.getBoundingClientRect();
        const offsetY = event.clientY - rect.top;
        const dropAreaHeight = rect.height;
        const acceptanceRange = area;
        const rangeStart = (dropAreaHeight - acceptanceRange) / 2;
        const rangeEnd = rangeStart + acceptanceRange;

        // Verifica si la posición está dentro del rango específico
        if (offsetY >= rangeStart && offsetY <= rangeEnd) {
            inArea = true;
        }

        return inArea;
    };

    // Maneja el evento de arrastre sobre una tarea
    const taskDragOver = async (event, taskIndex, taskId) => {
        // Verifica si el arrastre está dentro del área aceptable
        let inArea = await areaDragOver(taskId, event, 40);

        // Si el Drop es en los 40px del centro de la tarea
        if (inArea && dragData.dragItemType === 'task') {
            // Permite el drop en la lista actual solo si el arrastre se origina en la misma lista
            if (listId === dragData.dragTaskData.fromListId) {

                updateDragData({ // Desactiva la tarea fantasma
                    activeGhostTask: {
                        active: false,
                        listId: null,
                        toListIndex: null
                    }
                })

                // Solo mueve la tarea si el índice cambia y no es la misma tarea
                if (dragData.draggedTaskIndex !== null && taskIndex !== dragData.draggedTaskIndex) {
                    // Realiza una solicitud para mover la tarea
                    let data = await taskCrud(
                        appData,
                        {
                            type: 'MOVE_TASK',
                            listId,
                            fromIndex: dragData.draggedTaskIndex,
                            toIndex: taskIndex
                        });
                    await setAppData(data); // Actualiza los datos de la aplicación
                    updateDragData({
                        draggedTaskIndex: taskIndex // Actualiza el índice de la tarea arrastrada
                    })
                }
            }

            // Si la tarea fantasma está activa y en la misma lista, mueve la tarea fantasma
            if (dragData.activeGhostTask.active === true && listId === dragData.activeGhostTask.listId) {
                let data = await taskCrud(
                    appData,
                    {
                        type: 'MOVE_TASK',
                        listId,
                        fromIndex: tasks.findIndex(task => task.id === -100),
                        toIndex: taskIndex
                    });
                await setAppData(data); // Actualiza los datos de la aplicación
            }
        }
    };

    // Maneja el final del arrastre
    const taskDragEnd = async (event) => {
        event.target.style.opacity = "1"; // Restaura la opacidad del elemento

        if (dragData.activeGhostTask.active) {
            let data = await taskCrud(
                appData,
                {
                    type: 'TASK_TO_ANOTHER_LIST',
                    fromListIndex: dragData.dragTaskData.fromListIndex,
                    toListIndex: dragData.activeGhostTask.toListIndex,
                    task: dragData.dragTaskData.task,
                });
            await setAppData(data); // Actualiza el estado de la aplicación
        }

        updateDragData({
            draggedTaskIndex: null, // Resetea el índice de la tarea arrastrada
            dragData: undefined, // Limpiar los datos del arrastre
            draggedTask: false, // Marca que el arrastre ha terminado
            dragItemType: null, // Resetea el dato de item arrastrado

            activeGhostTask: { // Desactiva la tarea fantasma  
                active: false,
                listId: null,
                toListIndex: null
            }
        })
    };

    // Maneja el evento cuando termina la animación de la lista
    const taskAnimationEnd = async (event, taskId) => {
        // Verifica si la animación es la de ocultar la lista
        if (event.animationName === 'task-fade-out') {
            // Realiza una operación de CRUD para ocultar la tarea
            let data = await taskCrud(
                appData,
                {
                    type: 'TOGGLE_TASK_VISIBILITY',
                    listId,
                    taskId
                });
            await setAppData(data); // Actualiza el estado de la aplicación con la nueva información
        }
    };


    return { taskDragStart, taskDragOver, taskDragEnd, taskAnimationEnd }
}