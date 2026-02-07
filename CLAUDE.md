# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Development Commands

```bash
npm run dev      # Start development server (Vite, port 3000)
npm run build    # TypeScript check + Vite production build
npm run serve    # Preview production build
```

## Architecture Overview

Domer-creator is a home floor plan editor with dual 2D (Pixi.js) and 3D (React Three Fiber) views. It runs as a subapp of Domer-client.

### Core Structure

**Entry Flow:** `main.tsx` → `App.tsx` (Mantine providers) → `PageLayout.tsx` → conditionally renders `EditorRoot` (2D) or `SceneRoot` (3D) based on `ViewMode`

### 2D Editor (`src/2d/`)

The 2D editor uses Pixi.js with pixi-viewport for pan/zoom.

- **`EditorRoot.tsx`**: React wrapper that initializes Pixi Application and creates the `Main` viewport
- **`editor/Main.ts`**: Main viewport class extending `Viewport`. Manages grid, floor plan, transform layer, and tool interactions
- **`editor/objects/FloorPlan.ts`**: Singleton managing floors, walls, furniture. Handles serialization/deserialization
- **`editor/objects/Floor.ts`**: Individual floor containing `WallNodeSequence`
- **`editor/objects/Walls/`**:
  - `WallNode.ts`: Draggable corner points connecting walls
  - `Wall.ts`: Wall segment between two nodes, handles corner calculations for adjacent walls
  - `WallNodeSequence.ts`: Container managing all nodes and walls on a floor
- **`editor/objects/Furnitures/`**: `Door` and `WindowElement` classes (building elements attached to walls)
- **`editor/actions/`**: Command pattern for editor operations (AddNode, AddWall, Delete*, Load, Save, etc.)

### 3D View (`src/3d/`)

Uses React Three Fiber with CSG (Constructive Solid Geometry) for wall cutouts.

- **`SceneRoot.tsx`**: Canvas setup, converts 2D plan to 3D via `FloorPlan.Instance.getPlanForModel()`
- **`House.tsx`**: Renders walls as 3D meshes with door/window subtractions using `@react-three/csg`
- **`elements/`**: 3D components for Door and Window rendered as CSG subtractions

### State Management

**`stores/EditorStore.tsx`**: Zustand store managing:
- `activeMode`: ViewMode (Edit, View2d, View3d)
- `activeTool`: Current tool (Edit, WallAdd, FurnitureAddDoor, FurnitureAddWindow, Measure, Remove)
- `focusedElement`: Currently selected Wall/WallNode/Door/Window
- `snap`: Grid snapping toggle (Ctrl key)

### Key Constants (`src/2d/editor/constants.ts`)

- `METER = 100` (100 pixels = 1 meter)
- Wall thickness constants for exterior (40px) and interior (16px) walls

### Path Aliases

`@/*` maps to `./src/*` (configured in tsconfig.json and vite.config.ts)

### UI Framework

Mantine v7 with Emotion for styling, TailwindCSS for utility classes.