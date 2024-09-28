import { render, screen } from '@testing-library/react';
import App from '../src/App';
import '@testing-library/jest-dom';
import { beforeEach } from 'vitest';

describe('App', ()=>{

    let container;

    // Renderiza el componente App antes de comenzar los test
    beforeEach(() =>{
        const renderResul = render(<App />)
        container = renderResul.container;
    })

    test('should render the components', () => {
        
        // Verificamos si los elementos están en el DOM con querySelector
        expect(container.querySelector('.mt-title')).toBeInTheDocument();
        expect(container.querySelector('.mt-list-section')).toBeInTheDocument();
        expect(container.querySelector('.mt-addList-container')).toBeInTheDocument();
    })

});


