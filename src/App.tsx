import './App.css';
import { ControlPanel } from './ui/ControlPanel';
import { GameCanvas } from './ui/GameCanvas';

export function App() {
    return (
        <div className="app">
            <ControlPanel />
            <main className="app__stage">
                <GameCanvas />
            </main>
        </div>
    );
}
