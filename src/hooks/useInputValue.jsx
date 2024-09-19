import {useState} from 'react'

export function useInputValue({inputValue= ''}){
    // Estado local para almacenar el valor del input
    const [newInputValue, setNewInputValue] = useState(inputValue);

    // Función para manejar los cambios en el input de nueva lista
    const change = (event) => setNewInputValue(event.target.value);
    const resetInput = () => setNewInputValue('')

    return {newInputValue, change, resetInput}
}