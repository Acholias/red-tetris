import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Welcome from './Welcome';

// Mocks
vi.mock('../components/TetrisRain', () => ({
  TetrisRain: () => <div data-testid="tetris-rain">Rain</div>
}));

const mockDispatch = vi.fn();
vi.mock('react-redux', () => ({
  useDispatch: () => mockDispatch,
}));

vi.mock('../gameRoom/logic/roomSlice', () => ({
  initRoom: vi.fn((payload) => ({ type: 'mock/initRoom', payload })),
}));

const mockNavigate = vi.fn();
const mockLocation = { pathname: '/welcome-test-path' };

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => mockLocation,
  };
});

describe('Welcome page', () => {
  const mockSetPlayerName = vi.fn();

  const defaultProps = {
    playerName: '',
    setPlayerName: mockSetPlayerName,
    avatar: null,
    isDevProfile: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('Basic elements', () => {
    render(
      <MemoryRouter>
        <Welcome {...defaultProps} />
      </MemoryRouter>
    );

    expect(screen.getByText('Blue Tetris')).toBeDefined();
    expect(screen.getByTestId('tetris-rain')).toBeDefined();
    expect(screen.getByPlaceholderText('PlayerName')).toBeDefined();
    expect(screen.getByPlaceholderText('42')).toBeDefined(); // Room input

    const playButton = screen.getByRole('button', { name: 'Play' });
    expect(playButton).toHaveProperty('disabled', true);
  });

  it('setPlayerName call', () => {
    render(
      <MemoryRouter>
        <Welcome {...defaultProps} />
      </MemoryRouter>
    );

    const playerInput = screen.getByPlaceholderText('PlayerName');
    fireEvent.change(playerInput, { target: { value: 'aderouba' } });

    expect(mockSetPlayerName).toHaveBeenCalled();
  });

  it('enable Play button', () => {
    render(
      <MemoryRouter>
        <Welcome {...defaultProps} playerName="aderouba" />
      </MemoryRouter>
    );

    const roomInput = screen.getByPlaceholderText('42');
    const playButton = screen.getByRole('button', { name: 'Play' });

    expect(playButton).toHaveProperty('disabled', true);

    fireEvent.change(roomInput, { target: { value: 'room-1' } });

    expect(playButton).toHaveProperty('disabled', false);
  });

  it('Play button actions', () => {
    render(
      <MemoryRouter>
        <Welcome {...defaultProps} playerName="aderouba" />
      </MemoryRouter>
    );

    const roomInput = screen.getByPlaceholderText('42');
    fireEvent.change(roomInput, { target: { value: 'room-1' } });

    const playButton = screen.getByRole('button', { name: 'Play' });
    fireEvent.click(playButton);

    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'mock/initRoom',
      payload: { id: 'room-1', playerName: 'aderouba' }
    });
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'room/join',
      payload: { roomId: 'room-1', playerName: 'aderouba' }
    });

    expect(mockNavigate).toHaveBeenCalledWith('/room-1/aderouba');
  });

  it('Profil button', () => {
    render(
      <MemoryRouter>
        <Welcome {...defaultProps} />
      </MemoryRouter>
    );

    const profileButton = screen.getByRole('button', { name: 'Open profile' });
    fireEvent.click(profileButton);

    expect(mockNavigate).toHaveBeenCalledWith('/profile', {
      state: { backgroundLocation: mockLocation }
    });
  });

  it('Devs button', () => {
    render(
      <MemoryRouter>
        <Welcome {...defaultProps} />
      </MemoryRouter>
    );

    const devButton = screen.getByRole('button', { name: 'Devs' });
    fireEvent.click(devButton);

    expect(mockNavigate).toHaveBeenCalledWith('/dev');
  });

  it('display avatar', () => {
    render(
      <MemoryRouter>
        <Welcome {...defaultProps} avatar="my-avatar.png" />
      </MemoryRouter>
    );

    const avatarImage = screen.getByAltText('Current avatar');
    expect(avatarImage).toBeDefined();
    expect(avatarImage.getAttribute('src')).toBe('my-avatar.png');
  });

  it('default class', () => {
    render(
      <MemoryRouter>
        <Welcome {...defaultProps} avatar={null} isDevProfile={false} />
      </MemoryRouter>
    );
    const profileButton = screen.getByRole('button', { name: 'Open profile' });

    expect(profileButton).toHaveProperty('className', 'floating-btn profile-button  ');
  });

  it('add profile-avatar-button if there is a avatar', () => {
    render(
      <MemoryRouter>
        <Welcome {...defaultProps} avatar="my-avatar.png" isDevProfile={false} />
      </MemoryRouter>
    );
    const profileButton = screen.getByRole('button', { name: 'Open profile' });

    expect(profileButton).toHaveProperty('className', 'floating-btn profile-button profile-avatar-button ');
  });

  it('add is-dev-profile is it\'s a dev profile', () => {
    render(
      <MemoryRouter>
        <Welcome {...defaultProps} avatar={null} isDevProfile={true} />
      </MemoryRouter>
    );
    const profileButton = screen.getByRole('button', { name: 'Open profile' });

    expect(profileButton).toHaveProperty('className', 'floating-btn profile-button  is-dev-profile');
  });

  it('check if there is a dev avatar', () => {
    render(
      <MemoryRouter>
        <Welcome {...defaultProps} avatar="my-avatar.png" isDevProfile={true} />
      </MemoryRouter>
    );
    const profileButton = screen.getByRole('button', { name: 'Open profile' });

    expect(profileButton).toHaveProperty('className', 'floating-btn profile-button profile-avatar-button is-dev-profile');
  });
});
