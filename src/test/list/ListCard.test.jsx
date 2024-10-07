import { beforeEach, describe, expect, test } from "vitest";
import ListCard from "../../components/list/ListCard.jsx";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { AppDataContext, DragDataContext } from '../../context/AppContext.jsx';

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

describe('ListCard', () => {
    let containerComponent;
    let listIndex = 0;

    beforeEach(() => {
        setAppDataMock.mockClear();
        setDragDataMock.mockClear();

        const renderResul = render(
            <AppDataContext.Provider value={appDataContextMock}>
                <DragDataContext.Provider value={dragDataContextMock}>
                    <ListCard listId={listId} listIndex={listIndex}>
                        <h1>Children</h1>
                    </ListCard>
                </DragDataContext.Provider>
            </AppDataContext.Provider>
        );

        containerComponent = renderResul.container;
    });

    test('Should be a article', () => {
        expect(containerComponent.querySelector('.mt-list-container')).toBeInTheDocument();
    });

    test('Should the child be redered', () => {
        expect(screen.getByText('Children')).toBeInTheDocument();
    });

    test('', async ()=>{
        //await fireEvent.animationEnd(containerComponent.querySelector('.mt-list-container'));
        //expect(setAppDataMock).toBeCalled();
    });

    test('', async ()=>{

        let dataDrag = {
            updateDragData: setDragDataMock,
            dragData: {
                draggedTaskIndex: 1,
                dragTaskData: undefined,
                draggedTask: false,
                draggedListIndex: null, 
                dragItemType: 'list', 
                activeGhostTask: { 
                    active: false,
                    listId: null,
                    toListIndex: null,
                }
            }
        }

        await render(
            <AppDataContext.Provider value={appDataContextMock}>
                <DragDataContext.Provider value={dataDrag}>
                    <ListCard listId={listId} listIndex={listIndex}>
                        <h1>Children</h1>
                    </ListCard>
                </DragDataContext.Provider>
            </AppDataContext.Provider>
        );

        await fireEvent.dragOver(containerComponent.querySelector('.mt-list-container'));

        //expect(setDragDataMock).toBeCalled();
    });
});