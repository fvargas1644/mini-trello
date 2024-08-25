import React, { useEffect, useState } from 'react';
import initialAppData from './data/initialAppData.jsx';
import List from './List.jsx';
import AddList from './AddList.jsx';
import './styles/App.css';

// Componente principal de la aplicación
function App() {

    // Estado para almacenar los datos de la aplicación
    const [appData, setAppData] = useState(initialAppData);

    // Estado para manejar actualizaciones que deben reflejarse en el localStorage
    const [updateLocalStorage, setUpdateLocalStorage] = useState(null);

    // useEffect para cargar datos iniciales al montar el componente
    useEffect(() => {
        
        // Verificar si el localStorage tiene datos almacenados
        if (localStorage.getItem('appData') === null) {
            // Si no hay datos, se almacenan los datos por defecto
            localStorage.setItem('appData', JSON.stringify(initialAppData));
        } else {
            // Si hay datos en el localStorage, se cargan en el estado de la aplicación
            setAppData(JSON.parse(localStorage.getItem('appData')));
        }
    }, []);

    // useEffect para actualizar el estado y el localStorage cuando cambia updateLocalStorage
    useEffect(() => {
        if (updateLocalStorage !== null) {
            // Actualizar el estado de la aplicación con los nuevos datos
            setAppData(updateLocalStorage);
            // También actualizar el localStorage con los nuevos datos
            localStorage.setItem('appData', JSON.stringify(updateLocalStorage));
        }
    }, [updateLocalStorage]);

    // Función para manejar actualizaciones del localStorage desde los componentes hijos
    const handleUpdateLocalStorage = (data) => setUpdateLocalStorage(data);

    return (
        <>
            <section className='mt-list-section'>
                <List
                    appData={appData}
                    initialHandleUpdateLocalStorage={handleUpdateLocalStorage} // Pasar la función para actualizar localStorage
                />
                {/* Renderizar el componente AddList para añadir nuevas listas */}
                <AddList initialHandleUpdateLocalStorage={handleUpdateLocalStorage} />
            </section>
        </>
    );
}

export default App;
