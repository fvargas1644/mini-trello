import { useState } from "react"
import taskCrud from "./taskCrud"

function AddTask(props) {

    const [newTaskInputValue, setNewTaskInputValue] = useState('')

    const handleNewTaskInputChange = (event) =>setNewTaskInputValue(event.target.value)

    const handleAddTask = async () => {
        if (newTaskInputValue !== ''){
            
            let data = await taskCrud({type: 'CREATE_TASK', listId: props.listId, newTaskName:  newTaskInputValue})

            await setNewTaskInputValue('')
            props.initialHandleUpdateLocalStorage(data)
 
        }
    }

    return (
        <div>
            <input 
                placeholder='Nombre de la tarea'
                value={newTaskInputValue}
                onChange={handleNewTaskInputChange}
            />
            <button onClick={handleAddTask}>Add</button>
        </div>
    )
}

export default AddTask;