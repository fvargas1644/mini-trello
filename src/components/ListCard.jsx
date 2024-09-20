// hooks para manejar la lógica del componente
import { useListCard } from '../hooks/useListCard.jsx';

function ListCard({ listId, children, listIndex }) {

    const {listAnimationEnd, listDragOver} = useListCard()

    // Maneja el evento cuando termina la animación de la lista
    const handleListAnimationEnd = (event) => listAnimationEnd(event, listId)
    
    // Maneja el evento cuando un ítem arrastrado pasa sobre otro ítem
    const handleListDragOver = (event) => listDragOver(event, listIndex, listId)

    // dragleave

    // Maneja el evento cuando el ítem es soltado en la lista
    const handleDrop = async (event) => event.preventDefault(); // Necesario para permitir el drop

    return (
        <article 
            onDragOver={(event) => handleListDragOver(event)} // Maneja el evento de arrastre sobre el área
            onDrop={(event) => handleDrop(event)} // Maneja el evento cuando el ítem es soltado
            className='mt-list-container' // Clase CSS para el estilo del contenedor
            onAnimationEnd={(event) => handleListAnimationEnd(event)} // Maneja el fin de la animación
        >
            {children} {/* Renderiza los elementos secundarios dentro del contenedor */}
        </article>
    );
}

export default ListCard; // Exporta el componente para su uso en otras partes de la aplicación
