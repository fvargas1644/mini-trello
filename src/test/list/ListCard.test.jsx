import { beforeEach, describe, expect, test } from "vitest";
import ListCard from "../../components/list/ListCard.jsx";
import { render, screen, fireEvent, act, renderHook } from "@testing-library/react";
import { AppDataContext, DragDataContext } from '../../context/AppContext.jsx';
import { useListCard } from "../../hooks/list/useListCard.jsx";

const setAppDataMock = vi.fn();
const setDragDataMock = vi.fn();
const listId = "10624567-e89b-12d3-a456-42661417g312";
const listName = "Tareas para el día de mañana";

const appDataContextMock = {
    setAppData: setAppDataMock,
    appData: {
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
        wrapper = ({ children }) =>
            <AppDataContext.Provider value={appDataContextMock}>
                <DragDataContext.Provider value={dragDataContextMock}>
                    {children}
                </DragDataContext.Provider>
            </AppDataContext.Provider>
    });

    let listIndex = 0;
    test('Should ', async () => {
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

        expect(setAppDataMock).toHaveBeenCalledWith({
            lists: [
                {
                    "id": listId,
                    "name": listName,
                    "isVisible": false, // Cambio a false
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
        });
    });
});