import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { App } from './App';

vi.mock('./ui/GameCanvas', () => ({
    GameCanvas: () => <div data-testid="game-canvas" />,
}));

describe('App', () => {
    it('renders the control panel and the game canvas', () => {
        render(<App />);

        expect(screen.getByRole('heading', { name: 'Traffic Simulator' })).toBeInTheDocument();
        expect(screen.getByTestId('game-canvas')).toBeInTheDocument();
    });
});
