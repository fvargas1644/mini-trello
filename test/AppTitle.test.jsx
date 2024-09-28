import { fireEvent, render, screen } from '@testing-library/react';
import AppTitle from '../src/components/AppTitle';
import '@testing-library/jest-dom';
import { AppDataContext } from '../src/context/AppContext.jsx';
import initialAppData from '../src/data/initialAppData.jsx';
import { expect, test } from 'vitest';

// Simula la función setAppData
const setAppDataMock = vi.fn();

// Crea un contexto simulado
const contextValueMock = {
    setAppData: setAppDataMock,
};

// Simula el metodo reload
const reloadMock = vi.fn();

describe('AppTitle', () => {

    // Renderiza el componente App antes de comenzar los test 
    beforeEach(() =>{
        // Limpiar el mock antes de cada prueba
        setAppDataMock.mockClear();
        reloadMock.mockClear();

        // Borra window.location y se redefine con un metodo reload simulado
        delete window.location;
        window.location = {reload: reloadMock}

        render(
            <AppDataContext.Provider value={contextValueMock}>
                <AppTitle>Mini Trello - Drag and Drop</AppTitle>
            </AppDataContext.Provider>
        );
    });

    test('Should render main elements',() =>{
        expect(screen.getByText('Mini Trello - Drag and Drop')).toBeInTheDocument();
        expect(screen.getByText('Fernando Vargas')).toBeInTheDocument();
        expect(screen.getByRole('button', {name: /Restablecer Datos/i})).toBeInTheDocument();
    });

    test('Should call setAppData with initial app data and reload window on button click', async () => {
        // Simular clic del bóton
        const button = screen.getByRole('button', {name: /Restablecer Datos/i});
        await fireEvent.click(button)

        // Verifica que setAppData fue llamado con initialAppData
        expect(setAppDataMock).toHaveBeenCalledWith(initialAppData);

        // Verifica que se llama a window.location.reload
        expect(reloadMock).toBeCalled();
    });
});