import { WallType } from './types';

export const WALL_FILL_COLOR = '#919191';

export const WALL_HOVER_FILL_COLOR = '#8c8b8b';

export const WALL_STROKE_COLOR = '#919191';

export const WALL_ACTIVE_STROKE_COLOR = '#1C7ED6';

export const MIN_WALL_LENGTH = 20;

export const MIN_WALL_ANGLE = 30;

export const WALL_ACTIVE_Z_INDEX = 21;
export const WALL_INACTIVE_Z_INDEX = 20;
export const WALL_DASHED_LINE_Z_INDEX = 22;
export const WALL_TEMP_FURNITURE_Z_INDEX = 25;

export const WALL_THICKNESS = 40;
export const DEFAULT_WALL_TYPE: WallType = 'exterior';

// Corner calculation constants
export const INTERSECTION_LINE_EXTENSION = 100;
export const CORNER_ANGLE_THRESHOLD = 25;
