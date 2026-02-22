import { main } from '../2d/EditorRoot';

import { useStore } from '../stores/EditorStore';

function getSnapFactor(): number {
    const zoom = useStore.getState().zoom;

    // Zoom ranges and corresponding snap factors
    // scale 8 to 2: 10 (10cm)
    // scale 2 to 1: 20 (20cm)
    // scale 1 to 0.5: 50 (50cm)
    // scale 0.5 to 0.3: 100 (1 meter)
    if (zoom >= 2) {
        return 10;
    } else if (zoom >= 1) {
        return 20;
    } else if (zoom >= 0.5) {
        return 50;
    } else {
        return 100;
    }
}

export function viewportX(x: number, customSnap?: any) {
    let newX = x / main.scale.x + main.corner.x;
    const shouldSnap = customSnap ?? useStore.getState().snap;

    if (shouldSnap) {
        newX = snap(newX);
    }

    return Math.trunc(newX);
}

export function viewportY(y: number, customSnap?: any) {
    let newY = y / main.scale.y + main.corner.y;
    const shouldSnap = customSnap ?? useStore.getState().snap;

    if (shouldSnap) {
        newY = snap(newY);
    }

    return Math.trunc(newY);
}

export function snap(val: number) {
    const factor = getSnapFactor();
    const rest = val % factor;
    const cat = val - rest;

    if (rest < factor / 2) {
        return cat;
    }

    return cat + factor;
}
