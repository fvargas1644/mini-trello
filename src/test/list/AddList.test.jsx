import { fireEvent, render, screen,act } from "@testing-library/react";
import { beforeEach, describe, expect, test } from "vitest";
import AddList from "../../components/list/AddList.jsx";
import { AppDataContext } from '../../context/AppContext.jsx';
import '@testing-library/jest-dom';


const setAppDataMock = vi.fn()

const contextValueMock = {
    setAppData: setAppDataMock,
    appData: {lists:[]}
}

describe('AddList', ()=>{

    let containerComponent;

    beforeEach(()=>{        
        setAppDataMock.mockClear();
        //appDataMock.mockClear();
    
        const renderResul = render(
            <AppDataContext.Provider value={contextValueMock}>
                <AddList/>
            </AppDataContext.Provider>
        );
        containerComponent = renderResul.container;
    });

    test('Should be a new list button', ()=>{
        expect(screen.getByRole('button', {name: /Agregar lista/i})).toBeInTheDocument();
    });

    test('Should be a button to add items to the list', ()=>{
        expect(screen.getByRole('button', {name: /Add/i})).toBeInTheDocument();
    });

    test('Should be a textbox to add items to the list', ()=>{
        expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    test('Should be a exit button', ()=>{
        expect(screen.getByRole('button', {name: /X/i})).toBeInTheDocument();
    });

    test('Should see first the new list button ', ()=>{

        expect(screen.getByRole('button', {name: /Agregar lista/i})).toBeInTheDocument();

        expect(containerComponent.querySelector('.mt-addList-container')).not.toHaveClass('is-add');
    });

    test('Should show the textbox when the new list button is clicked',async ()=>{
        await fireEvent.click(screen.getByRole('button', {name: /Agregar lista/i}))

        expect(containerComponent.querySelector('.mt-addList-container')).toHaveClass('is-add');
        expect(screen.getByRole('button', {name: /Agregar lista/i})).not.toHaveClass('is-add');
    });

    test('Should the textbox be empty when first displayed', async ()=>{
        await fireEvent.click(screen.getByRole('button', {name: /Agregar lista/i}));
        expect(screen.getByRole('textbox')).toHaveValue('');   

    });

    test('Should the user be able to change value textbox',async ()=>{
        await fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Nuevo texto' } });
        expect(screen.getByRole('textbox').value).toBe('Nuevo texto');
    });

    test('Should close the container addList ',async ()=>{
        await fireEvent.click(screen.getByRole('button', {name: /X/i}));
        expect(screen.getByRole('textbox')).toHaveValue('');
        
        expect(containerComponent.querySelector('.mt-addList-container')).not.toHaveClass('is-add');
        expect(screen.getByRole('button', {name: /Agregar lista/i})).toHaveClass('is-add');
    });

    test('Should be cleaned the textbox when clicked Add list button', async () => {
        
        await fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Nuevo texto' } });
        
        await act(async () => {
            fireEvent.click(screen.getByRole('button', {name: /Add/i}));
        });
    
        expect(screen.getByRole('textbox').value).toBe('');
    });

    test('Should add a list when the Add button is clicked and the text box is not empty', async () => {
        const newListName = 'Nuevo texto';
        
        await fireEvent.change(screen.getByRole('textbox'), { target: { value: newListName } });
        
        await act(async () => {
            fireEvent.click(screen.getByRole('button', {name: /Add/i}));
        });
    
        expect(screen.getByRole('textbox').value).toBe('');
    
        expect(setAppDataMock).toBeCalled();
    
        // Verifica que setAppDataMock fue llamado con un objeto appData que tiene la nueva lista
        expect(setAppDataMock).toHaveBeenCalledWith({
            lists: expect.arrayContaining([expect.objectContaining({ name: newListName })])
        });
    });

    test('Should not add a list when the Add button is clicked and the text box is empty',async ()=>{

        await fireEvent.change(screen.getByRole('textbox'), { target: { value: '' } }); 
        
        await act( async ()=>{
            fireEvent.click(screen.getByRole('button', {name: /Add/i}));
        })
        expect(screen.getByRole('textbox').value).toBe('');
        expect(setAppDataMock).not.toBeCalled();

    });
});