export type LightPhase = 'green' | 'yellow' | 'red';

/** Duration of each phase, in seconds. */
export type PhaseDurations = Record<LightPhase, number>;

export interface TrafficLight {
    phase: LightPhase;
    /** Seconds spent in the current phase. */
    elapsed: number;
}

export const LIGHT_PHASES: readonly LightPhase[] = ['green', 'yellow', 'red'];

const NEXT_PHASE: Record<LightPhase, LightPhase> = {
    green: 'yellow',
    yellow: 'red',
    red: 'green',
};

export function createTrafficLight(phase: LightPhase = 'red'): TrafficLight {
    return { phase, elapsed: 0 };
}

/**
 * Advances the light by `dt` seconds and returns the new state.
 * Handles large steps that skip over several phases at once.
 */
export function tickTrafficLight(
    light: TrafficLight,
    dt: number,
    durations: PhaseDurations,
): TrafficLight {
    for (const phase of LIGHT_PHASES) {
        if (!(durations[phase] > 0)) {
            throw new Error(`Duration of "${phase}" phase must be positive.`);
        }
    }

    let phase = light.phase;
    let elapsed = light.elapsed + Math.max(0, dt);

    while (elapsed >= durations[phase]) {
        elapsed -= durations[phase];
        phase = NEXT_PHASE[phase];
    }

    return { phase, elapsed };
}
