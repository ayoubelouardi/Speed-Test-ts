# Architecture

The project is split into three layers:

1.  **Core Engine (`src/core/`)**:
    *   Pure TypeScript classes.
    *   Handles `XMLHttpRequest` logic.
    *   Calculates speed, jitter, and ping.
    *   No UI dependencies.

2.  **React Hooks (`src/hooks/`)**:
    *   `useSpeedTest`: A wrapper around the Core Engine.
    *   Manages state (loading, progress, results) for React components.

3.  **UI Components (`src/components/`)**:
    *   Visual representation (Gauges, Progress Bars).
    *   (Currently implemented as a simple demo in `App.tsx`).

## The Speed Test Flow

1.  **Ping Test**: Sends small requests to measure latency.
2.  **Download Test**: Downloads binary data using multiple parallel XHR threads.
3.  **Upload Test**: Uploads random binary data using multiple parallel XHR threads.
