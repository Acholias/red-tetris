import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import * as reactRedux from 'react-redux';
import * as reactRouterDom from 'react-router-dom';
import Game from './Game';
import { createInterval } from '../../gameEngine/utils/intervals';
import { renderCells } from '../../gameEngine/render/render';
import React from 'react';

// Mock
let mockResizeCallback: any;

global.ResizeObserver = class {
  constructor(cb: any) {
    mockResizeCallback = cb;
  }
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
} as any;


const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: vi.fn().mockReturnValue({ state: {} }),
  };
});

const mockDispatch = vi.fn();
vi.mock('react-redux', () => ({
  useDispatch: () => mockDispatch,
  useSelector: vi.fn(),
}));

vi.mock('../../gameEngine/logic/gameSlice', () => ({
  movePiece: vi.fn((payload) => ({ type: 'mock/movePiece', payload })),
  rotatePiece: vi.fn(() => ({ type: 'mock/rotatePiece' })),
  softDrop: vi.fn(() => ({ type: 'mock/softDrop' })),
  hardDrop: vi.fn(() => ({ type: 'mock/hardDrop' })),
  tick: vi.fn(() => ({ type: 'mock/tick' })),
  default: vi.fn((state = {}) => state),
}));

vi.mock('../../gameRoom/logic/roomSlice', () => ({
  initRoom: vi.fn((payload) => ({ type: 'mock/initRoom', payload })),
  default: vi.fn((state = {}) => state),
}));

vi.mock('../../gameEngine/logic/spectrumsSlice', () => ({
  initSpectrums: vi.fn((payload) => ({ type: 'mock/initSpectrums', payload })),
  default: vi.fn((state = {}) => state),
}));

vi.mock('../../gameEngine/utils/intervals', () => ({
  createInterval: vi.fn(),
}));
vi.mock('../../gameEngine/render/render', () => ({
  renderCells: vi.fn(() => <div data-testid="mock-cells" />),
  renderSpectrum: vi.fn((spectrum) => <div data-testid={`mock-spectrum-${spectrum.id}`} />),
}));
vi.mock('../../theme/theme', () => ({
  createGameTheme: vi.fn(() => ({})),
  createSpectrumTheme: vi.fn(() => ({})),
}));


describe('Game Component', () => {
  const defaultGameState = {
    isEnd: false,
    win: undefined,
    speed: { speed: 10 },
    grid: { cells: [], width: 10, height: 20 },
    piece: { cells: [], x: 5, y: 0, width: 4, height: 4 },
    nextPiece: { cells: [], width: 4, height: 4 },
  };

  const defaultRoomState = {
    id: 'room-42',
    isSocketConnected: true,
    isPlaying: true,
    isAdmin: true,
    yourId: 0,
    players: [{ id: 0, name: 'gugus' }, { id: 1, name: 'other' }],
  };

  const defaultThemeState = {};
  const defaultSpectrumsState = {};

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(reactRedux.useSelector).mockImplementation((selector: any) => {
      const state = {
        game: { ...defaultGameState },
        room: { ...defaultRoomState },
        theme: { ...defaultThemeState },
        spectrums: { ...defaultSpectrumsState },
      };
      return selector(state);
    });

    vi.mocked(reactRouterDom.useLocation).mockReturnValue({ state: {} } as any);
  });

  describe('Render', () => {
    it('game mode', () => {
      render(<MemoryRouter><Game /></MemoryRouter>);
      expect(screen.getByText('Multi player game')).toBeDefined();

      vi.mocked(reactRedux.useSelector).mockImplementation((selector: any) =>
        selector({
          game: defaultGameState, room: { ...defaultRoomState, players: [{ id: 0, name: 'gugus' }] },
          theme: defaultThemeState, spectrums: defaultSpectrumsState
        })
      );
      render(<MemoryRouter><Game /></MemoryRouter>);
      expect(screen.getByText('Solo game')).toBeDefined();
    });

    it('win', () => {
      vi.mocked(reactRedux.useSelector).mockImplementation((selector: any) =>
        selector({
          game: { ...defaultGameState, win: true }, room: defaultRoomState,
          theme: defaultThemeState, spectrums: defaultSpectrumsState
        })
      );
      render(<MemoryRouter><Game /></MemoryRouter>);
      expect(screen.getByText('You win !')).toBeDefined();
    });

    it('lose', () => {
      vi.mocked(reactRedux.useSelector).mockImplementation((selector: any) =>
        selector({
          game: { ...defaultGameState, win: false }, room: defaultRoomState,
          theme: defaultThemeState, spectrums: defaultSpectrumsState
        })
      );
      render(<MemoryRouter><Game /></MemoryRouter>);
      expect(screen.getByText('You lose -_-')).toBeDefined();
    });
  });

  describe('Keyboard', () => {
    beforeEach(() => {
      render(<MemoryRouter><Game /></MemoryRouter>);
    });

    it('rotatePiece', () => {
      fireEvent.keyDown(window, { key: 'ArrowUp' });
      expect(mockDispatch).toHaveBeenCalledWith({ type: 'mock/rotatePiece' });
      expect(mockDispatch).toHaveBeenCalledWith({ type: 'game/action', payload: { roomId: 'room-42', action: 'rotate' } });
    });

    it('movePiece(left)', () => {
      fireEvent.keyDown(window, { key: 'ArrowLeft' });
      expect(mockDispatch).toHaveBeenCalledWith({ type: 'mock/movePiece', payload: { right: false } });
      expect(mockDispatch).toHaveBeenCalledWith({ type: 'game/action', payload: { roomId: 'room-42', action: 'left' } });
    });

    it('movePiece(right)', () => {
      fireEvent.keyDown(window, { key: 'ArrowRight' });
      expect(mockDispatch).toHaveBeenCalledWith({ type: 'mock/movePiece', payload: { right: true } });
      expect(mockDispatch).toHaveBeenCalledWith({ type: 'game/action', payload: { roomId: 'room-42', action: 'right' } });
    });

    it('softDrop', () => {
      fireEvent.keyDown(window, { key: 'ArrowDown' });
      expect(mockDispatch).toHaveBeenCalledWith({ type: 'mock/softDrop' });
      expect(mockDispatch).toHaveBeenCalledWith({ type: 'game/action', payload: { roomId: 'room-42', action: 'soft-drop' } });
    });

    it('hardDrop', () => {
      fireEvent.keyDown(window, { key: ' ' }); // Espace
      expect(mockDispatch).toHaveBeenCalledWith({ type: 'mock/hardDrop' });
      expect(mockDispatch).toHaveBeenCalledWith({ type: 'game/action', payload: { roomId: 'room-42', action: 'hard-drop' } });
    });

    it('other key', () => {
      mockDispatch.mockClear();
      fireEvent.keyDown(window, { key: 'Enter' });
      expect(mockDispatch).not.toHaveBeenCalled();
    });
  });

  describe('Navigation', () => {
    it('go back button', () => {
      vi.mocked(reactRedux.useSelector).mockImplementation((selector: any) =>
        selector({ game: defaultGameState, room: { ...defaultRoomState, isPlaying: false }, theme: defaultThemeState, spectrums: defaultSpectrumsState })
      );
      render(<MemoryRouter><Game /></MemoryRouter>);

      const backButton = screen.getByText('Go back to room');
      expect(backButton).toBeDefined();
    });

    it('go back action', () => {
      vi.mocked(reactRedux.useSelector).mockImplementation((selector: any) =>
        selector({ game: defaultGameState, room: { ...defaultRoomState, isPlaying: false }, theme: defaultThemeState, spectrums: defaultSpectrumsState })
      );
      render(<MemoryRouter><Game /></MemoryRouter>);

      fireEvent.click(screen.getByText('Go back to room'));
      expect(mockNavigate).toHaveBeenCalledWith('/room-42/gugus'); // Car yourId = 0
    });

    it('go back no room', () => {
      vi.mocked(reactRedux.useSelector).mockImplementation((selector: any) =>
        selector({ game: defaultGameState, room: { ...defaultRoomState, isPlaying: false, id: '' }, theme: defaultThemeState, spectrums: defaultSpectrumsState })
      );
      render(<MemoryRouter><Game /></MemoryRouter>);

      fireEvent.click(screen.getByText('Go back to room'));
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  describe('Solo', () => {
    beforeEach(() => {
      vi.mocked(reactRouterDom.useLocation).mockReturnValue({ state: { mode: 'solo', playerName: 'LonelyBoy' } } as any);
    });

    it('socket connection', () => {
      vi.mocked(reactRedux.useSelector).mockImplementation((selector: any) =>
        selector({ game: defaultGameState, room: { ...defaultRoomState, isSocketConnected: false, id: '' }, theme: defaultThemeState, spectrums: defaultSpectrumsState })
      );
      render(<MemoryRouter><Game /></MemoryRouter>);

      expect(mockDispatch).toHaveBeenCalledWith({ type: 'socket/connect' });
    });

    it('start solo game', () => {
      vi.mocked(reactRedux.useSelector).mockImplementation((selector: any) =>
        selector({ game: defaultGameState, room: { ...defaultRoomState, id: '', isPlaying: false }, theme: defaultThemeState, spectrums: defaultSpectrumsState })
      );

      render(<MemoryRouter><Game /></MemoryRouter>);

      expect(mockDispatch).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'mock/initRoom', payload: expect.objectContaining({ playerName: 'LonelyBoy' }) })
      );
      expect(mockDispatch).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'room/join', payload: expect.objectContaining({ playerName: 'LonelyBoy' }) })
      );
    });
  });

  describe('Spectrums', () => {
    it('initSpectrums', () => {
      render(<MemoryRouter><Game /></MemoryRouter>);
      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'mock/initSpectrums',
        payload: { room: expect.anything(), skipCurrentPlayer: true }
      });
    });

    it('render spectrums', () => {
      vi.mocked(reactRedux.useSelector).mockImplementation((selector: any) =>
        selector({
          game: defaultGameState, room: defaultRoomState, theme: defaultThemeState,
          spectrums: { '1': { id: 1 }, '2': { id: 2 } }
        })
      );

      render(<MemoryRouter><Game /></MemoryRouter>);

      expect(screen.getByTestId('mock-spectrum-1')).toBeDefined();
      expect(screen.getByTestId('mock-spectrum-2')).toBeDefined();
    });
  });

  describe('ResizeObserver', () => {
    it('board size', async () => {
      const { container } = render(<MemoryRouter><Game /></MemoryRouter>);

      const gameBoard = container.querySelector('.game-board') as HTMLElement;

      expect(gameBoard.style.width).toBe('512px');

      await act(async () => {
        mockResizeCallback([{ contentRect: { width: 1024, height: 1024 } }]);
      });

      expect(gameBoard.style.width).toBe('840px');
    });

    it('no contentRect', async () => {
      const { container } = render(<MemoryRouter><Game /></MemoryRouter>);

      const gameBoard = container.querySelector('.game-board') as HTMLElement;

      const initialWidth = gameBoard.style.width;

      await act(async () => {
        mockResizeCallback([{}]);
      });

      expect(gameBoard.style.width).toBe(initialWidth);
    });
  });

  describe('CreateInterval', () => {
    it('tick', () => {
      render(<MemoryRouter><Game /></MemoryRouter>);
      expect(createInterval).toHaveBeenCalled();

      const [tickCallback] = vi.mocked(createInterval).mock.calls[0];

      tickCallback();

      expect(mockDispatch).toHaveBeenCalledWith({ type: 'mock/tick' });
    });
  });

  it('startSoloGame', () => {
    vi.mocked(reactRouterDom.useLocation).mockReturnValue({
      state: { mode: 'solo', playerName: 'LonelyBoy' }
    } as any);

    vi.mocked(reactRedux.useSelector).mockImplementation((selector: any) =>
      selector({
        game: defaultGameState,
        room: { ...defaultRoomState, id: 'room-42', isPlaying: false, isAdmin: true },
        theme: defaultThemeState,
        spectrums: defaultSpectrumsState
      })
    );

    render(<MemoryRouter><Game /></MemoryRouter>);

    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'room/startGame',
      payload: {
        roomId: 'room-42',
      }
    });
  });

  it('startSoloGame if not admin', () => {
    vi.mocked(reactRouterDom.useLocation).mockReturnValue({
      state: { mode: 'solo', playerName: 'LonelyBoy' }
    } as any);

    vi.mocked(reactRedux.useSelector).mockImplementation((selector: any) =>
      selector({
        game: defaultGameState,
        room: { ...defaultRoomState, id: 'room-42', isPlaying: false, isAdmin: false },
        theme: defaultThemeState,
        spectrums: defaultSpectrumsState
      })
    );

    render(<MemoryRouter><Game /></MemoryRouter>);

    expect(mockDispatch).not.toHaveBeenCalledWith(
      expect.objectContaining({ type: 'room/startGame' })
    );
  });

  it('go to / if not in player list', () => {
    vi.mocked(reactRedux.useSelector).mockImplementation((selector: any) =>
      selector({
        game: defaultGameState,
        room: {
          ...defaultRoomState,
          isPlaying: false,
          id: 'room-42',
          yourId: 99,
          players: [{ id: 0, name: 'gugus' }, { id: 1, name: 'other' }]
        },
        theme: defaultThemeState,
        spectrums: defaultSpectrumsState
      })
    );

    render(<MemoryRouter><Game /></MemoryRouter>);

    fireEvent.click(screen.getByText('Go back to room'));

    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  describe('PreviewOffset', () => {
    beforeEach(() => {
      vi.mocked(renderCells).mockClear();
    });

    it('offset 1', () => {
      const nextPieceCells = ['fake-1'];
      vi.mocked(reactRedux.useSelector).mockImplementation((selector: any) =>
        selector({
          game: { ...defaultGameState, nextPiece: { cells: nextPieceCells, width: 1, height: 4 } },
          room: defaultRoomState, theme: defaultThemeState, spectrums: defaultSpectrumsState
        })
      );
      render(<MemoryRouter><Game /></MemoryRouter>);

      expect(renderCells).toHaveBeenCalledWith(nextPieceCells, 416, 64, 1, 4);
    });

    it('offset 2', () => {
      const nextPieceCells = ['fake-2'];
      vi.mocked(reactRedux.useSelector).mockImplementation((selector: any) =>
        selector({
          game: { ...defaultGameState, nextPiece: { cells: nextPieceCells, width: 2, height: 2 } },
          room: defaultRoomState, theme: defaultThemeState, spectrums: defaultSpectrumsState
        })
      );
      render(<MemoryRouter><Game /></MemoryRouter>);

      expect(renderCells).toHaveBeenCalledWith(nextPieceCells, 384, 32, 2, 2);
    });

    it('offset 3', () => {
      const nextPieceCells = ['fake-3'];
      vi.mocked(reactRedux.useSelector).mockImplementation((selector: any) =>
        selector({
          game: { ...defaultGameState, nextPiece: { cells: nextPieceCells, width: 3, height: 2 } },
          room: defaultRoomState, theme: defaultThemeState, spectrums: defaultSpectrumsState
        })
      );
      render(<MemoryRouter><Game /></MemoryRouter>);

      expect(renderCells).toHaveBeenCalledWith(nextPieceCells, 384, 32, 3, 2);
    });

    it('offset 4', () => {
      const nextPieceCells = ['fake-4'];
      vi.mocked(reactRedux.useSelector).mockImplementation((selector: any) =>
        selector({
          game: { ...defaultGameState, nextPiece: { cells: nextPieceCells, width: 4, height: 4 } },
          room: defaultRoomState, theme: defaultThemeState, spectrums: defaultSpectrumsState
        })
      );
      render(<MemoryRouter><Game /></MemoryRouter>);

      expect(renderCells).toHaveBeenCalledWith(nextPieceCells, 352, 0, 4, 4);
    });
  });

  describe('NavState', () => {
    it('location.state null', () => {
      vi.mocked(reactRouterDom.useLocation).mockReturnValue({ state: null } as any);

      vi.mocked(reactRedux.useSelector).mockImplementation((selector: any) =>
        selector({
          game: defaultGameState,
          room: { ...defaultRoomState, id: '' },
          theme: defaultThemeState,
          spectrums: defaultSpectrumsState
        })
      );

      render(<MemoryRouter><Game /></MemoryRouter>);

      expect(mockDispatch).not.toHaveBeenCalledWith(
        expect.objectContaining({ type: 'mock/initRoom' })
      );

      expect(screen.getByText('Multi player game')).toBeDefined();
    });
  });

  describe('ResizeObserver errors', () => {
    it('ResizeObserver not define', () => {
      const originalRO = global.ResizeObserver;

      (global.ResizeObserver as any) = undefined;

      expect(() => {
        render(<MemoryRouter><Game /></MemoryRouter>);
      }).not.toThrow();

      global.ResizeObserver = originalRO;
    });
  });

  it('does not send socket action if room id is empty', () => {
    vi.mocked(reactRedux.useSelector).mockImplementation((selector: any) =>
      selector({
        game: defaultGameState,
        room: {
          ...defaultRoomState,
          id: '',
        },
        theme: defaultThemeState,
        spectrums: defaultSpectrumsState
      })
    );

    render(
      <MemoryRouter>
        <Game />
      </MemoryRouter>
    );

    fireEvent.keyDown(window, { key: 'ArrowLeft' });

    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'mock/movePiece',
      payload: { right: false }
    });

    expect(mockDispatch).not.toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'game/action'
      })
    );
  });

  it('does not start solo game when already playing', () => {
    vi.mocked(reactRouterDom.useLocation).mockReturnValue({
      state: { mode: 'solo' }
    } as any);

    vi.mocked(reactRedux.useSelector).mockImplementation((selector: any) =>
      selector({
        game: defaultGameState,
        room: {
          ...defaultRoomState,
          id: 'room-42',
          isPlaying: true,
          isAdmin: true
        },
        theme: defaultThemeState,
        spectrums: defaultSpectrumsState
      })
    );

    render(<MemoryRouter><Game /></MemoryRouter>);

    expect(mockDispatch).not.toHaveBeenCalledWith(
      expect.objectContaining({ type: 'room/startGame' })
    );
  });
});
