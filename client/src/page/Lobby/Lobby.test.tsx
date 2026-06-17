import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import * as reactRedux from 'react-redux';
import * as reactRouterDom from 'react-router-dom';
import Lobby from './Lobby';

// Mocks
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: vi.fn().mockReturnValue({ room: '42', playerName: 'gugus' }),
  };
});

vi.mock('../../gameRoom/render/render', () => ({
  renderPlayer: (player: any) => <div key={player.id} data-testid="player-item">{player.name}</div>,
}));

vi.mock('../../gameRoom/logic/roomSlice', () => ({
  initRoom: vi.fn((payload) => ({ type: 'mock/initRoom', payload })),
  default: vi.fn((state = {}) => state),
}));

vi.mock('../../gameRoom/utils/functions', () => ({
  canYouPlay: vi.fn(() => true),
  canYouSpectate: vi.fn(() => true),
}));

vi.mock('../../theme/theme', () => ({
  createRoomTheme: vi.fn(() => ({})),
}));

vi.mock('@shared/defines', () => ({
  maxGridHeight: 30, minGridHeight: 10,
  maxGridWidth: 20, minGridWidth: 5,
  maxSpeed: 20, minSpeed: 1,
  maxSpeedFrequency: 20, minSpeedFrequency: 5,
  maxSpeedRate: 5, minSpeedRate: 1,
}));

const mockDispatch = vi.fn();
vi.mock('react-redux', () => ({
  useDispatch: () => mockDispatch,
  useSelector: vi.fn(),
}));

describe('Lobby Component', () => {
  const defaultRoomState = {
    isSocketConnected: true,
    id: '42',
    yourId: 0,
    isAdmin: true,
    isPlaying: false,
    players: [{ id: 0, name: 'gugus' }, { id: 1, name: 'other' }],
    spectators: [{ id: 2, name: 'spec' }],
    allPieces: false,
    malus: false,
    size: { w: 10, h: 20 },
    gameSpeed: { speed: 5, acceleration: false, frequency: 10, rate: 1, max: 15 },
  };

  const defaultThemeState = {
    themeRoom: { you_background: '#000' },
    themeGame: { color_J: '#111', color_I: '#222', color_O: '#333', color_T: '#444' },
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(reactRedux.useSelector).mockImplementation((selector: any) => {
      const state = {
        room: { ...defaultRoomState },
        theme: { ...defaultThemeState },
      };
      return selector(state);
    });
  });

  describe('Init and redirect', () => {
    it('dispatch initRoom and room/join', () => {
      vi.mocked(reactRedux.useSelector).mockImplementation((selector: any) =>
        selector({ room: { ...defaultRoomState, id: '' }, theme: defaultThemeState })
      );
      render(<MemoryRouter><Lobby /></MemoryRouter>);
      expect(mockDispatch).toHaveBeenCalledWith({ type: 'mock/initRoom', payload: { id: '42', playerName: 'gugus' } });
      expect(mockDispatch).toHaveBeenCalledWith({ type: 'room/join', payload: { roomId: '42', playerName: 'gugus' } });
    });

    it('redirect /game', () => {
      vi.mocked(reactRedux.useSelector).mockImplementation((selector: any) =>
        selector({ room: { ...defaultRoomState, isPlaying: true }, theme: defaultThemeState })
      );
      render(<MemoryRouter><Lobby /></MemoryRouter>);
      expect(mockNavigate).toHaveBeenCalledWith('/game');
    });

    it('redirect /spectator', () => {
      vi.mocked(reactRedux.useSelector).mockImplementation((selector: any) =>
        selector({ room: { ...defaultRoomState, isPlaying: true, yourId: 99 }, theme: defaultThemeState })
      );
      render(<MemoryRouter><Lobby /></MemoryRouter>);
      expect(mockNavigate).toHaveBeenCalledWith('/spectator');
    });
  });

  describe('Render', () => {
    describe('Admin', () => {
      it('edit if admin', () => {
        render(<MemoryRouter><Lobby /></MemoryRouter>);
        expect(screen.getByRole('button', { name: /Basics \+ bonus/i })).toBeDefined();
        expect(screen.getByRole('button', { name: 'ON' })).toBeDefined();
        expect(screen.getByLabelText('Increase width')).toBeDefined();
        expect(screen.getByText('Start game')).toBeDefined();
      });

      it('read only if not admin', () => {
        vi.mocked(reactRedux.useSelector).mockImplementation((selector: any) =>
          selector({ room: { ...defaultRoomState, isAdmin: false, yourId: 1 }, theme: defaultThemeState })
        );
        render(<MemoryRouter><Lobby /></MemoryRouter>);
        expect(screen.getByText('View-only for non-admin players.')).toBeDefined();
        expect(screen.queryByLabelText('Increase width')).toBeNull();
        expect(screen.queryByText('Start game')).toBeNull();
      });
    });

    describe('Dynamic labels', () => {
      it('solo / multi', () => {
        render(<MemoryRouter><Lobby /></MemoryRouter>);
        expect(screen.getByText('Multi')).toBeDefined();

        vi.mocked(reactRedux.useSelector).mockImplementation((selector: any) =>
          selector({ room: { ...defaultRoomState, players: [{ id: 0, name: 'gugus' }] }, theme: defaultThemeState })
        );
        render(<MemoryRouter><Lobby /></MemoryRouter>);
        expect(screen.getByText('Solo')).toBeDefined();
      });

      it('pieces', () => {
        render(<MemoryRouter><Lobby /></MemoryRouter>);
        expect(screen.getAllByText('Basics').length).toBeGreaterThan(0);

        vi.mocked(reactRedux.useSelector).mockImplementation((selector: any) =>
          selector({ room: { ...defaultRoomState, allPieces: true }, theme: defaultThemeState })
        );
        render(<MemoryRouter><Lobby /></MemoryRouter>);
        expect(screen.getAllByText('Basics + bonus').length).toBeGreaterThan(0);
      });

      it('malus', () => {
        render(<MemoryRouter><Lobby /></MemoryRouter>);
        expect(screen.getAllByText('OFF', { exact: true }).length).toBeGreaterThan(0);

        vi.mocked(reactRedux.useSelector).mockImplementation((selector: any) =>
          selector({ room: { ...defaultRoomState, malus: true }, theme: defaultThemeState })
        );
        render(<MemoryRouter><Lobby /></MemoryRouter>);
        expect(screen.getAllByText('ON', { exact: true }).length).toBeGreaterThan(0);
      });
    });

    describe('speed non admin', () => {
      it('devrait afficher les détails avancés si l\'accélération est activée', () => {
        vi.mocked(reactRedux.useSelector).mockImplementation((selector: any) =>
          selector({
            room: { ...defaultRoomState, isAdmin: false, yourId: 1, gameSpeed: { speed: 5, acceleration: true, frequency: 10, rate: 2, max: 20 } },
            theme: defaultThemeState
          })
        );
        render(<MemoryRouter><Lobby /></MemoryRouter>);

        expect(screen.getByText('Acceleration: enabled')).toBeDefined();
        expect(screen.getByText('Frequency: every 10 ticks')).toBeDefined();
        expect(screen.getByText('Rate: 2 ticks / sec')).toBeDefined();
        expect(screen.getByText('Max speed: 20 ticks / sec')).toBeDefined();
      });

      it('no acceleration', () => {
        vi.mocked(reactRedux.useSelector).mockImplementation((selector: any) =>
          selector({
            room: { ...defaultRoomState, isAdmin: false, yourId: 1, gameSpeed: { ...defaultRoomState.gameSpeed, acceleration: false } },
            theme: defaultThemeState
          })
        );
        render(<MemoryRouter><Lobby /></MemoryRouter>);

        expect(screen.getByText('Acceleration: disabled')).toBeDefined();
        expect(screen.queryByText(/Frequency: every/i)).toBeNull();
      });
    });

    describe('user lists', () => {
      it('devrait rendre les joueurs via renderPlayer si les tableaux ne sont pas vides', () => {
        render(<MemoryRouter><Lobby /></MemoryRouter>);
        expect(screen.getByText('gugus')).toBeDefined();
        expect(screen.getByText('other')).toBeDefined();
        expect(screen.getByText('spec')).toBeDefined();
        expect(screen.queryByText('No players yet.')).toBeNull();
      });

      it('text when lists empty', () => {
        vi.mocked(reactRedux.useSelector).mockImplementation((selector: any) =>
          selector({ room: { ...defaultRoomState, players: [], spectators: [] }, theme: defaultThemeState })
        );
        render(<MemoryRouter><Lobby /></MemoryRouter>);
        expect(screen.getByText('No players yet.')).toBeDefined();
        expect(screen.getByText('No spectators yet.')).toBeDefined();
        expect(screen.queryByTestId('player-item')).toBeNull();
      });
    });
  });

  describe('Lobby actions', () => {
    it('quit room', () => {
      render(<MemoryRouter><Lobby /></MemoryRouter>);
      fireEvent.click(screen.getByText('Quit room'));
      expect(mockDispatch).toHaveBeenCalledWith({ type: 'room/leave', payload: { roomId: '42' } });
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });

    it('change mode', () => {
      render(<MemoryRouter><Lobby /></MemoryRouter>);

      fireEvent.click(screen.getByText('Play'));
      expect(mockDispatch).toHaveBeenCalledWith({ type: 'room/playerMode', payload: { roomId: '42', spectate: false } });

      fireEvent.click(screen.getByText('Spectate'));
      expect(mockDispatch).toHaveBeenCalledWith({ type: 'room/playerMode', payload: { roomId: '42', spectate: true } });
    });

    it('start game', () => {
      render(<MemoryRouter><Lobby /></MemoryRouter>);
      fireEvent.click(screen.getByText('Start game'));
      expect(mockDispatch).toHaveBeenCalledWith({ type: 'room/startGame', payload: { roomId: '42' } });
    });
  });

  describe('Admin actions', () => {
    it('modify when no room', () => {
      vi.mocked(reactRouterDom.useParams).mockReturnValue({ room: undefined, playerName: 'gugus' });
      render(<MemoryRouter><Lobby /></MemoryRouter>);

      fireEvent.click(screen.getByRole('button', { name: 'ON' }));
      expect(mockDispatch).not.toHaveBeenCalledWith(expect.objectContaining({ type: 'room/settings' }));

      vi.mocked(reactRouterDom.useParams).mockReturnValue({ room: '42', playerName: 'gugus' }); // Restore
    });

    describe('change piece and malus', () => {
      it('change piece', () => {
        render(<MemoryRouter><Lobby /></MemoryRouter>);
        fireEvent.click(screen.getByRole('button', { name: 'Basics + bonus' }));
        expect(mockDispatch).toHaveBeenCalledWith({ type: 'room/settings', payload: { roomId: '42', allPieces: true } });

        fireEvent.click(screen.getByRole('button', { name: 'Basics', exact: true }));
        expect(mockDispatch).toHaveBeenCalledWith({ type: 'room/settings', payload: { roomId: '42', allPieces: false } });
      });

      it('change malus', () => {
        render(<MemoryRouter><Lobby /></MemoryRouter>);
        fireEvent.click(screen.getByRole('button', { name: 'ON' }));
        expect(mockDispatch).toHaveBeenCalledWith({ type: 'room/settings', payload: { roomId: '42', malus: true } });

        fireEvent.click(screen.getByRole('button', { name: 'OFF', exact: true }));
        expect(mockDispatch).toHaveBeenCalledWith({ type: 'room/settings', payload: { roomId: '42', malus: false } });
      });
    });

    describe('grid size', () => {
      it('change width', () => {
        render(<MemoryRouter><Lobby /></MemoryRouter>);

        fireEvent.click(screen.getByLabelText('Increase width'));
        expect(mockDispatch).toHaveBeenCalledWith({ type: 'room/settings', payload: { roomId: '42', size: { w: 11, h: 20 } } });

        fireEvent.click(screen.getByLabelText('Decrease width'));
        expect(mockDispatch).toHaveBeenCalledWith({ type: 'room/settings', payload: { roomId: '42', size: { w: 9, h: 20 } } });
      });

      it('change height', () => {
        render(<MemoryRouter><Lobby /></MemoryRouter>);

        fireEvent.click(screen.getByLabelText('Increase height'));
        expect(mockDispatch).toHaveBeenCalledWith({ type: 'room/settings', payload: { roomId: '42', size: { w: 10, h: 21 } } });

        fireEvent.click(screen.getByLabelText('Decrease height'));
        expect(mockDispatch).toHaveBeenCalledWith({ type: 'room/settings', payload: { roomId: '42', size: { w: 10, h: 19 } } });
      });
    });

    describe('Game speed', () => {
      it('change speed', () => {
        render(<MemoryRouter><Lobby /></MemoryRouter>);
        fireEvent.click(screen.getByLabelText('Increase speed'));
        expect(mockDispatch).toHaveBeenCalledWith({ type: 'room/settings', payload: { roomId: '42', gameSpeed: { ...defaultRoomState.gameSpeed, speed: 6 } } });

        fireEvent.click(screen.getByLabelText('Decrease speed'));
        expect(mockDispatch).toHaveBeenCalledWith({ type: 'room/settings', payload: { roomId: '42', gameSpeed: { ...defaultRoomState.gameSpeed, speed: 4 } } });
      });

      it('max speed', () => {
        vi.mocked(reactRedux.useSelector).mockImplementation((selector: any) =>
          selector({ room: { ...defaultRoomState, gameSpeed: { ...defaultRoomState.gameSpeed, speed: 20 } }, theme: defaultThemeState })
        );
        render(<MemoryRouter><Lobby /></MemoryRouter>);

        fireEvent.click(screen.getByLabelText('Increase speed'));
        expect(mockDispatch).toHaveBeenCalledWith({ type: 'room/settings', payload: { roomId: '42', gameSpeed: { ...defaultRoomState.gameSpeed, speed: 20 } } });
      });

      it('min speed', () => {
        vi.mocked(reactRedux.useSelector).mockImplementation((selector: any) =>
          selector({ room: { ...defaultRoomState, gameSpeed: { ...defaultRoomState.gameSpeed, speed: 1 } }, theme: defaultThemeState })
        );
        render(<MemoryRouter><Lobby /></MemoryRouter>);

        fireEvent.click(screen.getByLabelText('Decrease speed'));
        expect(mockDispatch).toHaveBeenCalledWith({ type: 'room/settings', payload: { roomId: '42', gameSpeed: { ...defaultRoomState.gameSpeed, speed: 1 } } });
      });

      it('acceleration', () => {
        render(<MemoryRouter><Lobby /></MemoryRouter>);
        fireEvent.click(screen.getByText('Disabled'));
        expect(mockDispatch).toHaveBeenCalledWith({ type: 'room/settings', payload: { roomId: '42', gameSpeed: { ...defaultRoomState.gameSpeed, acceleration: true } } });
      });

      describe('Acceleration', () => {
        beforeEach(() => {
          vi.mocked(reactRedux.useSelector).mockImplementation((selector: any) =>
            selector({ room: { ...defaultRoomState, gameSpeed: { ...defaultRoomState.gameSpeed, acceleration: true, frequency: 10, rate: 2, max: 15 } }, theme: defaultThemeState })
          );
        });

        it('change frequency', () => {
          render(<MemoryRouter><Lobby /></MemoryRouter>);
          fireEvent.click(screen.getByLabelText('Increase frequency'));
          expect(mockDispatch).toHaveBeenCalledWith({ type: 'room/settings', payload: { roomId: '42', gameSpeed: expect.objectContaining({ frequency: 11 }) } });

          fireEvent.click(screen.getByLabelText('Decrease frequency'));
          expect(mockDispatch).toHaveBeenCalledWith({ type: 'room/settings', payload: { roomId: '42', gameSpeed: expect.objectContaining({ frequency: 9 }) } });
        });

        it('change rate', () => {
          render(<MemoryRouter><Lobby /></MemoryRouter>);
          fireEvent.click(screen.getByLabelText('Increase rate'));
          expect(mockDispatch).toHaveBeenCalledWith({ type: 'room/settings', payload: { roomId: '42', gameSpeed: expect.objectContaining({ rate: 3 }) } });

          fireEvent.click(screen.getByLabelText('Decrease rate'));
          expect(mockDispatch).toHaveBeenCalledWith({ type: 'room/settings', payload: { roomId: '42', gameSpeed: expect.objectContaining({ rate: 1 }) } });
        });

        it('change speed cap', () => {
          render(<MemoryRouter><Lobby /></MemoryRouter>);
          fireEvent.click(screen.getByLabelText('Increase max speed'));
          expect(mockDispatch).toHaveBeenCalledWith({ type: 'room/settings', payload: { roomId: '42', gameSpeed: expect.objectContaining({ max: 16 }) } });

          fireEvent.click(screen.getByLabelText('Decrease max speed'));
          expect(mockDispatch).toHaveBeenCalledWith({ type: 'room/settings', payload: { roomId: '42', gameSpeed: expect.objectContaining({ max: 14 }) } });
        });
      });
    });
  });
});
