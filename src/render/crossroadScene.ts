import { Container, Graphics } from 'pixi.js';
import { LIGHT_PHASES, type LightPhase } from '../simulation/trafficLight';
import { getCrossroadLayout, type Rect } from './layout';

export const SCENE_COLORS = {
    grass: 0x4f7942,
    road: 0x3a3a3a,
    marking: 0xf2f2f2,
    lightHousing: 0x1b1b1b,
    lightOff: 0x333333,
    green: 0x2ecc71,
    yellow: 0xf1c40f,
    red: 0xe74c3c,
} as const;

const STRIPE_SIZE = 8;
const LAMP_RADIUS = 8;
const LAMP_GAP = 4;

export interface CrossroadScene {
    container: Container;
    resize: (width: number, height: number) => void;
    setLightPhase: (phase: LightPhase) => void;
}

function drawStripes(graphics: Graphics, rect: Rect): void {
    const isAcrossX = rect.width >= rect.height;
    const length = isAcrossX ? rect.width : rect.height;

    for (let offset = STRIPE_SIZE / 2; offset + STRIPE_SIZE <= length; offset += STRIPE_SIZE * 2) {
        if (isAcrossX) {
            graphics.rect(rect.x + offset, rect.y + 2, STRIPE_SIZE, rect.height - 4);
        } else {
            graphics.rect(rect.x + 2, rect.y + offset, rect.width - 4, STRIPE_SIZE);
        }
    }
    graphics.fill(SCENE_COLORS.marking);
}

/** Static crossroad background plus a single traffic light. Placeholder until lanes and agents exist. */
export function createCrossroadScene(): CrossroadScene {
    const container = new Container();
    const ground = new Graphics();
    const light = new Graphics();
    container.addChild(ground, light);

    let currentPhase: LightPhase = 'red';
    let lightX = 0;
    let lightBottom = 0;

    const drawLight = (): void => {
        const housingWidth = LAMP_RADIUS * 2 + LAMP_GAP * 2;
        const housingHeight = LIGHT_PHASES.length * (LAMP_RADIUS * 2 + LAMP_GAP) + LAMP_GAP;

        const lightY = lightBottom - housingHeight;

        light.clear();
        light
            .roundRect(lightX, lightY, housingWidth, housingHeight, 4)
            .fill(SCENE_COLORS.lightHousing);

        // Top to bottom: red, yellow, green.
        [...LIGHT_PHASES].reverse().forEach((phase, index) => {
            const color = phase === currentPhase ? SCENE_COLORS[phase] : SCENE_COLORS.lightOff;
            light
                .circle(
                    lightX + housingWidth / 2,
                    lightY + LAMP_GAP + LAMP_RADIUS + index * (LAMP_RADIUS * 2 + LAMP_GAP),
                    LAMP_RADIUS,
                )
                .fill(color);
        });
    };

    const resize = (width: number, height: number): void => {
        const layout = getCrossroadLayout(width, height);

        ground.clear();
        ground.rect(0, 0, width, height).fill(SCENE_COLORS.grass);
        ground.rect(
            layout.horizontalRoad.x,
            layout.horizontalRoad.y,
            layout.horizontalRoad.width,
            layout.horizontalRoad.height,
        );
        ground.rect(
            layout.verticalRoad.x,
            layout.verticalRoad.y,
            layout.verticalRoad.width,
            layout.verticalRoad.height,
        );
        ground.fill(SCENE_COLORS.road);
        layout.crosswalks.forEach((crosswalk) => {
            drawStripes(ground, crosswalk);
        });

        lightX = layout.lightPosition.x;
        lightBottom = layout.lightPosition.y;
        drawLight();
    };

    const setLightPhase = (phase: LightPhase): void => {
        if (phase !== currentPhase) {
            currentPhase = phase;
            drawLight();
        }
    };

    return { container, resize, setLightPhase };
}
