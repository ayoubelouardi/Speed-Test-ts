# Usage Guide

## Running the Dev Server

```bash
npm install
npm run dev
```

## Using the Hook

```typescript
import { useSpeedTest } from './hooks/useSpeedTest';

const MyComponent = () => {
  const { runTest, result, status, currentSpeed } = useSpeedTest();

  return (
    <div>
      <button onClick={runTest}>Start</button>
      {status === 'download' && <p>Downloading: {currentSpeed} Mbps</p>}
      {result && <pre>{JSON.stringify(result)}</pre>}
    </div>
  );
};
```

## Configuration

The `SpeedTestEngine` accepts a config object:

```typescript
const engine = new SpeedTestEngine({
  pingUrl: '/upload',
  downloadUrl: '/downloading',
  uploadUrl: '/upload',
});
```
