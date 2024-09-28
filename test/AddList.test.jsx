import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, test } from "vitest";
import AddList from "../src/components/AddList";
import { AppDataContext } from '../src/context/AppContext.jsx';
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
        expect(screen.getByRole('button', {name: /Agregar lista/i})).toBeInTheDocument();
        expect(screen.getByRole('textbox')).not.toBeNull();
        
    });
});