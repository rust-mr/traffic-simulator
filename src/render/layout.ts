export interface Point {
    x: number;
    y: number;
}

export interface Rect {
    x: number;
    y: number;
    width: number;
    height: number;
}

export interface CrossroadLayout {
    center: Point;
    horizontalRoad: Rect;
    verticalRoad: Rect;
    intersection: Rect;
    /** Crosswalks on the north, east, south and west sides of the intersection. */
    crosswalks: Rect[];
    /** Bottom-left corner of the traffic light housing, on the north-east corner. */
    lightPosition: Point;
}

export const DEFAULT_ROAD_WIDTH = 160;
export const CROSSWALK_DEPTH = 28;
export const LIGHT_OFFSET = 12;

/** Computes the geometry of a four-way crossroad centered in a `width` x `height` area. */
export function getCrossroadLayout(
    width: number,
    height: number,
    roadWidth: number = DEFAULT_ROAD_WIDTH,
): CrossroadLayout {
    const road = Math.max(0, Math.min(roadWidth, width, height));
    const center = { x: width / 2, y: height / 2 };
    const left = center.x - road / 2;
    const top = center.y - road / 2;

    const intersection = { x: left, y: top, width: road, height: road };

    return {
        center,
        horizontalRoad: { x: 0, y: top, width, height: road },
        verticalRoad: { x: left, y: 0, width: road, height },
        intersection,
        crosswalks: [
            { x: left, y: top - CROSSWALK_DEPTH, width: road, height: CROSSWALK_DEPTH },
            { x: left + road, y: top, width: CROSSWALK_DEPTH, height: road },
            { x: left, y: top + road, width: road, height: CROSSWALK_DEPTH },
            { x: left - CROSSWALK_DEPTH, y: top, width: CROSSWALK_DEPTH, height: road },
        ],
        lightPosition: {
            x: left + road + LIGHT_OFFSET,
            y: top - LIGHT_OFFSET,
        },
    };
}
