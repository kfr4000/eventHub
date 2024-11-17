import '@testing-library/jest-dom';
import React from 'react';
import { render, screen } from '@testing-library/react';
import Home from '../src/pages/index';
import fetchMock from 'jest-fetch-mock';

fetchMock.enableMocks();

describe('Home Page', () => {
  beforeEach(() => {
    fetch.resetMocks();
  });

  it('renders the heading', async () => {
    fetch.mockResponseOnce(JSON.stringify([])); // 빈 이벤트 목록을 반환하도록 모킹
    render(<Home />);
    const heading = await screen.findByText(/Recommended for You/i);
    expect(heading).toBeInTheDocument();
  });
});
