import { Point } from '@/Common/types/point';

export const getClosestPointOnLine = (pointXZ: Point, linePoints: [Point, Point]) => {
    // Destructure the input points
    const { x: x0, y: y0 } = pointXZ;
    const { x: x1, y: y1 } = linePoints[0];
    const { x: x2, y: y2 } = linePoints[1];

    // Line vector
    const dx = x2 - x1;
    const dy = y2 - y1;

    // Vector from point 1 of the line to the external point
    const px = x0 - x1;
    const py = y0 - y1;

    // Project the point onto the line
    const dotProduct = px * dx + py * dy;
    const lineLengthSquared = dx * dx + dy * dy;

    // Find the closest point on the line
    const t = Math.max(0, Math.min(1, dotProduct / lineLengthSquared)); // Ensure t is between 0 and 1
    const closestX = x1 + t * dx;
    const closestY = y1 + t * dy;

    return { x: closestX, y: closestY };
};
