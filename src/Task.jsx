import React, { useState } from "react"
import './styles/Task.css'

function Task(props) {
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
                        //onDragStart={(event) => handleTaskDragStart(event, index)} // Maneja el inicio del arrastre
                        //onDragOver={(event) => handleTaskDragOver(event, index)} // Maneja el arrastre sobre el contenedor
                        //onDrop={handleTaskDrop} // Maneja el evento de soltar
                        //onDragEnd={handleTaskDrop} // Maneja el evento de fin del arrastre
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