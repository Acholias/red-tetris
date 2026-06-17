import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import * as reactRedux from 'react-redux';
import Spectator from './Spectator';

// Mock
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
  };

  const defaultSpectrumsState = {
    10: { id: 10 },
    20: { id: 20 },
  };

  const defaultThemeState = {};

  beforeEach(() => {
    vi.clearAllMocks();

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

      const leaveButton = screen.getByText('Leave');
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
          10: { id: 10 },
          20: { id: 20 },
          30: { id: 30 },
          40: { id: 40 },
          50: { id: 50 },
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
});
