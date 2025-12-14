import { useState, useCallback } from 'react';
import { SpeedTestEngine, TestResult } from '../core/SpeedTestEngine';

export const useSpeedTest = () => {
  const [result, setResult] = useState<TestResult | null>(null);
  const [status, setStatus] = useState<'idle' | 'ping' | 'download' | 'upload' | 'complete'>('idle');
  const [progress, setProgress] = useState(0);
  const [currentSpeed, setCurrentSpeed] = useState(0);

  const runTest = useCallback(async () => {
    setStatus('ping');
    const engine = new SpeedTestEngine({
      pingUrl: '/upload', // Usually ping hits upload endpoint
      downloadUrl: '/downloading',
      uploadUrl: '/upload',
      onPingProgress: (res) => {
        // Ping done
      },
      onDownloadProgress: (speed, prog) => {
        setStatus('download');
        setCurrentSpeed(speed);
        setProgress(prog);
      },
      onUploadProgress: (speed, prog) => {
        setStatus('upload');
        setCurrentSpeed(speed);
        setProgress(prog);
      },
    });

    const finalResult = await engine.run();
    setResult(finalResult);
    setStatus('complete');
    return finalResult;
  }, []);

  return { runTest, result, status, progress, currentSpeed };
};
