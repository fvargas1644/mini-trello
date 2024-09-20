import {useState} from 'react'

export function useInputValue({InitialValue= ''}){
    // Estado local para almacenar el valor del input
    const [value, setValue] = useState(InitialValue);

    // Función para manejar los cambios en el input de nueva lista
    const onChange = (event) => setValue(event.target.value);
    const resetValue = () => setValue('')

    return {value, onChange, resetValue}
}