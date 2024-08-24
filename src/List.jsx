import './styles/list.css'

function List(){

    function handleLocalStorage(e, state = localStorage.getItem('appData')) {
        state = JSON.parse(state)
        console.log(state)
    }

    return(
        <>
            <p>En list</p>
            <button onClick={handleLocalStorage}>Mostrar el local Storage</button>
        </>
    )

}

export default List;