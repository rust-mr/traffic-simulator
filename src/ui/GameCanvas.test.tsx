import { act, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createInitialSettings, useGameStore } from '../store/gameStore';
import { GameCanvas } from './GameCanvas';

type TickCallback = (ticker: { deltaMS: number }) => void;

// Pixi needs WebGL, which jsdom lacks, so the app and the scene are replaced with fakes.
const mocks = vi.hoisted(() => {
    const state = {
        tickCallbacks: [] as TickCallback[],
        resolveInit: null as (() => void) | null,
        isInitDeferred: false,
    };
    return {
        state,
        init: vi.fn(
            () =>
                new Promise<void>((resolve) => {
                    if (state.isInitDeferred) {
                        state.resolveInit = resolve;
                    } else {
                        resolve();
                    }
                }),
        ),
        destroy: vi.fn(),
        resize: vi.fn(),
        setLightPhase: vi.fn(),
    };
});

vi.mock('pixi.js', () => ({
    Application: class {
        canvas = document.createElement('canvas');
        stage = { addChild: vi.fn() };
        screen = { width: 800, height: 600 };
        ticker = {
            add: (callback: TickCallback) => {
                mocks.state.tickCallbacks.push(callback);
            },
        };
        init = mocks.init;
        destroy = mocks.destroy;
    },
}));

vi.mock('../render/crossroadScene', () => ({
    createCrossroadScene: () => ({
        container: {},
        resize: mocks.resize,
        setLightPhase: mocks.setLightPhase,
    }),
}));

function tick(deltaMS: number): void {
    act(() => {
        mocks.state.tickCallbacks.forEach((callback) => {
            callback({ deltaMS });
        });
    });
}

async function renderReady(): Promise<ReturnType<typeof render>> {
    const result = render(<GameCanvas />);
    await waitFor(() => {
        expect(mocks.state.tickCallbacks).toHaveLength(1);
    });
    return result;
}

describe('GameCanvas', () => {
    beforeEach(() => {
        useGameStore.setState(createInitialSettings());
        mocks.state.tickCallbacks = [];
        mocks.state.resolveInit = null;
        mocks.state.isInitDeferred = false;
        vi.clearAllMocks();
    });

    it('mounts the Pixi canvas into its host element', async () => {
        await renderReady();

        expect(screen.getByTestId('game-canvas').querySelector('canvas')).not.toBeNull();
    });

    it('sizes the scene to the screen on the first frame', async () => {
        await renderReady();

        tick(16);

        expect(mocks.resize).toHaveBeenCalledWith(800, 600);
    });

    it('advances the traffic light and reports phase changes to the store', async () => {
        await renderReady();

        // Default red phase lasts 10 seconds.
        tick(10_000);

        expect(mocks.setLightPhase).toHaveBeenLastCalledWith('green');
        expect(useGameStore.getState().lightPhase).toBe('green');
    });

    it('applies the speed multiplier', async () => {
        useGameStore.setState({ speed: 2 });
        await renderReady();

        tick(5_000);

        expect(useGameStore.getState().lightPhase).toBe('green');
    });

    it('does not advance while paused', async () => {
        useGameStore.setState({ isPaused: true });
        await renderReady();

        tick(60_000);

        expect(useGameStore.getState().lightPhase).toBe('red');
    });

    it('destroys the Pixi app on unmount', async () => {
        const { unmount } = await renderReady();

        unmount();

        expect(mocks.destroy).toHaveBeenCalledTimes(1);
    });

    it('destroys the app when unmounted before init finishes', async () => {
        mocks.state.isInitDeferred = true;
        const { unmount } = render(<GameCanvas />);

        unmount();
        expect(mocks.destroy).not.toHaveBeenCalled();

        await act(async () => {
            mocks.state.resolveInit?.();
        });

        expect(mocks.destroy).toHaveBeenCalledTimes(1);
        expect(mocks.state.tickCallbacks).toHaveLength(0);
    });
});
