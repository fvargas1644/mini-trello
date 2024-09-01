import { useState, useContext } from "react"
import taskCrud from "./taskCrud"
import {AppDataContext} from './AppContext.jsx'

function AddTask(props) {

    const { appData, setAppData } = useContext(AppDataContext);

    const [newTaskInputValue, setNewTaskInputValue] = useState('')

    const handleNewTaskInputChange = (event) =>setNewTaskInputValue(event.target.value)

    const handleAddTask = async () => {
        if (newTaskInputValue !== ''){
            
            let data = await taskCrud(appData, {type: 'CREATE_TASK', listId: props.listId, newTaskName:  newTaskInputValue})

            await setNewTaskInputValue('')
            setAppData(data)
 
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