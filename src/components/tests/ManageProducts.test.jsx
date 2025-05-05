import React from 'react';
import { render, screen } from '@testing-library/react';
import ProductManager from '../Admin/ProductManager';
import { BrowserRouter } from 'react-router-dom';
import { AppProvider } from '../../context/AppContext'; 
import '@testing-library/jest-dom';

// or adjust based on where AppContext lives

test('renders product manager heading', () => {
  render(
    <AppProvider>
      <BrowserRouter>
        <ProductManager />
      </BrowserRouter>
    </AppProvider>
  );

  expect(screen.getByText(/Manage Products/i)).toBeInTheDocument();
});
