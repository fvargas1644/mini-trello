import React, { useContext, useEffect, useState } from "react";
import AddTask from "./AddTask.jsx";
import './styles/Task.css';
import taskCrud from "./taskCrud.jsx";
import { AppDataContext, DragDataContext } from './AppContext.jsx';
import TaskOptions from "./TaskOptions.jsx";

// Componente que representa una tarea visible en la interfaz
function RealTask({ task, handleTaskDragStart, handleTaskDragOver, handleTaskDrop, index, handleTaskDragEnd }) {
    return (
        <div
            className='mt-task-container'
            draggable // Permite arrastrar el elemento
            onDragStart={(event) => handleTaskDragStart(event, index, task)} // Maneja el inicio del arrastre
            onDragOver={(event) => handleTaskDragOver(event, index, task.id)} // Maneja el evento cuando el elemento es arrastrado sobre otro
            onDrop={handleTaskDrop} // Maneja el evento cuando se deja caer el elemento
            onDragEnd={handleTaskDragEnd} // Maneja el final del arrastre
            id={task.id}
        >
            <p>{task.name}</p>{/* Muestra el nombre de la tarea */}
            <TaskOptions/>
        </div>
    );
}

// Componente que representa una tarea "fantasma" (es decir, una vista previa del lugar donde se podría soltar una tarea)
function GhostTask({ task, activeGhostTask, listId, dragTaskData }) {

    const [ghostTaskName, setGhostTaskName] = useState('Tarea')

    useEffect(() => {
        if (activeGhostTask.active) {
            setGhostTaskName(dragTaskData.task.name)
        }
    }, [activeGhostTask])

    // Solo muestra la tarea fantasma si las condiciones son correctas
    if (task.id === -100 && activeGhostTask.listId === listId && activeGhostTask.active) {
        return (
            <div className='mt-task-container ghost'>
                <p>{ghostTaskName}</p>
            </div>
        );
    }
}

// Componente principal que maneja una lista de tareas
function Task({ listId, listIndex, tasks }) {
    // Accede al contexto de datos de la aplicación para obtener y actualizar los datos globales
    const { appData, setAppData } = useContext(AppDataContext);


    // Accede al contexto de arrastre para obtener y actualizar el estado relacionado con el arrastre
    const {
        draggedTaskIndex,
        setDraggedTaskIndex,
        setDragTaskData,
        dragTaskData,
        setDraggedTask,
        activeGhostTask,
        setActiveGhostTask
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
        setDragTaskData({ fromListId: listId, fromListIndex: listIndex, task }); // Establece los datos del arrastre
        event.dataTransfer.effectAllowed = 'move'; // Permite el movimiento del elemento
        setDraggedTaskIndex(index); // Actualiza el índice de la tarea arrastrada
        setDraggedTask(true); // Marca que una tarea está siendo arrastrada
    };

    // Devuelve el area permitida para el over del drag and drop 
    const areaDragOver = async (taskId, event, area) => {
        let inArea = false

        const dropArea = document.getElementById(taskId)

        // Obtener las coordenadas del área de destino
        const rect = dropArea.getBoundingClientRect();
        const offsetY = event.clientY - rect.top;

        // Obtener la altura del área de drop
        const dropAreaHeight = rect.height;

        // Definir el rango de aceptación de 40px en el centro
        const acceptanceRange = area;
        const rangeStart = (dropAreaHeight - acceptanceRange) / 2;
        const rangeEnd = rangeStart + acceptanceRange;

        // Verificar si la posición está dentro del rango específico
        if (offsetY >= rangeStart && offsetY <= rangeEnd) {
            //dropArea.style.border = '2px dashed green'; // Estilo para indicar que el drop es aceptado
            inArea = true
        }

        return inArea
    }
    // Maneja el evento de arrastre sobre una tarea
    const handleTaskDragOver = async (event, taskIndex, taskId) => {
        
        // Estimamos el area permitida para el over en la tarea (ontrola un bug al hacer el cambio de posición de las tarea)
        let inArea = await areaDragOver(taskId, event, 40)

        // Si el Drop es en los 40px del centro de la tarea
        if (inArea) {
            // Permite el drop en la lista actual solo si el arrastre se origina en la misma lista
            if (listId === dragTaskData.fromListId) {
                setActiveGhostTask({ active: false, listId: null, index: null }); // Desactiva la tarea fantasma
                // Solo mueve la tarea si el índice cambia y no es la misma tarea
                if (draggedTaskIndex !== null && taskIndex !== draggedTaskIndex) {
                    // Realiza una solicitud para mover la tarea
                    let data = await taskCrud(
                        appData,
                        {
                            type: 'MOVE_TASK',
                            listId,
                            fromIndex: draggedTaskIndex,
                            toIndex: taskIndex
                        });
                    await setAppData(data); // Actualiza los datos de la aplicación
                    setDraggedTaskIndex(taskIndex); // Actualiza el índice de la tarea arrastrada
                }
            }

            // Si la tarea fantasma está activo y en la misma lista, mueve la tarea fantasma
            if (activeGhostTask.active === true && listId === activeGhostTask.listId) {
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

    const handleTaskDrop = async (event) => {

        event.preventDefault(); // Previene el comportamiento por defecto del drop
    }

    // Maneja el evento de soltar la tarea
    const handleTaskDragEnd = async (event) => {
        event.target.style.opacity = "1"; // Restaura la opacidad del elemento
        console.log("Hacemos el drag end")
        if (activeGhostTask.active) {
            let data = await taskCrud(
                appData,
                {
                    type: 'TASK_TO_ANOTHER_LIST',
                    fromListIndex: dragTaskData.fromListIndex,
                    toListIndex: activeGhostTask.toListIndex,
                    task: dragTaskData.task,
                })
            await setAppData(data)
        }
        setDraggedTask(false); // Marca que el arrastre ha terminado
        setDraggedTaskIndex(null); // Resetea el índice de la tarea arrastrada
        setDragTaskData(undefined)


        setActiveGhostTask({ active: false, listId: null, isDropOtherList: false, toListIndex: null }); // Desactiva la tarea fantasma
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
                            handleTaskDrop={handleTaskDrop}
                            handleTaskDragEnd={handleTaskDragEnd}
                            index={index}
                        />
                    ) : (
                        <GhostTask
                            task={task}
                            activeGhostTask={activeGhostTask}
                            listId={listId}
                            dragTaskData={dragTaskData}
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
