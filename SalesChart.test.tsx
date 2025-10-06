import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SalesChart from '../app/components/SalesChart';

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({
      '2024': [{ month: 'Jan', sales: 4250 }, { month: 'Feb', sales: 3100 }],
    }),
  })
) as any;

describe('SalesChart Component', () => {
  it('renders dropdown and controls', async () => {
    render(<SalesChart />);
    await waitFor(() => screen.getByText(/Loading data/i));
    expect(screen.getByLabelText(/Select Year/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Chart Type/i)).toBeInTheDocument();
  });

  it('changes year on selection', async () => {
    render(<SalesChart />);
    const select = await screen.findByLabelText(/Select Year/i);
    fireEvent.change(select, { target: { value: '2023' } });
    expect(select).toHaveValue('2023');
  });
});
