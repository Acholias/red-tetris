import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import DevCredits from './DevCredits';

// 1. Mock de React Router pour tester la navigation
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('DevCredits Component', () => {

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('devrait afficher le titre principal', () => {
    render(
      <MemoryRouter>
        <DevCredits />
      </MemoryRouter>
    );

    // On cherche un <h1> (level: 1) contenant le texte 'developers'
    const title = screen.getByRole('heading', { level: 1, name: 'developers' });
    expect(title).toBeDefined();
  });

  it('devrait afficher les informations des développeurs', () => {
    render(
      <MemoryRouter>
        <DevCredits />
      </MemoryRouter>
    );

    // Vérifications pour Lumugot
    expect(screen.getByText('Designer')).toBeDefined();
    expect(screen.getByText('Creation of the project pages design')).toBeDefined();

    // On récupère l'image via l'aria-label de l'article parent
    const dev1Article = screen.getByLabelText('Developer 1');
    const dev1Image = dev1Article.querySelector('img');
    expect(dev1Image?.getAttribute('src')).toBe('/avatarsdevs/lumugot.png');

    // Vérifications pour Aderouba
    expect(screen.getByText('Game Creator')).toBeDefined();
    expect(screen.getByText('Creation of the game engine and rules')).toBeDefined();

    const dev2Article = screen.getByLabelText('Developer 2');
    const dev2Image = dev2Article.querySelector('img');
    expect(dev2Image?.getAttribute('src')).toBe('/avatarsdevs/aderouba.png');
  });

  it('devrait naviguer vers la page précédente ("../") au clic sur "Home page"', () => {
    render(
      <MemoryRouter>
        <DevCredits />
      </MemoryRouter>
    );

    const homeButton = screen.getByRole('button', { name: 'Home page' });
    fireEvent.click(homeButton);

    expect(mockNavigate).toHaveBeenCalledWith('../');
    expect(mockNavigate).toHaveBeenCalledTimes(1);
  });
});
