import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import Weather from '../Weather';

vi.mock('../../api', () => ({
  getWeather: vi.fn(),
}));

import { getWeather } from '../../api';

const mockGetWeather = vi.mocked(getWeather);

afterEach(() => {
  vi.clearAllMocks();
});

describe('Weather', () => {
  it('shows loading state initially', () => {
    mockGetWeather.mockReturnValue(new Promise(() => {}));
    render(<Weather />);
    expect(screen.getByText(/loading weather/i)).toBeInTheDocument();
  });

  it('shows error message when fetch fails', async () => {
    mockGetWeather.mockRejectedValue(new Error('network error'));
    render(<Weather />);
    expect(await screen.findByText(/failed to load weather/i)).toBeInTheDocument();
  });

  it('displays sunny icon for clear sky (code 0)', async () => {
    mockGetWeather.mockResolvedValue({ temperature: 25, weatherCode: 0 });
    render(<Weather />);
    const el = await screen.findByText(/25°C/);
    expect(el.textContent).toContain('☀️');
  });

  it('displays snow icon for heavy snowfall (code 75)', async () => {
    mockGetWeather.mockResolvedValue({ temperature: -3, weatherCode: 75 });
    render(<Weather />);
    const el = await screen.findByText(/-3°C/);
    expect(el.textContent).toContain('❄️');
  });

  it('displays thunderstorm icon for thunderstorm with hail (code 99)', async () => {
    mockGetWeather.mockResolvedValue({ temperature: 18, weatherCode: 99 });
    render(<Weather />);
    const el = await screen.findByText(/18°C/);
    expect(el.textContent).toContain('⛈️');
  });
});
