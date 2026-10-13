import { LIGHT_PHASES } from '../simulation/trafficLight';
import {
    MAX_PHASE_DURATION,
    MIN_PHASE_DURATION,
    SPEED_OPTIONS,
    useGameStore,
} from '../store/gameStore';

const PHASE_LABELS = {
    green: 'Green',
    yellow: 'Yellow',
    red: 'Red',
} as const;

export function ControlPanel() {
    const isPaused = useGameStore((state) => state.isPaused);
    const speed = useGameStore((state) => state.speed);
    const durations = useGameStore((state) => state.durations);
    const lightPhase = useGameStore((state) => state.lightPhase);
    const togglePause = useGameStore((state) => state.togglePause);
    const setSpeed = useGameStore((state) => state.setSpeed);
    const setPhaseDuration = useGameStore((state) => state.setPhaseDuration);

    return (
        <aside className="control-panel">
            <h1>Traffic Simulator</h1>

            <p className="control-panel__status">
                Light: <strong data-testid="light-phase">{PHASE_LABELS[lightPhase]}</strong>
            </p>

            <div className="control-panel__row">
                <button type="button" onClick={togglePause}>
                    {isPaused ? 'Resume' : 'Pause'}
                </button>

                <label>
                    Speed{' '}
                    <select
                        value={speed}
                        onChange={(event) => {
                            setSpeed(Number(event.target.value));
                        }}
                    >
                        {SPEED_OPTIONS.map((option) => (
                            <option key={option} value={option}>
                                {option}x
                            </option>
                        ))}
                    </select>
                </label>
            </div>

            <fieldset>
                <legend>Phase durations (seconds)</legend>
                {LIGHT_PHASES.map((phase) => (
                    <label key={phase} className="control-panel__field">
                        {PHASE_LABELS[phase]}
                        <input
                            type="number"
                            min={MIN_PHASE_DURATION}
                            max={MAX_PHASE_DURATION}
                            step={1}
                            value={durations[phase]}
                            onChange={(event) => {
                                setPhaseDuration(phase, event.target.valueAsNumber);
                            }}
                        />
                    </label>
                ))}
            </fieldset>
        </aside>
    );
}
