import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, test } from "vitest";
import AddList from "../components/AddList.jsx";
import { AppDataContext } from '../context/AppContext.jsx';
import '@testing-library/jest-dom';

const contextValueMock = vi.fn().mockReturnValue({
    setAppData: vi.fn(),
    appData: {
        list: []
    }
});

describe('AddList', ()=>{
    beforeEach(()=>{
        contextValueMock.mockClear();
        render(
            <AppDataContext.Provider value={contextValueMock}>
                <AddList/>
            </AppDataContext.Provider>
        );
    });

    test('Should see first the button add list', ()=>{

        // Comprobar si la primera vista es el botón de agregar lista 
        expect(screen.getByRole('button', {name: /Agregar lista/i})).toBeInTheDocument();

        // Comprobar si los elementos input y botón add para agregar la lista esta ocultos en primera instacia
        expect(screen.getByRole('textbox')).not.toBeNull();
        expect(screen.getByRole('button', {name: /Add/i})).not.toBeNull();
    });
});