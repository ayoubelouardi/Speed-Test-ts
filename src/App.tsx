import React from 'react';
import { useSpeedTest } from './hooks/useSpeedTest';

function App() {
  const { runTest, result, status, progress, currentSpeed } = useSpeedTest();

  return (
    <div style={{ fontFamily: 'sans-serif', padding: '20px' }}>
      <h1>OpenSpeedTest-TS</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <button onClick={runTest} disabled={status !== 'idle' && status !== 'complete'}>
          {status === 'idle' || status === 'complete' ? 'Start Test' : 'Running...'}
        </button>
      </div>

      <div>
        <h2>Status: {status}</h2>
        {status === 'download' || status === 'upload' ? (
          <div>
            <p>Speed: {currentSpeed.toFixed(2)} Mbps</p>
            <progress value={progress} max={1} />
          </div>
        ) : null}
      </div>

      {result && (
        <div style={{ marginTop: '20px', border: '1px solid #ccc', padding: '10px' }}>
          <h3>Results (JSON)</h3>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default App;
