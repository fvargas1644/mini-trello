import List from './components/list/List.jsx';
import AddList from './components/list/AddList.jsx';
import './styles/App.css';
import { AppDataProvider, DragDataProvider, } from './context/AppContext.jsx';
import AppTitle from './components/AppTitle.jsx';

// Componente principal de la aplicación
function App() {
    return (
        <AppDataProvider>{ /* Contexto de la APP*/}
            <AppTitle>
                Mini Trello - Drag and Drop
            </AppTitle>
            { /* Contexto de las funciones de arrastre en las tareas*/}
            <DragDataProvider>
                <section className='mt-list-section'>
                    {/* Renderizar el componente las Listas */}
                    <List />
                    {/* Renderizar el componente AddList para añadir nuevas listas */}
                    <AddList />
                </section>
            </DragDataProvider>
        </AppDataProvider>
    );
}

export default App;
