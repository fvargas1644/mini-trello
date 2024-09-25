import { useContext, useEffect, useState } from "react";
import { DragDataContext } from '../context/AppContext.jsx';

export function useGhostTask({task, listId}){
    // Accede al contexto de arrastre para obtener y actualizar el estado relacionado con el arrastre
    const { dragData } = useContext(DragDataContext);

    const [name, setName] = useState('Tarea');

    // Actualiza el nombre de la tarea fantasma cuando cambia el estado de la tarea fantasma activa
    useEffect(() => {
        if (dragData.activeGhostTask.active) {
            setName(dragData.dragTaskData.task.name);
        }
    }, [dragData.activeGhostTask]);

    const checkGhostTask = (task.id === -100 && dragData.activeGhostTask.listId === listId && dragData.activeGhostTask.active) ? true : false

    return {name, dragData, checkGhostTask}
}