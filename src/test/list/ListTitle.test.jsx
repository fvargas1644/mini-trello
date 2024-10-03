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

    test('Should the heading be visible', ()=>{
        expect(screen.getByRole('heading')).not.toHaveClass('is-hidden');
    });

    test('Should the textbox be hidden', ()=>{
        expect(screen.getByRole('textbox')).toHaveClass('is-hidden');
    });

    test('Should the value in the textbox match the name of the list', async () => {
        expect(screen.getByRole('textbox')).toHaveValue(listName);
    });

    test('Should toggle the visibility between the text box and the heading when you click on the container', async () => {
        await fireEvent.click(containerComponent.querySelector('.mt-list-header-listName'));

        expect(screen.getByRole('textbox')).not.toHaveClass('is-hidden');
        expect(screen.getByRole('heading')).toHaveClass('is-hidden');
    });

    test('Should the value of the textbox be the same as the value of the list name when toggling visibility', async () => {
        await fireEvent.click(containerComponent.querySelector('.mt-list-header-listName'));

        expect(screen.getByRole('textbox')).not.toHaveClass('is-hidden');
        expect(screen.getByRole('heading')).toHaveClass('is-hidden');
        expect(screen.getByRole('textbox')).toHaveValue(listName);

    });

    test('Should the user be able to change value textbox',async ()=>{
        await fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Nuevo texto' } });
        expect(screen.getByRole('textbox').value).toBe('Nuevo texto');
    });
});