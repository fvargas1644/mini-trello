import React, { useState } from "react"
import './styles/Task.css'
import taskCrud from "./taskCrud.jsx";

function Task(props) {

    // Estado local para manejar el índice del ítem que se está arrastrando
    const [draggedTaskIndex, setDraggedTaskIndex] = useState(null);

    async function handleTaskDragStart(event, index) {

        let clone = event.target.cloneNode(true)
        console.log(clone)

        clone.id = "Drag"

        clone.data = {fromListId: props.listId, fromListIndex: props.listIndex}

        document.body.appendChild(clone)
    
        // Permite el movimiento
        event.dataTransfer.effectAllowed = 'move';
    

        // Actualiza el estado local con el índice de la tarea arrastrada
        setDraggedTaskIndex(index);
    }

    const handleTaskDragOver = async (event, targetIndex) => {
        
        event.preventDefault(); // Necesario para permitir el drop

        // Si hay un ítem arrastrado y se está pasando sobre una lista diferente
        if (draggedTaskIndex !== null && targetIndex !== draggedTaskIndex) {

            let data = await taskCrud({type: 'MOVE_TASK', listId: props.listId, fromIndex: draggedTaskIndex, toIndex: targetIndex})
            await props.initialHandleUpdateLocalStorage(data)
            // Actualiza el índice de la lista arrastrada
            setDraggedTaskIndex(targetIndex);
        }
    }

    const handleTaskDrop = (event) => {
        
        event.preventDefault(); // Necesario para permitir el drop

        // Resetea el estado del ítem arrastrado
        setDraggedTaskIndex(null);
        
       
    }

    return (
        <section className='mt-task-section' 
        //onDragOver={(event)=>handleTaskDropOverOtherList(event)}
        //onDrop={(event)=>handleTaskDropOtherList(event, props.listId)}
        >
            {props.listIndex}
            {props.tasks.map((task, index)=>(
                <React.Fragment key={task.id}>
                    <div 
                        className='mt-task-container'
                        draggable
                        onDragStart={(event) => handleTaskDragStart(event, index)} // Maneja el inicio del arrastre
                        onDragOver={(event) => handleTaskDragOver(event, index)} // Maneja el arrastre sobre el contenedor
                        onDrop={handleTaskDrop} // Maneja el evento de soltar
                        onDragEnd={handleTaskDrop} // Maneja el evento de fin del arrastre
                    >
                        {task.name}
                    </div>
                </React.Fragment>
            ))}
            <div>
            </div>
        </section>
    )
}

export default Task;