import { render, screen } from '@testing-library/react';
import Tours from './Tours';
import { server } from '../mocks/server';
import { errorGetTours } from '../mocks/handlers';
describe('Tours', () => {
  test('shows loading state initially', () => {
    render(<Tours />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
    expect(screen.queryByText(/error/i)).not.toBeInTheDocument();
  });

  test('displays tours data after loading', async () => {
    render(<Tours />);
    const tours = await screen.findAllByRole('article');
    expect(tours).toHaveLength(2);
    const title = await screen.findByText(/best of paris/i);
    expect(title).toBeInTheDocument();
    expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
  });

  test('shows error state when fetch fails', async () => {
    server.use(...errorGetTours);
    render(<Tours />);
    expect(await screen.findByText(/error/i)).toBeInTheDocument();
    expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
  });
});
