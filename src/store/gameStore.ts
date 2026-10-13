import { create } from 'zustand';
import type { LightPhase, PhaseDurations } from '../simulation/trafficLight';

export const SPEED_OPTIONS = [0.5, 1, 2, 4] as const;
export const MIN_PHASE_DURATION = 1;
export const MAX_PHASE_DURATION = 120;

export interface GameSettings {
    isPaused: boolean;
    speed: number;
    durations: PhaseDurations;
    /** Phase reported back by the simulation, for display in the UI. */
    lightPhase: LightPhase;
}

export interface GameActions {
    togglePause: () => void;
    setSpeed: (speed: number) => void;
    setPhaseDuration: (phase: LightPhase, seconds: number) => void;
    setLightPhase: (phase: LightPhase) => void;
}

export type GameState = GameSettings & GameActions;

export function createInitialSettings(): GameSettings {
    return {
        isPaused: false,
        speed: 1,
        durations: { green: 8, yellow: 2, red: 10 },
        lightPhase: 'red',
    };
}

function clampDuration(seconds: number): number {
    if (Number.isNaN(seconds)) {
        return MIN_PHASE_DURATION;
    }
    return Math.min(MAX_PHASE_DURATION, Math.max(MIN_PHASE_DURATION, seconds));
}

export const useGameStore = create<GameState>()((set) => ({
    ...createInitialSettings(),
    togglePause: () => {
        set((state) => ({ isPaused: !state.isPaused }));
    },
    setSpeed: (speed) => {
        if (speed > 0) {
            set({ speed });
        }
    },
    setPhaseDuration: (phase, seconds) => {
        set((state) => ({
            durations: { ...state.durations, [phase]: clampDuration(seconds) },
        }));
    },
    setLightPhase: (phase) => {
        set({ lightPhase: phase });
    },
}));
