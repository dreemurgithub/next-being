/// <reference types="@testing-library/jest-dom" />
import React from 'react';
import { render, screen } from '@testing-library/react';
import TestPage from './page';

// Mock fetch globally
global.fetch = jest.fn();

describe('TestPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state initially', () => {
    render(<TestPage />);
    expect(screen.getByText('Testing Vercel Blob and Database setup...')).toBeInTheDocument();
  });

  it('renders success states after data load', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: () => Promise.resolve({ message: 'Blob test successful' }),
    }).mockResolvedValueOnce({
      json: () => Promise.resolve({ message: 'DB test successful' }),
    });

    render(<TestPage />);

    // Wait for the component to update after fetch
    await screen.findByText('Setup Tests');

    expect(screen.getByText('Vercel Blob Test')).toBeInTheDocument();
    expect(screen.getByText('Database Test')).toBeInTheDocument();
  });
});
