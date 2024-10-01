import { render, screen, fireEvent,act } from "@testing-library/react";
import { beforeEach, describe, expect, test } from "vitest";
import AddTask from "../../components/task/AddTask";
import { AppDataContext } from '../../context/AppContext.jsx';

const setAppDataMock = vi.fn()
const listId = "10624567-e89b-12d3-a456-42661417g312"

const contextValueMock = {
    setAppData: setAppDataMock,
    appData: {
        lists:[
            {
                "id": listId,
                "name": "Tareas para el día de mañana",
                "isVisible": true,
                "tasks": [
                  { "id": "567e4567-e89b-12d3-a456-426614174192", "name": "Terminar informe", "isVisible": true },
                  { "id": "127e4567-e89b-12d3-a456-426614174129", "name": "Hacer ejercicio después de las 4 PM", "isVisible": true }
                ]
            }
        ]
    }
}


describe('AddTask', ()=>{
    beforeEach(()=>{
        setAppDataMock.mockClear()
        render(
            <AppDataContext.Provider value={contextValueMock}>
                <AddTask listId={listId}/>
            </AppDataContext.Provider>
        );
    });

    test('Should be a button to add items to the tasks', ()=>{
        expect(screen.getByRole('button')).toBeInTheDocument();
    });
    
    test('Should be a textbox to add items to the tasks', ()=>{
        expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    test('Should the textbox be empty at start', async ()=>{
        expect(screen.getByRole('textbox')).toHaveValue('');   
    });

    test('Should the user be able to change value textbox',async ()=>{
        await fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Nuevo texto' } });
        expect(screen.getByRole('textbox').value).toBe('Nuevo texto');
    });

    test('Should be cleaned the textbox when clicked add task button', async () => {
        
        await fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Nuevo texto' } });
        
        await act(async () => {
            fireEvent.click(screen.getByRole('button'));
        });
    
        expect(screen.getByRole('textbox').value).toBe('');
    });
    

    test('Should add a task when the Add button is clicked and the text box is not empty', async () => {
        const newTaskName = 'Nuevo texto';
        
        await fireEvent.change(screen.getByRole('textbox'), { target: { value: newTaskName } });
        
        await act(async () => {
            fireEvent.click(screen.getByRole('button'));
        });
    
        expect(screen.getByRole('textbox').value).toBe('');
    
        expect(setAppDataMock).toBeCalled();
    
        // Verifica que setAppDataMock fue llamado con un objeto appData que tiene la nueva tarea
        expect(setAppDataMock).toHaveBeenCalledWith({
            lists: [
                {
                    "id": listId,
                    "name": "Tareas para el día de mañana",
                    "isVisible": true,
                    "tasks": [
                      { "id": "567e4567-e89b-12d3-a456-426614174192", "name": "Terminar informe", "isVisible": true },
                      { "id": "127e4567-e89b-12d3-a456-426614174129", "name": "Hacer ejercicio después de las 4 PM", "isVisible": true },
                      expect.objectContaining({ name: newTaskName })
                    ]
                }
            ]
        });
    });

    test('Should not add a tasks when the Add button is clicked and the text box is empty',async ()=>{

        await fireEvent.change(screen.getByRole('textbox'), { target: { value: '' } }); 
        
        await act( async ()=>{
            fireEvent.click(screen.getByRole('button'));
        })
        expect(screen.getByRole('textbox').value).toBe('');
        expect(setAppDataMock).not.toBeCalled();

    });
});