import { beforeEach, describe, expect, test } from "vitest";
import { AppDataContext } from '../../context/AppContext.jsx';
import { render, screen, fireEvent,act } from "@testing-library/react";
import ListTitle from "../../components/list/ListTitle.jsx";

const setAppDataMock = vi.fn();
const listId = "10624567-e89b-12d3-a456-42661417g312";
const listName = "Tareas para el día de mañana";

const contextValueMock = {
    setAppData: setAppDataMock,
    appData: {
        lists:[
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

describe('ListTitle', ()=>{

    let containerComponent;

    beforeEach(()=>{
        setAppDataMock.mockClear();

        const renderResul = render(
            <AppDataContext.Provider value={contextValueMock}>
                <ListTitle listId={listId} listName={listName}/>
            </AppDataContext.Provider>
        );

        containerComponent = renderResul.container;
    });

    test('Should be a textbox', ()=>{
        expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    test('Should be a list title', ()=>{
        expect(screen.getByRole('heading')).toBeInTheDocument();
    });

    test('Should be a container', ()=>{
        expect(containerComponent.querySelector('.mt-list-header-listName')).toBeInTheDocument();
    });

    test('Should the list name be the same as the listName prop', ()=>{
        expect(screen.getByRole('heading')).toHaveTextContent(listName);
    });
});