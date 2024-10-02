import { render, screen } from '@testing-library/react';
import App from '../App.jsx';
import '@testing-library/jest-dom';

describe('App', ()=>{

    let containerComponent;

    // Renderiza el componente App antes de comenzar los test
    beforeEach(() =>{
        const renderResul = render(<App />);
        containerComponent = renderResul.container;
    });

    test('should render the components', () => {
        
        // Verificamos si los elementos están en el DOM con querySelector
        expect(containerComponent.querySelector('.mt-title')).toBeInTheDocument();
        expect(containerComponent.querySelector('.mt-list-section')).toBeInTheDocument();
        expect(containerComponent.querySelector('.mt-addList-container')).toBeInTheDocument();
    });

});


