import React, { useState } from "react"
import './styles/Task.css'
import taskCrud from "./taskCrud.jsx";
import AddTask from "./AddTask.jsx";

function Task(props) {


    // Estado local para manejar el índice del ítem que se está arrastrando
    const [draggedTaskIndex, setDraggedTaskIndex] = useState(null);

    const handleTaskDragStart = (event, index, task) => {

        let clone = event.target.cloneNode(true)
        clone.id = "Drag"
        clone.data = {fromListId: props.listId, fromListIndex: props.listIndex, task}
        document.body.appendChild(clone)
    
        // Permite el movimiento
        event.dataTransfer.effectAllowed = 'move';

        // Usa ese elemeto para crear la imagen arrastrable
        event.dataTransfer.setDragImage(clone, 120, 10)

        // Reduce la opacidad del elemento container de list
        event.target.style.opacity = "0.08";
    

        // Actualiza el estado local con el índice de la tarea arrastrada
        setDraggedTaskIndex(index);
    }

    const handleTaskDragOver = async (event, targetIndex) => {
        
        event.preventDefault(); // Necesario para permitir el drop

        console.log(draggedTaskIndex)
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
        setDraggedTaskIndex(null);// Resetea el estado del ítem arrastrado

        event.target.style.opacity = "1";

        let cloneTask = document.getElementById("Drag")
        if(cloneTask !== null) {
            document.body.removeChild(cloneTask)
        }
        
       
    }

    const handleTaskDropOverOtherList= async (event) => {
        event.preventDefault(); // Necesario para permitir el drop

        let cloneTask = document.getElementById("Drag")

        if(cloneTask!== null){
            if(props.listId !== cloneTask.data.fromListId ){
                //await setDraggedTaskIndex(0)
                console.log(cloneTask.data.task)
                let data = await taskCrud({ 
                    type: 'TASK_TO_ANOTHER_LIST', 
                    fromListIndex: cloneTask.data.fromListIndex, 
                    task: cloneTask.data.task,
                    toListId: props.listId
                })
                await props.initialHandleUpdateLocalStorage(data)
    
                cloneTask.data.fromListId =  props.listId 
                cloneTask.data.fromListIndex =  props.listIndex    
    
            }  
        }
         
    }

    const handleTaskDropOtherList = (event) => {
        event.preventDefault(); // Necesario para permitir el drop
        setDraggedTaskIndex(null);
        let cloneTask = document.getElementById("Drag")
        if(cloneTask !== null) {
            document.body.removeChild(cloneTask)
        }
        
    }

    return (
        <section className='mt-task-section' 
        onDragOver={(event)=>handleTaskDropOverOtherList(event)}
        onDrop={(event)=>handleTaskDropOtherList(event)}
        >
            {props.listIndex}
            {props.tasks.map((task, index)=>(
                <React.Fragment key={task.id}>
                    <div 
                        className='mt-task-container'
                        draggable
                        onDragStart={(event) => handleTaskDragStart(event, index, task)} // Maneja el inicio del arrastre
                        onDragOver={(event) => handleTaskDragOver(event, index)} // Maneja el arrastre sobre el contenedor
                        onDrop={handleTaskDrop} // Maneja el evento de soltar
                        onDragEnd={handleTaskDrop} // Maneja el evento de fin del arrastre
                    >
                        {task.name}
                    </div>
                </React.Fragment>
            ))}
            <AddTask 
                listId={props.listId}
                initialHandleUpdateLocalStorage={props.initialHandleUpdateLocalStorage}
            />
        </section>
    )
}

export default Task;