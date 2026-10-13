import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';
import { createInitialSettings, useGameStore } from '../store/gameStore';
import { ControlPanel } from './ControlPanel';

describe('ControlPanel', () => {
    beforeEach(() => {
        useGameStore.setState(createInitialSettings());
    });

    it('toggles pause from the button', async () => {
        const user = userEvent.setup();
        render(<ControlPanel />);

        await user.click(screen.getByRole('button', { name: 'Pause' }));

        expect(useGameStore.getState().isPaused).toBe(true);
        expect(screen.getByRole('button', { name: 'Resume' })).toBeInTheDocument();
    });

    it('changes simulation speed', async () => {
        const user = userEvent.setup();
        render(<ControlPanel />);

        await user.selectOptions(screen.getByLabelText(/speed/i), '2');

        expect(useGameStore.getState().speed).toBe(2);
    });

    it('shows current phase durations', () => {
        render(<ControlPanel />);

        expect(screen.getByLabelText('Green')).toHaveValue(8);
        expect(screen.getByLabelText('Yellow')).toHaveValue(2);
        expect(screen.getByLabelText('Red')).toHaveValue(10);
    });

    it('updates a phase duration', () => {
        render(<ControlPanel />);

        fireEvent.change(screen.getByLabelText('Green'), { target: { value: '15' } });

        expect(useGameStore.getState().durations.green).toBe(15);
        expect(screen.getByLabelText('Green')).toHaveValue(15);
    });

    it('shows the phase reported by the simulation', () => {
        render(<ControlPanel />);
        expect(screen.getByTestId('light-phase')).toHaveTextContent('Red');

        act(() => {
            useGameStore.getState().setLightPhase('green');
        });

        expect(screen.getByTestId('light-phase')).toHaveTextContent('Green');
    });
});
