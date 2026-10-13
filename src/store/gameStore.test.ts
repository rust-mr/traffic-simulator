import { beforeEach, describe, expect, it } from 'vitest';
import {
    MAX_PHASE_DURATION,
    MIN_PHASE_DURATION,
    createInitialSettings,
    useGameStore,
} from './gameStore';

describe('gameStore', () => {
    beforeEach(() => {
        useGameStore.setState(createInitialSettings());
    });

    it('toggles pause', () => {
        useGameStore.getState().togglePause();
        expect(useGameStore.getState().isPaused).toBe(true);

        useGameStore.getState().togglePause();
        expect(useGameStore.getState().isPaused).toBe(false);
    });

    it('sets a positive speed', () => {
        useGameStore.getState().setSpeed(2);

        expect(useGameStore.getState().speed).toBe(2);
    });

    it('ignores non-positive speed', () => {
        useGameStore.getState().setSpeed(0);

        expect(useGameStore.getState().speed).toBe(1);
    });

    it('updates a single phase duration', () => {
        useGameStore.getState().setPhaseDuration('green', 15);

        expect(useGameStore.getState().durations).toEqual({ green: 15, yellow: 2, red: 10 });
    });

    it('clamps phase durations to the allowed range', () => {
        const { setPhaseDuration } = useGameStore.getState();

        setPhaseDuration('green', 0);
        expect(useGameStore.getState().durations.green).toBe(MIN_PHASE_DURATION);

        setPhaseDuration('green', 1000);
        expect(useGameStore.getState().durations.green).toBe(MAX_PHASE_DURATION);

        setPhaseDuration('green', Number.NaN);
        expect(useGameStore.getState().durations.green).toBe(MIN_PHASE_DURATION);
    });

    it('stores the phase reported by the simulation', () => {
        useGameStore.getState().setLightPhase('green');

        expect(useGameStore.getState().lightPhase).toBe('green');
    });
});
