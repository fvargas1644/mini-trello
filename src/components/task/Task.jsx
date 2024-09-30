import React, {  useEffect } from "react";
import AddTask from "./AddTask.jsx";
import '../../styles/Task.css';
import TaskOptions from "./TaskOptions.jsx";
import { useGhostTask } from "../../hooks/task/useGhostTask.jsx";

// hooks para manejar la lógica del componente
import { useTask } from '../../hooks/task/useTask.jsx';

// Componente que representa una tarea visible en la interfaz
function RealTask({ task, index, listId, listIndex, tasks }) {

    // Recupera los metodos necesarios para la lógica del customHook del componente
    const { taskDragStart, taskDragOver, taskDragEnd, taskAnimationEnd } = useTask({ listId, listIndex, tasks })

    return (
        <div
            className='mt-task-container'
            draggable // Permite arrastrar el elemento
            onDragStart={(event) => taskDragStart(event, index, task)} // Maneja el inicio del arrastre
            onDragOver={(event) => taskDragOver(event, index, task.id)} // Maneja el evento cuando el elemento es arrastrado sobre otro
            onDrop={(event) => event.preventDefault()} // Maneja el evento cuando se deja caer el elemento
            onDragEnd={(event) => taskDragEnd(event)} // Maneja el final del arrastre
            onAnimationEnd={(event) => taskAnimationEnd(event, task.id)} // Maneja el fin de la animación
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
function GhostTask({ task, listId }) {

    const ghostTask = useGhostTask({task, listId})

    // Solo muestra la tarea fantasma si las condiciones son correctas
    if (ghostTask.checkGhostTask) {
        return (
            <div className='mt-task-container ghost'>
                <div className="mt-list-taskName">
                    <p>{ghostTask.name}</p>
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

    // Efecto que asegura que siempre haya una tarea fantasma en la lista
    useEffect(() => {
        // Verifica si ya hay una tarea fantasma en la lista
        if (tasks.findIndex(task => task.id === -100) === -1) {
            // Si no hay, agrega una tarea fantasma al principio de la lista
            tasks.unshift({ id: -100, name: "Tarea", isVisible: false });
        }
    }, []); // El array vacío asegura que esto solo se ejecute una vez al montar el componente

    return (
        <section className='mt-task-section'>
            {/* Mapea sobre las tareas y renderiza el componente adecuado */}
            {tasks.map((task, index) => (
                <React.Fragment key={task.id}>
                    {task.isVisible ? (
                        <RealTask
                            task={task}
                            index={index}
                            listId={listId}
                            listIndex={listIndex}
                            tasks={tasks}
                        />
                    ) : (
                        <GhostTask
                            task={task}
                            listId={listId}
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
