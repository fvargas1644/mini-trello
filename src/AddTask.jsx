import { useState, useContext } from "react"
import taskCrud from "./taskCrud"
import { AppDataContext } from './AppContext.jsx'
import './styles/AddTask.css'

function AddTask({ listId }) {

    const { appData, setAppData } = useContext(AppDataContext);

    const [newTaskInputValue, setNewTaskInputValue] = useState('')

    const handleNewTaskInputChange = (event) => setNewTaskInputValue(event.target.value)

    const handleAddTask = async () => {
        if (newTaskInputValue !== '') {

            let data = await taskCrud(appData, { type: 'CREATE_TASK', listId, newTaskName: newTaskInputValue })

            await setNewTaskInputValue('')
            setAppData(data)

        }
    }

    return (
        <div className="mt-addTask-container">
            <input
                placeholder='Nueva tarea'
                value={newTaskInputValue}
                onChange={handleNewTaskInputChange}
            />
            <button className="mt-addTask-buttonAdd" onClick={handleAddTask}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6 icon">
                    <path fillRule="evenodd" d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" />
                </svg>
            </button>
        </div>
    )
}

export default AddTask;