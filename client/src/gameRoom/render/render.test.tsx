import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { renderPlayer } from './render';
import type { Player } from '../data/player';

describe('renderPlayer', () => {
    it('render you', () => {
        const player: Player = { id: 42, name: 'aderouba' };
        const yourId = 42;

        const { container } = render(renderPlayer(player, yourId));

        expect(container.firstChild).toHaveProperty('className', 'player-you');
        expect(container.textContent).toBe('aderouba');
    });

    it('render other', () => {
        const player: Player = { id: 42, name: 'aderouba' };
        const yourId = 0;

        const { container } = render(renderPlayer(player, yourId));

        expect(container.firstChild).toHaveProperty('className', 'player-item');
        expect(container.textContent).toBe('aderouba');
    });
});
