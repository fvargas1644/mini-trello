import { beforeEach, describe, expect, test } from "vitest";
import ListCard from "../../components/list/ListCard.jsx";
import { render, screen, fireEvent, act, renderHook } from "@testing-library/react";
import { AppDataContext, DragDataContext } from '../../context/AppContext.jsx';
import { useListCard } from "../../hooks/list/useListCard.jsx";

const setAppDataMock = vi.fn();
const setDragDataMock = vi.fn();
const listId = "10624567-e89b-12d3-a456-42661417g312";
const listName = "Tareas para el día de mañana";
const appData = {
    lists: [
        {
            "id": listId,
            "name": listName,
            "isVisible": true,
            "tasks": [
                { "id": "567e4567-e89b-12d3-a456-426614174192", "name": "Terminar informe", "isVisible": true },
                { "id": "127e4567-e89b-12d3-a456-426614174129", "name": "Hacer ejercicio después de las 4 PM", "isVisible": true }
            ]
        },
        {
            "id": "123e4567-e89b-12d3-a456-426614174000",
            "name": "Tareas del proyecto de MiniTrello",
            "isVisible": true,
            "tasks": [
                { "id": "123e4567-e89b-12d3-a456-426614174001", "name": "Subir nuestra aplicación a la nube", "isVisible": true },
                { "id": "123e4567-e89b-12d3-a456-426614174002", "name": "Actualizar los datos por defecto de la app", "isVisible": true },
                { "id": "128e4567-e89b-12d3-a456-426614171726", "name": "Crear un artículo relacionado a este proyecto", "isVisible": true }
            ]
        }
    ]
}

const appDataContextMock = {
    setAppData: setAppDataMock,
    appData
}


const dragDataContextMock = {
    updateDragData: setDragDataMock,
    dragData: {
        draggedTaskIndex: null,
        dragTaskData: undefined,
        draggedTask: false,
        draggedListIndex: null,
        dragItemType: null,
        activeGhostTask: {
            active: false,
            listId: null,
            toListIndex: null,
        }
    }
}

// Mock Setup
const renderListCard = (listId, listIndex) => {
    return render(
        <AppDataContext.Provider value={appDataContextMock}>
            <DragDataContext.Provider value={dragDataContextMock}>
                <ListCard listId={listId} listIndex={listIndex}>
                    <h1>Children</h1>
                </ListCard>
            </DragDataContext.Provider>
        </AppDataContext.Provider>
    );
};

describe('ListCard', () => {
    let containerComponent;
    let listIndex = 0;

    beforeEach(() => {
        setAppDataMock.mockClear();
        setDragDataMock.mockClear();

        containerComponent = renderListCard(listId, listIndex).container;
    });

    test('Should be a article', () => {
        expect(containerComponent.querySelector('.mt-list-container')).toBeInTheDocument();
    });

    test('Should the child be redered', () => {
        expect(screen.getByText('Children')).toBeInTheDocument();
    });

});



describe('useListCard', () => {
    let wrapper;

    beforeEach(() => {
        setAppDataMock.mockClear();
        setDragDataMock.mockClear();

        wrapper = ({ children }) =>
            <AppDataContext.Provider value={appDataContextMock}>
                <DragDataContext.Provider value={dragDataContextMock}>
                    {children}
                </DragDataContext.Provider>
            </AppDataContext.Provider>
    });

    let listIndex = 0;
    test('Should set list visibility to false when listAnimationEnd is called with animationName "list-fade-out"', async () => {
        const { result } = renderHook(() => useListCard({ listId, listIndex }), { wrapper });
        const event = {
            animationName: 'list-fade-out'
        }

        await act(() => {
            result.current.listAnimationEnd(event)
        });

        expect(setAppDataMock).toHaveBeenCalledWith(expect.objectContaining({
            lists: expect.arrayContaining([
                expect.objectContaining({ id: listId })
            ])
        }));

        expect(setAppDataMock).toHaveBeenCalledWith(expect.objectContaining({
            lists:  appData.lists.map(list => list.id ===listId? {...list, isVisible: false}: list)
        }));
    });

    test('Should update list positions when listDragOver is called with valid dragData', async ()=>{

        // Iniciamos con nuevos datos validos del dragData para permitir el cambio de posición de la posición index 0 a la 1
        const dragDataContextMockTest = {
            updateDragData: setDragDataMock,
            dragData: {
                draggedTaskIndex: null,
                dragTaskData: undefined,
                draggedTask: false,
                dragItemType: 'list', // Tiene que ser 'list' para permitir el cambio de posición de las listas
                draggedListIndex: 1, // Tiene que ser diferente del index de la lista actual que en este caso es 0
                activeGhostTask: {
                    active: false,
                    listId: null,
                    toListIndex: null,
                }
            }
        }

        wrapper = ({ children }) =>
            <AppDataContext.Provider value={appDataContextMock}>
                <DragDataContext.Provider value={dragDataContextMockTest}>
                    {children}
                </DragDataContext.Provider>
            </AppDataContext.Provider>
        
        const { result } = renderHook(() => useListCard({ listId, listIndex }), { wrapper });

        const event = {
            preventDefault: vi.fn()
        }

        await act(() => {
            result.current.listDragOver(event)
        });

        expect(setAppDataMock).toHaveBeenCalledWith(expect.objectContaining({
            lists: expect.arrayContaining([
                expect.objectContaining({ id: listId })
            ])
        }));

        // Comprobamos si las listas cambian de posición 
        expect(setAppDataMock).toHaveBeenCalledWith({
            lists: [
                // La lista en la posición 0 cambio a 1 y la lista de posición 1 cambio a 0
                appData.lists[1],
                appData.lists[0]
            ]
        });
    });
});