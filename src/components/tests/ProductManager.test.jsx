// src/components/tests/ProductManager.test.jsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import ProductManager from '../Admin/ProductManager'; // Adjust this path if needed
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';

import { AppContext } from '../../context/AppContext'; // Adjust if different

const mockContext = {
  refreshData: vi.fn(),
  dataVersion: 1,
};

const renderWithContext = (ui) => {
  return render(
    <AppContext.Provider value={mockContext}>
      <BrowserRouter>{ui}</BrowserRouter>
    </AppContext.Provider>
  );
};

test('renders product manager heading', () => {
  renderWithContext(<ProductManager />);
  expect(screen.getByText(/Manage Products/i)).toBeInTheDocument();
});
