import { describe, expect, it } from 'vitest';
import { CROSSWALK_DEPTH, LIGHT_OFFSET, getCrossroadLayout } from './layout';

describe('getCrossroadLayout', () => {
    it('centers the intersection in the area', () => {
        const layout = getCrossroadLayout(800, 600, 100);

        expect(layout.center).toEqual({ x: 400, y: 300 });
        expect(layout.intersection).toEqual({ x: 350, y: 250, width: 100, height: 100 });
    });

    it('stretches roads across the whole area', () => {
        const layout = getCrossroadLayout(800, 600, 100);

        expect(layout.horizontalRoad).toEqual({ x: 0, y: 250, width: 800, height: 100 });
        expect(layout.verticalRoad).toEqual({ x: 350, y: 0, width: 100, height: 600 });
    });

    it('places a crosswalk on each side of the intersection', () => {
        const [north, east, south, west] = getCrossroadLayout(800, 600, 100).crosswalks;

        expect(north).toEqual({
            x: 350,
            y: 250 - CROSSWALK_DEPTH,
            width: 100,
            height: CROSSWALK_DEPTH,
        });
        expect(east).toEqual({ x: 450, y: 250, width: CROSSWALK_DEPTH, height: 100 });
        expect(south).toEqual({ x: 350, y: 350, width: 100, height: CROSSWALK_DEPTH });
        expect(west).toEqual({
            x: 350 - CROSSWALK_DEPTH,
            y: 250,
            width: CROSSWALK_DEPTH,
            height: 100,
        });
    });

    it('places the light outside the roads at the north-east corner', () => {
        const { lightPosition } = getCrossroadLayout(800, 600, 100);

        expect(lightPosition).toEqual({ x: 450 + LIGHT_OFFSET, y: 250 - LIGHT_OFFSET });
    });

    it('limits road width to the smaller side of the area', () => {
        const layout = getCrossroadLayout(300, 120, 160);

        expect(layout.horizontalRoad.height).toBe(120);
        expect(layout.verticalRoad.width).toBe(120);
    });

    it('handles an empty area without negative sizes', () => {
        const layout = getCrossroadLayout(0, 0);

        expect(layout.intersection.width).toBe(0);
        expect(layout.intersection.height).toBe(0);
    });
});
