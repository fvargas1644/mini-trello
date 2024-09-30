import { useContext } from 'react';
import { DragDataContext } from '../../context/AppContext.jsx'

export function useList(){

    // Accede al contexto de datos de arrastre, que maneja el estado del ítem que se está arrastrando
    const { updateDragData } = useContext(DragDataContext);

    const listDragStart = (event, index) => {

        updateDragData({
            draggedListIndex: index, // Actualiza el estado local con el índice de la lista arrastrada
            dragItemType: 'list' // Establece el tipo de ítem arrastrado como 'list'
        })

        // Obtiene el elemento padre contenedor de la lista
        let listContainer = event.target.closest('.mt-list-container');

        // Crea una imagen arrastrable para representar el ítem arrastrado en el cursor
        event.dataTransfer.setDragImage(listContainer, 120, 10);

        // Reduce la opacidad del contenedor de la lista durante el arrastre para dar retroalimentación visual
        listContainer.style.opacity = "0.08";
        
        // Permite el movimiento del elemento arrastrado
        event.dataTransfer.effectAllowed = 'move';
    };

    const listDragEnd = (event) => {
        event.preventDefault(); // Necesario para permitir el drop

        // Restaura la opacidad del contenedor de la lista después del arrastre
        event.target.closest('.mt-list-container').style.opacity = "1";

        // Resetea el estado del ítem arrastrado
        updateDragData({
            draggedListIndex: null, // Actualiza el estado global con el índice de la lista arrastrada
            dragItemType: null
        })
    }

    return {listDragStart, listDragEnd}
}