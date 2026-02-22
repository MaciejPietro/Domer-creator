// Distance constants
export const METER = 100;
export const CENTIMETER = METER / 100;
export const MILLIMETER = CENTIMETER / 10;

// Basic circle constants
export const PI = Math.PI;
export const HALF_PI = Math.PI / 2;
export const QUARTER_PI = Math.PI / 4;
export const TWO_PI = Math.PI * 2;
export const THREE_PI = Math.PI * 3;

// Angle conversion
export const DEG_TO_RAD = PI / 180;
export const RAD_TO_DEG = 180 / PI;

// Common angles
export const DEG_0 = 0;
export const DEG_30 = 30 * DEG_TO_RAD;
export const DEG_45 = 45 * DEG_TO_RAD;
export const DEG_60 = 60 * DEG_TO_RAD;
export const DEG_90 = 90 * DEG_TO_RAD;
export const DEG_120 = 120 * DEG_TO_RAD;
export const DEG_180 = 180 * DEG_TO_RAD;
export const DEG_270 = 270 * DEG_TO_RAD;
export const DEG_360 = 360 * DEG_TO_RAD;

// Golden ratio (surprisingly useful in geometry tools)
export const GOLDEN_RATIO = (1 + Math.sqrt(5)) / 2;

// Safe numeric limits for geometry engines
export const MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER;
export const MIN_SAFE_INTEGER = Number.MIN_SAFE_INTEGER;
export const MAX_FLOAT = Number.MAX_VALUE;
export const MIN_FLOAT = Number.MIN_VALUE;
