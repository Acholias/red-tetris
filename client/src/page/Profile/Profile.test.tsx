import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Profile from './Profile';
import * as profileIdentity from '../../components/profileIdentity';

// Mock
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('../../components/profileIdentity', () => ({
  isDevPlayerName: vi.fn(),
  resolveAvatarForPlayer: vi.fn(),
}));

describe('Profile page', () => {
  const mockSetPlayerName = vi.fn();
  const mockSetAvatar = vi.fn();
  const mockSetTheme = vi.fn();

  const defaultProps = {
    playerName: 'aderouba',
    setPlayerName: mockSetPlayerName,
    avatar: 'avatar1.png',
    setAvatar: mockSetAvatar,
    theme: 'default' as const,
    setTheme: mockSetTheme,
  };

  beforeEach(() => {
    vi.clearAllMocks();

    // Mock avatar list fetch
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(['test-avatar1.png', 'test-avatar2.png']),
      } as Response)
    );

    // Initialise les mocks utilitaires par défaut
    vi.mocked(profileIdentity.resolveAvatarForPlayer).mockReturnValue('resolved-avatar.png');
    vi.mocked(profileIdentity.isDevPlayerName).mockReturnValue(false);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('default player data', async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <Profile {...defaultProps} />
        </MemoryRouter>
      );
    });

    expect(screen.getByText('Profile Page')).toBeDefined();
    expect(screen.getByDisplayValue('aderouba')).toBeDefined();
    const avatarImage = screen.getByAltText('Avatar preview');
    expect(avatarImage.getAttribute('src')).toBe('resolved-avatar.png');
  });

  it('load avatar list', async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <Profile {...defaultProps} />
        </MemoryRouter>
      );
    });

    const gearButton = screen.getByLabelText('Open avatar list');
    fireEvent.click(gearButton);

    await waitFor(() => {
      expect(screen.getByAltText('Avatar 1')).toBeDefined();
      expect(screen.getByAltText('Avatar 2')).toBeDefined();
    });
  });

  it('update localStorage', async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <Profile {...defaultProps} />
        </MemoryRouter>
      );
    });

    const theme3Button = screen.getByText('3').closest('button');
    fireEvent.click(theme3Button!);

    expect(theme3Button?.className).toContain('is-active');
    expect(mockSetTheme).not.toHaveBeenCalled();
  });

  it('change pseudo and add dev', async () => {
    vi.mocked(profileIdentity.isDevPlayerName).mockReturnValue(true);

    await act(async () => {
      render(
        <MemoryRouter>
          <Profile {...defaultProps} />
        </MemoryRouter>
      );
    });

    const nameInput = screen.getByDisplayValue('aderouba');
    fireEvent.change(nameInput, { target: { value: 'devUser' } });

    expect(nameInput.className).toContain('dev-name-input--gold');
    expect(mockSetPlayerName).not.toHaveBeenCalled();
  });

  it('remove avatar from localStorage', async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <Profile {...defaultProps} />
        </MemoryRouter>
      );
    });

    const removeBtn = screen.getByText('Remove photo');
    fireEvent.click(removeBtn);
  });

  it('save in localStorage / cookies', async () => {
    const setItemSpy = vi.spyOn(Storage.prototype, 'setItem');

    await act(async () => {
      render(
        <MemoryRouter>
          <Profile {...defaultProps} />
        </MemoryRouter>
      );
    });

    const nameInput = screen.getByDisplayValue('aderouba');
    fireEvent.change(nameInput, { target: { value: 'NewName' } });

    const theme4Button = screen.getByText('4').closest('button');
    fireEvent.click(theme4Button!);

    const applyBtn = screen.getByText('Apply changes');
    fireEvent.click(applyBtn);

    expect(mockSetPlayerName).toHaveBeenCalledWith('NewName');
    expect(mockSetTheme).toHaveBeenCalledWith('4');
    expect(mockSetAvatar).toHaveBeenCalledWith('avatar1.png');
    expect(setItemSpy).toHaveBeenCalledWith('avatar', 'avatar1.png');
    expect(screen.getByText('Profile updated successfully')).toBeDefined();
  });

  it('remove avatar from localStorage when null', async () => {
    const removeItemSpy = vi.spyOn(Storage.prototype, 'removeItem');

    await act(async () => {
      render(
        <MemoryRouter>
          <Profile {...defaultProps} avatar={null} />
        </MemoryRouter>
      );
    });

    const applyBtn = screen.getByText('Apply changes');
    fireEvent.click(applyBtn);

    expect(removeItemSpy).toHaveBeenCalledWith('avatar');
  });

  it('go back on close', async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <Profile {...defaultProps} />
        </MemoryRouter>
      );
    });

    const closeBtn = screen.getByText('X');
    fireEvent.click(closeBtn);

    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });

  it('go back on click outside', async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <Profile {...defaultProps} />
        </MemoryRouter>
      );
    });

    const overlay = screen.getByText('Profile Page').closest('.modal-overlay');
    fireEvent.click(overlay!);

    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });

  it('go back on Escape', async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <Profile {...defaultProps} />
        </MemoryRouter>
      );
    });

    fireEvent.keyDown(window, { key: 'Escape', code: 'Escape' });

    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });

  it('no got back on click inside', async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <Profile {...defaultProps} />
        </MemoryRouter>
      );
    });

    const modal = screen.getByText('Profile Page').closest('.modal-card');
    fireEvent.click(modal!);

    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('load default avatar on fetch fail', async () => {
    global.fetch = vi.fn(() => Promise.reject(new Error('Erreur réseau simulée')));

    await act(async () => {
      render(
        <MemoryRouter>
          <Profile {...defaultProps} />
        </MemoryRouter>
      );
    });

    const gearButton = screen.getByLabelText('Open avatar list');
    fireEvent.click(gearButton);

    await waitFor(() => {
      expect(screen.getByAltText('Avatar 1')).toBeDefined();
      expect(screen.getByAltText('Avatar 2')).toBeDefined();
      expect(screen.getByAltText('Avatar 3')).toBeDefined();
      expect(screen.getByAltText('Avatar 4')).toBeDefined();
      expect(screen.getByAltText('Avatar 5')).toBeDefined();
    });

    const avatar1 = screen.getByAltText('Avatar 1');
    expect(avatar1.getAttribute('src')).toBe('/avatars/avatar1.png');

    const avatar5 = screen.getByAltText('Avatar 5');
    expect(avatar5.getAttribute('src')).toBe('/avatars/avatar5.png');
  });

  it('catch errors when changes failed', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const testError = new Error('Erreur fatale simulée');

    const failingSetPlayerName = vi.fn().mockImplementation(() => {
      throw testError;
    });

    await act(async () => {
      render(
        <MemoryRouter>
          <Profile {...defaultProps} setPlayerName={failingSetPlayerName} />
        </MemoryRouter>
      );
    });

    const applyBtn = screen.getByText('Apply changes');
    fireEvent.click(applyBtn);

    expect(consoleSpy).toHaveBeenCalledWith('Failed to apply profile changes', testError);
    consoleSpy.mockRestore();
  });

  it('Update avatar and leave on option clic', async () => {
    vi.mocked(profileIdentity.resolveAvatarForPlayer).mockImplementation((name, avatar) => avatar || null);

    await act(async () => {
      render(
        <MemoryRouter>
          <Profile {...defaultProps} />
        </MemoryRouter>
      );
    });

    const gearButton = screen.getByLabelText('Open avatar list');
    fireEvent.click(gearButton);

    await waitFor(() => {
      expect(screen.getByAltText('Avatar 1')).toBeDefined();
    });

    const firstAvatarOption = screen.getByAltText('Avatar 1');
    fireEvent.click(firstAvatarOption);

    expect(screen.queryByAltText('Avatar 1')).toBeNull();

    const previewImage = screen.getByAltText('Avatar preview');
    expect(previewImage.getAttribute('src')).toBe('/avatars/test-avatar1.png');

    const applyBtn = screen.getByText('Apply changes');
    fireEvent.click(applyBtn);
    expect(mockSetAvatar).toHaveBeenCalledWith('/avatars/test-avatar1.png');
  });

  it('loal avatars', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({ ok: true, json: () => Promise.resolve({ erreur: 'pas un tableau' }) } as Response)
    );

    await act(async () => {
      render(
        <MemoryRouter>
          <Profile {...defaultProps} />
        </MemoryRouter>
      );
    });

    fireEvent.click(screen.getByLabelText('Open avatar list'));

    await waitFor(() => {
      expect(screen.getByAltText('Avatar 1')).toBeDefined();
    });
    expect(screen.getByAltText('Avatar 1').getAttribute('src')).toBe('/avatars/avatar1.png');
  });

  it('load default avatars', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({ ok: true, json: () => Promise.resolve([]) } as Response)
    );

    await act(async () => {
      render(
        <MemoryRouter>
          <Profile {...defaultProps} />
        </MemoryRouter>
      );
    });

    fireEvent.click(screen.getByLabelText('Open avatar list'));

    await waitFor(() => {
      expect(screen.getByAltText('Avatar 1')).toBeDefined();
    });
    expect(screen.getByAltText('Avatar 1').getAttribute('src')).toBe('/avatars/avatar1.png');
  });

  it('give "is-selected"', async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <Profile {...defaultProps} avatar="/avatars/test-avatar2.png" />
        </MemoryRouter>
      );
    });

    fireEvent.click(screen.getByLabelText('Open avatar list'));

    await waitFor(() => {
      expect(screen.getByAltText('Avatar 1')).toBeDefined();
    });

    const btnAvatar1 = screen.getByAltText('Avatar 1').closest('button');
    const btnAvatar2 = screen.getByAltText('Avatar 2').closest('button');

    expect(btnAvatar2?.className).toContain('is-selected');
    expect(btnAvatar1?.className).not.toContain('is-selected');
  });

  it('load default avatar on http error', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({ ok: false, status: 404 } as Response)
    );

    await act(async () => {
      render(
        <MemoryRouter>
          <Profile {...defaultProps} />
        </MemoryRouter>
      );
    });

    const gearButton = screen.getByLabelText('Open avatar list');
    fireEvent.click(gearButton);

    await waitFor(() => {
      expect(screen.getByAltText('Avatar 1')).toBeDefined();
    });

    expect(screen.getByAltText('Avatar 1').getAttribute('src')).toBe('/avatars/avatar1.png');
  });

  it('not go back when other key than espace is pressed', async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <Profile {...defaultProps} />
        </MemoryRouter>
      );
    });

    fireEvent.keyDown(window, { key: 'Enter', code: 'Enter' });

    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('display "No avatar"', async () => {
    vi.mocked(profileIdentity.resolveAvatarForPlayer).mockReturnValue(null);

    await act(async () => {
      render(
        <MemoryRouter>
          <Profile {...defaultProps} avatar={null} />
        </MemoryRouter>
      );
    });

    expect(screen.queryByAltText('Avatar preview')).toBeNull();
    expect(screen.getByText('No avatar')).toBeDefined();
  });
});
