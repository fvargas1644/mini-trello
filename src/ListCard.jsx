import listCrud from "./listCrud.jsx";
import { useContext, useEffect } from "react";
import {AppDataContext, DragDataContext} from './AppContext.jsx';
import taskCrud from "./taskCrud.jsx";

function ListCard({listId, children, listIndex}) {

    const { appData, setAppData } = useContext(AppDataContext);

    // Estado local para manejar el índice del ítem que se está arrastrando
    const {draggedListIndex, setDraggedListIndex, dragItemType, draggedTask, dragTaskData, setDragTaskData} = useContext(DragDataContext);

   

    const handleListAnimationEnd = async (event) => {
        // Despacha la acción de ocultar la lista si la animación es de ocultar
        if (event.animationName === 'list-fade-out') {
            let data = await listCrud(appData, { type: 'TOGGLE_LIST_VISIBILITY', id: listId });
            setAppData(data)
        }
    }

    // Maneja el evento cuando el ítem arrastrado pasa sobre otro ítem
    const handleListDragOver = async (event) => {
        event.preventDefault(); // Necesario para permitir el drop

        if(dragItemType === 'list') {
            // Si hay un ítem arrastrado y se está pasando sobre una lista diferente
            if (draggedListIndex !== null && listIndex !== draggedListIndex) {
                let data = await listCrud(appData, { type: 'MOVE_LIST', fromIndex: draggedListIndex, toIndex: listIndex });
                setAppData(data)
                // Actualiza el índice de la lista arrastrada
                setDraggedListIndex(listIndex);
            }
        } else {
            if(draggedTask){
                if(listId !== dragTaskData.fromListId ){
                    
                    let data = await taskCrud(
                        appData,
                        { 
                            type: 'TASK_TO_ANOTHER_LIST', 
                            fromListIndex: dragTaskData.fromListIndex, 
                            task: dragTaskData.task,
                            toListId: listId
                        }
                    )
                    await setAppData(data)
                    
                    await setDragTaskData({...dragTaskData, fromListId: listId, fromListIndex: listIndex})
    
                }  
            }
        } 
    };

    const handleDrop = async (event) => {
        event.preventDefault(); // Necesario para permitir el drop
        console.log("termina")
        if(dragItemType === 'list') {

        } else {
            if(draggedTask) {
                let draggedTask = document.getElementById(dragTaskData.task.id)
                draggedTask.style.opacity = "1";
            }
    
            let cloneTask = document.getElementById("Drag")
            if(cloneTask !== null) {
                document.body.removeChild(cloneTask)     
            }
        }
                
        
    }

    return (
        <article 
            onDragOver={(event) => handleListDragOver(event)}
            onDrop={(event) => handleDrop(event)}
            className='mt-list-container'
            onAnimationEnd={(event) => handleListAnimationEnd(event)} // Maneja el fin de la animación
        >
            {children}
        </article>
    )
}

export default ListCard;