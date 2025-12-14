# Development Guide

This document explains how to run the OpenSpeedTest project locally for development and testing purposes.

## Why do we need a custom server?

While OpenSpeedTest is a client-side application, it relies on specific server behaviors to measure network speed accurately:

1.  **Download Test:** The browser requests binary files from the server.
2.  **Upload Test:** The browser sends `POST` requests with random data to the server.

A standard static file server (like Python's `http.server` or VS Code's Live Server) usually handles downloads fine but **fails on upload tests** because it does not accept `POST` requests (returning 405 or 501 errors).

To fix this, we use a simple Node.js script (`test_server.js`) that acts as a compliant backend.

## Prerequisites

*   **Node.js:** You need Node.js installed to run the test server.
    *   Check if installed: `node -v`
    *   [Download Node.js](https://nodejs.org/)

## How to Run Locally

1.  Open your terminal in the project root.
2.  Run the test server:
    ```bash
    node test_server.js
    ```
3.  Open your browser and navigate to:
    ```
    http://localhost:3000
    ```

## How the Test Server Works (`test_server.js`)

The `test_server.js` script is a minimal HTTP server with zero dependencies.

*   **Static Files:** It serves HTML, JS, CSS, and SVG files from the root directory.
*   **Upload Handling:** It listens for `POST` requests. When it receives one, it accepts the data stream (blackholing it) and returns a `200 OK` response. This allows the client to measure how fast it can push data to the local server.
*   **Download Handling:** It serves files from the `downloading` directory. If a requested download file is missing, it generates a 1MB dummy buffer on the fly to prevent 404 errors during basic testing.

## Project Structure

*   **`index.html`**: The main entry point and configuration.
*   **`assets/js/app-2.5.4.js`**: The core logic for the speed test engine.
*   **`assets/css/`**: Styling for the UI.
*   **`downloading/`**: (Optional) Folder for static binary files for download tests.
*   **`upload/`**: (Virtual) Endpoint for upload tests.
