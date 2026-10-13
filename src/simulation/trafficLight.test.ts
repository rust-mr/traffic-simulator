import { describe, expect, it } from 'vitest';
import { createTrafficLight, tickTrafficLight, type PhaseDurations } from './trafficLight';

const durations: PhaseDurations = { green: 5, yellow: 2, red: 4 };

describe('trafficLight', () => {
    it('starts red with no elapsed time by default', () => {
        expect(createTrafficLight()).toEqual({ phase: 'red', elapsed: 0 });
    });

    it('accumulates time within a phase', () => {
        const light = tickTrafficLight(createTrafficLight('green'), 3, durations);

        expect(light).toEqual({ phase: 'green', elapsed: 3 });
    });

    it('cycles green -> yellow -> red -> green', () => {
        let light = createTrafficLight('green');

        light = tickTrafficLight(light, 5, durations);
        expect(light.phase).toBe('yellow');

        light = tickTrafficLight(light, 2, durations);
        expect(light.phase).toBe('red');

        light = tickTrafficLight(light, 4, durations);
        expect(light.phase).toBe('green');
    });

    it('carries leftover time into the next phase', () => {
        const light = tickTrafficLight(createTrafficLight('green'), 6, durations);

        expect(light).toEqual({ phase: 'yellow', elapsed: 1 });
    });

    it('skips several phases on a large step', () => {
        // 5 green + 2 yellow + 4 red = 11, then 1 more second of green.
        const light = tickTrafficLight(createTrafficLight('green'), 12, durations);

        expect(light).toEqual({ phase: 'green', elapsed: 1 });
    });

    it('ignores negative time steps', () => {
        const light = tickTrafficLight(createTrafficLight('green'), -3, durations);

        expect(light).toEqual({ phase: 'green', elapsed: 0 });
    });

    it('does not mutate the input state', () => {
        const light = createTrafficLight('green');

        tickTrafficLight(light, 6, durations);

        expect(light).toEqual({ phase: 'green', elapsed: 0 });
    });

    it('rejects non-positive durations', () => {
        expect(() =>
            tickTrafficLight(createTrafficLight(), 1, { ...durations, yellow: 0 }),
        ).toThrow(/yellow/);
    });
});
