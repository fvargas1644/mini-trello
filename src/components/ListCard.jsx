// hooks para manejar la lógica del componente
import { useListCard } from '../hooks/useListCard.jsx';

function ListCard({ listId, children, listIndex }) {

    // Recupera los metodos necesarios para la lógica del customHook del componente
    const {listAnimationEnd, listDragOver} = useListCard({ listId, listIndex })

    return (
        <article 
            onDragOver={(event) => listDragOver(event)} // Maneja el evento de arrastre sobre el área
            onDrop={(event) => event.preventDefault()} // Maneja el evento cuando el ítem es soltado
            className='mt-list-container' // Clase CSS para el estilo del contenedor
            onAnimationEnd={(event) => listAnimationEnd(event)} // Maneja el fin de la animación
        >
            {children} {/* Renderiza los elementos secundarios dentro del contenedor */}
        </article>
    );
}

export default ListCard; // Exporta el componente para su uso en otras partes de la aplicación
