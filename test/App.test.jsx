import { render, screen } from '@testing-library/react';
import App from '../src/App';
import '@testing-library/jest-dom'; // para usar toBeInTheDocument

test('renders the App with title and components', () => {
  // Renderizar el componente App
  render(<App />);

  // Verificar si el título "Mini Trello - Drag and Drop" está en el documento
  expect(screen.getByText('Mini Trello - Drag and Drop')).toBeInTheDocument();

  // Verificar que el componente List se renderizó correctamente
  //expect(screen.getByRole('list')).toBeInTheDocument(); // Suponiendo que `List` tiene un rol "list"

  // Verificar que el componente AddList se renderizó correctamente
  //expect(screen.getByRole('button', { name: /add list/i })).toBeInTheDocument(); // Suponiendo que `AddList` tiene un botón "Add List"
});
