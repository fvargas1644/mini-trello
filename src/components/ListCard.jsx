// hooks para manejar la lógica del componente
import { useListCard } from '../hooks/useListCard.jsx';

function ListCard({ listId, children, listIndex }) {

    const {listAnimationEnd, listDragOver} = useListCard()

    return (
        <article 
            onDragOver={(event) => listDragOver(event, listIndex, listId)} // Maneja el evento de arrastre sobre el área
            onDrop={(event) => event.preventDefault()} // Maneja el evento cuando el ítem es soltado
            className='mt-list-container' // Clase CSS para el estilo del contenedor
            onAnimationEnd={(event) => listAnimationEnd(event, listId)} // Maneja el fin de la animación
        >
            {children} {/* Renderiza los elementos secundarios dentro del contenedor */}
        </article>
    );
}

export default ListCard; // Exporta el componente para su uso en otras partes de la aplicación
