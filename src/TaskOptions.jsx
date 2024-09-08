import { useState } from "react"

function TaskOptions() {

    const [isVisibleMenuOptions, setIsVisibleMenuOptions] = useState(false)

    const menuOptionsClassName = isVisibleMenuOptions ? 'mt-task-menuOptions is-visible' : 'mt-task-menuOptions'
    const isActiveButtonOptionsTask = isVisibleMenuOptions ? 'is-active' : '' 

    const handleOptionsTask = () => {
        setIsVisibleMenuOptions(!isVisibleMenuOptions)
    }

    return (
        <div className="mt-task-sectionOptions ">
            <button onClick={handleOptionsTask} className={isActiveButtonOptionsTask}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 iconOptions">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                </svg>
            </button>
            <span>
                <ul className={menuOptionsClassName}>
                    <li>Editar</li>
                    <li>Eliminar</li>
                </ul>
            </span>
            
        </div>
        
    )
}

export default TaskOptions;