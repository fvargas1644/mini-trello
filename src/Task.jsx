import React, { useState, useContext, useEffect} from "react"
import './styles/Task.css'
import taskCrud from "./taskCrud.jsx";
import AddTask from "./AddTask.jsx";
import {AppDataContext, DragDataContext} from './AppContext.jsx'

function Task(props) {

    const  {appData, setAppData } = useContext(AppDataContext);

    // Estado local para manejar el índice del ítem que se está arrastrando
    const {
        draggedTaskIndex,
        setDraggedTaskIndex, 
        dragTaskData, 
        setDragTaskData, 
        draggedTask, 
        setDraggedTask
    } = useContext(DragDataContext);


    useEffect(()=>{
        if(dragTaskData !== undefined){
            if(draggedTask){
                let task = document.getElementById(dragTaskData.task.id)
                task.style.opacity = "0.08";
            } else {
                let task = document.getElementById(dragTaskData.task.id)
                task.style.opacity = "1";
            }
        }
        
    }, [draggedTask, dragTaskData])

    const handleTaskDragStart = async (event, index, task) => {

        let cloneTask = document.getElementById("Drag")

        if(cloneTask !== null) {
            await document.body.removeChild(cloneTask)
        }

        let clone = event.target.cloneNode(true)
        clone.id = "Drag"
        setDragTaskData({fromListId: props.listId, fromListIndex: props.listIndex, task})
        document.body.appendChild(clone)

    
        // Permite el movimiento
        event.dataTransfer.effectAllowed = 'move';

        // Usa ese elemeto para crear la imagen arrastrable
        event.dataTransfer.setDragImage(clone, 0, 0)

        // Reduce la opacidad del elemento container de list
        event.target.style.opacity = "0.08";
    
        // Actualiza el estado local con el índice de la tarea arrastrada
        setDraggedTaskIndex(index);
        setDraggedTask(true)
    }

    const handleTaskDragOver = async (event, targetIndex) => {
        

        // Si hay un ítem arrastrado y se está pasando sobre una lista diferente
        if (draggedTaskIndex !== null && targetIndex !== draggedTaskIndex) {

            let data = await taskCrud(
                appData, 
                {
                    type: 'MOVE_TASK', 
                    listId: props.listId, 
                    fromIndex: draggedTaskIndex, 
                    toIndex: targetIndex
                })

            await setAppData(data)
            // Actualiza el índice de la lista arrastrada
            setDraggedTaskIndex(targetIndex);
        }
    }

    const handleTaskDrop = async (event) => {

        

        console.log("termi")
        
        event.preventDefault(); // Necesario para permitir el drop

        event.target.style.opacity = "1";

        let cloneTask = document.getElementById("Drag")
        if(cloneTask !== null) {
            document.body.removeChild(cloneTask)
        }

        setDraggedTaskIndex(null);// Resetea el estado del ítem arrastrado
        
       
    }
    const handleTaskEnd = () => {
    props.iniHanDragEndTask()}
    return (
        <section className='mt-task-section' 
        //onDragOver={(event)=>handleTaskDropOverOtherList(event)}
        //onDrop={(event)=>handleTaskDropOtherList(event)}
        id={props.listId}
        >
            {props.tasks.map((task, index)=>(
                <React.Fragment key={task.id}>
                    <div 
                        className='mt-task-container'
                        draggable
                        onDragStart={(event) => handleTaskDragStart(event, index, task)} // Maneja el inicio del arrastre
                        onDragOver={(event) => handleTaskDragOver(event, index)} // Maneja el arrastre sobre el contenedor
                        onDrop={handleTaskDrop} // Maneja el evento de soltar
                        onDragEnd={handleTaskEnd} // Maneja el evento de fin del arrastre
                        id={task.id}
                    >
                        {task.name}
                    </div>
                </React.Fragment>
            ))}
            <AddTask 
                listId={props.listId}
            />
        </section>
    )
}

export default Task;