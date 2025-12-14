# OpenSpeedTest-TS (Modernized)

A professional, open-source HTML5 Network Performance Estimation Tool, now modernized with **TypeScript** and **React**.

## Key Features
*   **Core Engine:** Fully decoupled TypeScript logic.
*   **React Components:** Ready-to-use Gauge UI and Hooks.
*   **JSON Results:** Get raw test data programmatically for your own apps.
*   **Legacy Compatible:** Still uses `XMLHttpRequest` for maximum browser compatibility (IE10+ support depends on React version).

## Quick Start (Development)

1.  Clone the repo.
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Run tests:
    ```bash
    npm test
    ```
4.  Start dev server:
    ```bash
    npm run dev
    ```

## Documentation
See the [docs/](docs/) folder for detailed architecture and usage guides.

## Project Structure
*   `src/core`: Pure TypeScript logic for the speed test engine.
*   `src/components`: React components (Gauge, etc.).
*   `src/hooks`: React hooks (`useSpeedTest`).
*   `test_server.js`: Local server for testing upload/download.
