import React, { useContext, useEffect, useState } from "react";
import AddTask from "./AddTask.jsx";
import '../styles/Task.css';
import taskCrud from "../reducers/taskCrud.jsx";
import { AppDataContext, DragDataContext } from '../context/AppContext.jsx';
import TaskOptions from "./TaskOptions.jsx";

// Componente que representa una tarea visible en la interfaz
function RealTask({ task, handleTaskDragStart, handleTaskAnimationEnd, handleTaskDragOver, handleTaskDrop, index, handleTaskDragEnd, listId }) {
    return (
        <div
            className='mt-task-container'
            draggable // Permite arrastrar el elemento
            onDragStart={(event) => handleTaskDragStart(event, index, task)} // Maneja el inicio del arrastre
            onDragOver={(event) => handleTaskDragOver(event, index, task.id)} // Maneja el evento cuando el elemento es arrastrado sobre otro
            onDrop={handleTaskDrop} // Maneja el evento cuando se deja caer el elemento
            onDragEnd={handleTaskDragEnd} // Maneja el final del arrastre
            onAnimationEnd={(event) => handleTaskAnimationEnd(event, task.id)} // Maneja el fin de la animación
            id={task.id}
        >
            {/* Muestra el nombre de la tarea y opciones */}
            <TaskOptions
                task={task}
                listId={listId}
            />
        </div>
    );
}

// Componente que representa una tarea "fantasma" (vista previa del lugar donde se podría soltar una tarea)
function GhostTask({ task, activeGhostTask, listId, dragTaskData }) {
    const [ghostTaskName, setGhostTaskName] = useState('Tarea');

    // Actualiza el nombre de la tarea fantasma cuando cambia el estado de la tarea fantasma activa
    useEffect(() => {
        if (activeGhostTask.active) {
            setGhostTaskName(dragTaskData.task.name);
        }
    }, [activeGhostTask]);

    // Solo muestra la tarea fantasma si las condiciones son correctas
    if (task.id === -100 && activeGhostTask.listId === listId && activeGhostTask.active) {
        return (
            <div className='mt-task-container ghost'>
                <div className="mt-list-taskName">
                    <p>{ghostTaskName}</p>
                </div>
                <div className="mt-task-sectionOptions">
                    <button>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 iconOptions">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                        </svg>
                    </button>
                </div>
            </div>
        );
    }

    return null; // No renderiza nada si las condiciones no se cumplen
}

// Componente principal que maneja una lista de tareas
function Task({ listId, listIndex, tasks }) {

    // Accede al contexto de datos de la aplicación para obtener y actualizar los datos globales
    const { appData, setAppData } = useContext(AppDataContext);

    // Accede al contexto de arrastre para obtener y actualizar el estado relacionado con el arrastre
    const {
        dragData,
        updateDragData
    } = useContext(DragDataContext);

    // Efecto que asegura que siempre haya una tarea fantasma en la lista
    useEffect(() => {
        // Verifica si ya hay una tarea fantasma en la lista
        if (tasks.findIndex(task => task.id === -100) === -1) {
            // Si no hay, agrega una tarea fantasma al principio de la lista
            tasks.unshift({ id: -100, name: "Tarea", isVisible: false });
        }
    }, []); // El array vacío asegura que esto solo se ejecute una vez al montar el componente

    // Maneja el inicio del arrastre
    const handleTaskDragStart = async (event, index, task) => {
        event.target.style.opacity = "0.3"; // Reduce la opacidad del elemento arrastrado
        event.dataTransfer.effectAllowed = 'move'; // Permite el movimiento del elemento

        updateDragData({
            draggedTaskIndex: index, // Actualiza el índice de la tarea arrastrada
            dragTaskData: { // Establece los datos del arrastre
                fromListId: listId, 
                fromListIndex: listIndex, 
                task },
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
    const handleTaskDragOver = async (event, taskIndex, taskId) => {
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
    const handleTaskDragEnd = async (event) => {
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
            
            activeGhostTask:{ // Desactiva la tarea fantasma  
                active: false, 
                listId: null, 
                toListIndex: null
            }
        })
    };

    // Maneja el evento cuando termina la animación de la lista
    const handleTaskAnimationEnd = async (event, taskId) => {
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

    return (
        <section className='mt-task-section'>
            {/* Mapea sobre las tareas y renderiza el componente adecuado */}
            {tasks.map((task, index) => (
                <React.Fragment key={task.id}>
                    {task.isVisible ? (
                        <RealTask
                            task={task}
                            handleTaskDragStart={handleTaskDragStart}
                            handleTaskDragOver={handleTaskDragOver}
                            handleTaskDrop={(event) => event.preventDefault()}
                            handleTaskDragEnd={handleTaskDragEnd}
                            handleTaskAnimationEnd={handleTaskAnimationEnd}
                            index={index}
                            listId={listId}
                        />
                    ) : (
                        <GhostTask
                            task={task}
                            activeGhostTask={dragData.activeGhostTask}
                            listId={listId}
                            dragTaskData={dragData.dragTaskData}
                        />
                    )}
                </React.Fragment>
            ))}
            {/* Componente para añadir nuevas tareas */}
            <AddTask listId={listId} />
        </section>
    );
}

export default Task;
