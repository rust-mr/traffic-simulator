import { Application } from 'pixi.js';
import { useEffect, useRef } from 'react';
import { createCrossroadScene } from '../render/crossroadScene';
import { createTrafficLight, tickTrafficLight } from '../simulation/trafficLight';
import { useGameStore } from '../store/gameStore';

/**
 * Hosts the Pixi canvas and runs the game loop.
 * The loop reads settings with `getState()` instead of subscribing, so React never re-renders per frame.
 */
export function GameCanvas() {
    const hostRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const host = hostRef.current;
        if (!host) {
            return;
        }

        const app = new Application();
        let isReady = false;
        let isDisposed = false;

        const start = async (): Promise<void> => {
            await app.init({ resizeTo: host, antialias: true });

            // The component may unmount while init is pending (e.g. React StrictMode).
            if (isDisposed) {
                app.destroy(true);
                return;
            }
            isReady = true;
            host.appendChild(app.canvas);

            const scene = createCrossroadScene();
            app.stage.addChild(scene.container);

            let light = createTrafficLight(useGameStore.getState().lightPhase);
            let width = 0;
            let height = 0;
            scene.setLightPhase(light.phase);

            app.ticker.add((ticker) => {
                if (app.screen.width !== width || app.screen.height !== height) {
                    width = app.screen.width;
                    height = app.screen.height;
                    scene.resize(width, height);
                }

                const state = useGameStore.getState();
                if (state.isPaused) {
                    return;
                }

                const dt = (ticker.deltaMS / 1000) * state.speed;
                light = tickTrafficLight(light, dt, state.durations);
                scene.setLightPhase(light.phase);

                if (light.phase !== state.lightPhase) {
                    state.setLightPhase(light.phase);
                }
            });
        };

        void start();

        return () => {
            isDisposed = true;
            if (isReady) {
                app.destroy(true, { children: true });
            }
        };
    }, []);

    return <div ref={hostRef} className="game-canvas" data-testid="game-canvas" />;
}
