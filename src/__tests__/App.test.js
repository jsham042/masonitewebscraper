import { render, screen, fireEvent } from '@testing-library/react';
import App from '../App';

describe('App', () => {
  beforeEach(async () => {
    // Mock API response
    global.fetch = jest.fn(() =>
        Promise.resolve({
          json: () =>
              Promise.resolve([
                {
                  sku: 'SKU1',
                  weeks: [
                    { date: '2023-01-01', price: 100 },
                    { date: '2023-01-08', price: 110 },
                  ],
                },
                {
                  sku: 'SKU2',
                  weeks: [
                    { date: '2023-01-01', price: 200 },
                    { date: '2023-01-08', price: 210 },
                  ],
                },
              ]),
        })
    );

    render(<App />);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders the dropdown with SKUs', async () => {
    // Wait for the data to be fetched and rendered
    const dropdown = await screen.findByRole('combobox');

    // Check if the correct SKUs are displayed in the dropdown
    const sku1 = await screen.findByText('SKU1');
    const sku2 = await screen.findByText('SKU2');

    expect(sku1).toBeInTheDocument();
    expect(sku2).toBeInTheDocument();
  });

  it('displays line chart when a SKU is selected', async () => {
    // Wait for the data to be fetched and rendered
    const dropdown = await screen.findByRole('combobox');

    // Wait for the SKU1 option to be present
    await screen.findByText('SKU1');

    // Select a SKU from the dropdown
    fireEvent.change(dropdown, { target: { value: 'SKU1' } });

    // Check if the line chart is displayed
    const chart = await screen.findByTestId('line-chart');
    expect(chart).toBeInTheDocument();
  });
});
