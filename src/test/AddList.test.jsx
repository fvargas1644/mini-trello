import { fireEvent, render, screen,act } from "@testing-library/react";
import { beforeEach, describe, expect, test } from "vitest";
import AddList from "../components/AddList.jsx";
import { AppDataContext } from '../context/AppContext.jsx';
import '@testing-library/jest-dom';
import initialAppData from "../data/initialAppData.jsx";


const setAppDataMock = vi.fn()

const contextValueMock = {
    setAppData: setAppDataMock,
    appData: initialAppData
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
        )
        containerComponent = renderResul.container;
    });

    

    test('Should see first the button new list', ()=>{

        // Comprobar si la primera vista es el botón de agregar lista 
        expect(screen.getByRole('button', {name: /Agregar lista/i})).toBeInTheDocument();

        // Comprobar si el div que contiene el textarea y botón "Add" no está activo 
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

    test('Should add a list when the Add button is clicked and the text box is not empty', async ()=>{

        await fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Nuevo texto' } }); 
        
        await act( async ()=>{
            fireEvent.click(screen.getByRole('button', {name: /Add/i}));
        })

        expect(screen.getByRole('textbox').value).toBe('');
        expect(setAppDataMock).toBeCalled();

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