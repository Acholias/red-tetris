import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import * as reactRedux from 'react-redux';
import App from './App';

// Mock pages
vi.mock('./page/Welcome', () => ({ default: () => <div data-testid="page-welcome">Welcome</div> }));
vi.mock('./page/DevCredits', () => ({ default: () => <div data-testid="page-dev">DevCredits</div> }));
vi.mock('./page/Spectator/Spectator', () => ({ default: () => <div data-testid="page-spectator">Spectator</div> }));
vi.mock('./page/Game/Game', () => ({ default: () => <div data-testid="page-game">Game</div> }));
vi.mock('./page/Profile', () => ({ default: () => <div data-testid="page-profile">Profile</div> }));
vi.mock('./page/Lobby/Lobby', () => ({ default: () => <div data-testid="page-lobby">Lobby</div> }));

// Mock des functions
vi.mock('./components/profileIdentity', () => ({
  isDevPlayerName: vi.fn(),
  resolveAvatarForPlayer: vi.fn(),
}));

// Mock react-redux
vi.mock('react-redux', () => ({
  useDispatch: vi.fn(),
}));


describe('App Component', () => {
  let mockDispatch: any;

  beforeEach(() => {
    // Reset localStorage
    localStorage.clear();

    // Prepare redux mock
    mockDispatch = vi.fn();
    vi.mocked(reactRedux.useDispatch).mockReturnValue(mockDispatch);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('Test socket connection', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );

    expect(mockDispatch).toHaveBeenCalledWith({ type: 'socket/connect' });
    expect(mockDispatch).toHaveBeenCalledTimes(1);
  });

  it('Display welcome page', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByTestId('page-welcome')).toBeDefined();
  });

  it('Display game page', () => {
    render(
      <MemoryRouter initialEntries={['/game']}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByTestId('page-game')).toBeDefined();
  });

  it('Theme set', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );

    expect(document.documentElement.getAttribute('data-theme')).toBe('default');
    expect(localStorage.getItem('theme')).toBe('default');
  });

  it('Theme get', () => {
    localStorage.setItem('theme', '3');

    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );

    expect(document.documentElement.getAttribute('data-theme')).toBe('3');
  });

  it('PlayerName get', () => {
    localStorage.setItem('playerName', 'agtdbx');

    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );

    expect(localStorage.getItem('playerName')).toBe('agtdbx');
  });

  it('Local storage exception', () => {
    localStorage.setItem('avatar', 'mon-avatar.png');

    const setItemSpy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation((key, _) => {
      if (key === 'avatar') {
        throw new Error('QuotaExceededError : LocalStorage plein !');
      }
    });

    expect(() => {
      render(
        <MemoryRouter initialEntries={['/']}>
          <App />
        </MemoryRouter>
      );
    }).not.toThrow();

    expect(setItemSpy).toHaveBeenCalledWith('avatar', 'mon-avatar.png');

    setItemSpy.mockRestore();
  });

  it('background not null', () => {
    render(
      <MemoryRouter initialEntries={[{
        pathname: '/profile',
        state: { backgroundLocation: { pathname: '/', search: '', hash: '', state: null, key: 'default' } }
      }]}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByTestId('page-welcome')).toBeDefined();
    expect(screen.getByTestId('page-profile')).toBeDefined();
  });
});
