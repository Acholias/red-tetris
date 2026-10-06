import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import * as reactRedux from 'react-redux';
import Spectator from './Spectator';

// Mock
let mockResizeCallback: any;
let mockObservedElements: any[] = [];

global.ResizeObserver = class {
  constructor(cb: any) {
    mockResizeCallback = cb;
  }
  observe = vi.fn((el: any) => {
    mockObservedElements.push(el);
  });
  unobserve = vi.fn();
  disconnect = vi.fn();
} as any;
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const mockDispatch = vi.fn();
vi.mock('react-redux', () => ({
  useDispatch: () => mockDispatch,
  useSelector: vi.fn(),
}));

vi.mock('../../gameEngine/logic/spectrumsSlice', () => ({
  clearSpectrums: vi.fn(() => ({ type: 'mock/clearSpectrums' })),
  initSpectrums: vi.fn((payload) => ({ type: 'mock/initSpectrums', payload })),
}));

vi.mock('../../gameEngine/render/render', () => ({
  renderSpectrum: vi.fn((spectrum) => <div data-testid={`mock-spectrum-${spectrum.id}`} />),
}));

vi.mock('../../theme/theme', () => ({
  createSpectrumTheme: vi.fn(() => ({})),
}));

describe('Spectator page', () => {
  const defaultRoomState = {
    id: 'room-spectate-123',
    size: { w: 10, h: 20 },
    players: [
      { id: 10, name: 'aderouba' },
      { id: 20, name: 'lumugot' },
    ],
    spectators: [
      { id: 42, name: '42' },
    ],
  };

  const defaultSpectrumsState = {
    10: { id: 10, grid: { width: 10, height: 20 } },
    20: { id: 20, grid: { width: 10, height: 20 } },
  };

  const defaultThemeState = {};

  beforeEach(() => {
    vi.clearAllMocks();
    mockObservedElements = [];

    vi.mocked(reactRedux.useSelector).mockImplementation((selector: any) =>
      selector({
        room: { ...defaultRoomState },
        spectrums: { ...defaultSpectrumsState },
        theme: { ...defaultThemeState },
      })
    );
  });

  describe('Render', () => {
    it('render headers', () => {
      render(
        <MemoryRouter>
          <Spectator />
        </MemoryRouter>
      );

      expect(screen.getByText('Spectator')).toBeDefined();
      expect(screen.getByText('Room: room-spectate-123')).toBeDefined();
      expect(screen.getByText('2 players')).toBeDefined();
    });

    it('display singular "player"', () => {
      vi.mocked(reactRedux.useSelector).mockImplementation((selector: any) =>
        selector({
          room: { ...defaultRoomState, players: [{ id: 10, name: 'aderouba' }] },
          spectrums: { ...defaultSpectrumsState },
          theme: { ...defaultThemeState },
        })
      );

      render(
        <MemoryRouter>
          <Spectator />
        </MemoryRouter>
      );

      expect(screen.getByText('1 player')).toBeDefined();
    });
  });

  describe('Navigation', () => {
    it('navigate to "/" when clicking on Leave button', () => {
      render(
        <MemoryRouter>
          <Spectator />
        </MemoryRouter>
      );

      const leaveButton = screen.getByText('Go back to room');
      fireEvent.click(leaveButton);

      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  describe('Effects & Dispatches', () => {
    it('not dispatch if no room ID', () => {
      vi.mocked(reactRedux.useSelector).mockImplementation((selector: any) =>
        selector({
          room: { ...defaultRoomState, id: '' },
          spectrums: { ...defaultSpectrumsState },
          theme: { ...defaultThemeState },
        })
      );

      render(
        <MemoryRouter>
          <Spectator />
        </MemoryRouter>
      );

      expect(mockDispatch).not.toHaveBeenCalled();
    });

    it('dispatch clearSpectrums and initSpectrums on mount if room ID is present', () => {
      render(
        <MemoryRouter>
          <Spectator />
        </MemoryRouter>
      );

      expect(mockDispatch).toHaveBeenCalledWith({ type: 'mock/clearSpectrums' });
      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'mock/initSpectrums',
        payload: {
          room: expect.objectContaining({ id: 'room-spectate-123' }),
          skipCurrentPlayer: false,
        },
      });
    });
  });

  describe('Spectrums Layout', () => {
    it('map and render the center spectrum and side spectrums correctly', () => {
      render(
        <MemoryRouter>
          <Spectator />
        </MemoryRouter>
      );

      expect(screen.getByTestId('mock-spectrum-10')).toBeDefined();

      expect(screen.getByTestId('mock-spectrum-20')).toBeDefined();
    });
  });

  describe('have players', () => {
    it('dispatch initSpectrums when there are players in the room', () => {
      vi.mocked(reactRedux.useSelector).mockImplementation((selector: any) =>
        selector({
          room: {
            id: 'room-42',
            size: { w: 10, h: 20 },
            players: [{ id: 1, name: 'Gugus' }] // .length = 1 (> 0)
          },
          spectrums: {},
          theme: {}
        })
      );

      render(
        <MemoryRouter>
          <Spectator />
        </MemoryRouter>
      );

      expect(mockDispatch).toHaveBeenCalledWith({ type: 'mock/clearSpectrums' });
      expect(mockDispatch).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'mock/initSpectrums' })
      );
    });

    it('no dispatch initSpectrums when the players array is empty', () => {
      vi.mocked(reactRedux.useSelector).mockImplementation((selector: any) =>
        selector({
          room: {
            id: 'room-42',
            size: { w: 10, h: 20 },
            players: []
          },
          spectrums: {},
          theme: {}
        })
      );

      render(
        <MemoryRouter>
          <Spectator />
        </MemoryRouter>
      );

      expect(mockDispatch).toHaveBeenCalledWith({ type: 'mock/clearSpectrums' });

      expect(mockDispatch).not.toHaveBeenCalledWith(
        expect.objectContaining({ type: 'mock/initSpectrums' })
      );
    });
  });

  it('5 players spectrums', () => {
    vi.mocked(reactRedux.useSelector).mockImplementation((selector: any) =>
      selector({
        room: {
          id: 'room-123',
          size: { w: 10, h: 20 },
          players: [
            { id: 10, name: 'aderouba' },
            { id: 20, name: 'lumugot' },
            { id: 30, name: 'uwu' },
            { id: 40, name: 'ahah' },
            { id: 50, name: 'test' },
          ],
        },
        spectrums: {
          10: { id: 10, grid: { width: 10, height: 20 } },
          20: { id: 20, grid: { width: 10, height: 20 } },
          30: { id: 30, grid: { width: 10, height: 20 } },
          40: { id: 40, grid: { width: 10, height: 20 } },
          50: { id: 50, grid: { width: 10, height: 20 } },
        },
        theme: {},
      })
    );

    render(
      <MemoryRouter>
        <Spectator />
      </MemoryRouter>
    );
    expect(screen.getByTestId('mock-spectrum-50')).toBeDefined();
  });

  it('leave button', () => {
    vi.mocked(reactRedux.useSelector).mockImplementation((selector: any) =>
      selector({
        game: {
          isEnd: true,
          win: undefined,
          speed: { speed: 10 },
          grid: { cells: [], width: 10, height: 20 },
          piece: { cells: [], x: 5, y: 0, width: 4, height: 4 },
          nextPiece: { cells: [], width: 4, height: 4 },
        },
        room: {
          ...defaultRoomState,
          isPlaying: false,
          id: '',
          yourId: 42,
          spectators: [{ id: 42, name: '42' }]
        },
        theme: defaultThemeState,
        spectrums: defaultSpectrumsState
      })
    );

    render(<MemoryRouter><Spectator /></MemoryRouter>);

    fireEvent.click(screen.getByText('Go back to room'));

    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('leave button', () => {
    vi.mocked(reactRedux.useSelector).mockImplementation((selector: any) =>
      selector({
        game: {
          isEnd: true,
          win: undefined,
          speed: { speed: 10 },
          grid: { cells: [], width: 10, height: 20 },
          piece: { cells: [], x: 5, y: 0, width: 4, height: 4 },
          nextPiece: { cells: [], width: 4, height: 4 },
        },
        room: {
          ...defaultRoomState,
          isPlaying: false,
          id: 'room-42',
          yourId: 42,
          spectators: [{ id: 42, name: '42' }]
        },
        theme: defaultThemeState,
        spectrums: defaultSpectrumsState
      })
    );

    render(<MemoryRouter><Spectator /></MemoryRouter>);

    fireEvent.click(screen.getByText('Go back to room'));

    expect(mockNavigate).toHaveBeenCalledWith('/room-42/42');
  });

  describe('ResizeObserver', () => {
    it('observes center and side panels and resizes themes', async () => {
      const { container } = render(
        <MemoryRouter>
          <Spectator />
        </MemoryRouter>
      );
      const { createSpectrumTheme } = await import('../../theme/theme');

      const centerPanel = container.querySelector('.game-center') as HTMLElement;
      const sideFrame = container.querySelector('.game-side .game-frame') as HTMLElement;
      expect(mockObservedElements).toContain(centerPanel);
      expect(mockObservedElements).toContain(sideFrame);

      vi.mocked(createSpectrumTheme).mockClear();

      await act(async () => {
        mockResizeCallback([{ target: centerPanel, contentRect: { width: 500, height: 800 } }]);
      });
      // center 500x800, grid 10x20 -> safe 476x720 -> min(47.6, 36) = 36
      expect(createSpectrumTheme).toHaveBeenCalledWith(expect.anything(), 0, 36, expect.anything());

      await act(async () => {
        mockResizeCallback([{ target: sideFrame, contentRect: { width: 500, height: 800 } }]);
      });
      // side 500x800, grid 10x20 -> min(47.6, 36) = 36 clamped to max 40
      expect(createSpectrumTheme).toHaveBeenCalledWith(expect.anything(), 0, 36, expect.anything());
    });

    it('ignores entries for unknown targets', async () => {
      const { container } = render(
        <MemoryRouter>
          <Spectator />
        </MemoryRouter>
      );
      expect(() => {
        mockResizeCallback([{ target: document.createElement('div'), contentRect: { width: 500, height: 500 } }]);
      }).not.toThrow();
      expect(container.querySelector('.game-center')).toBeDefined();
    });

    it('does not crash when ResizeObserver is undefined', () => {
      const originalRO = global.ResizeObserver;
      (global as any).ResizeObserver = undefined;

      expect(() => {
        render(
          <MemoryRouter>
            <Spectator />
          </MemoryRouter>
        );
      }).not.toThrow();

      global.ResizeObserver = originalRO;
    });
  });
});
