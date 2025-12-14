import { PingTest, PingResult } from './PingTest';
import { DownloadTest } from './DownloadTest';
import { UploadTest } from './UploadTest';

export interface TestResult {
  ping: number;
  jitter: number;
  download: number;
  upload: number;
}

export interface EngineConfig {
  pingUrl: string;
  downloadUrl: string;
  uploadUrl: string;
  onPingProgress?: (result: PingResult) => void;
  onDownloadProgress?: (speed: number, progress: number) => void;
  onUploadProgress?: (speed: number, progress: number) => void;
}

export class SpeedTestEngine {
  constructor(private config: EngineConfig) {}

  async run(): Promise<TestResult> {
    // 1. Ping Test
    const pingTest = new PingTest({ url: this.config.pingUrl });
    const pingResult = await pingTest.run();
    if (this.config.onPingProgress) this.config.onPingProgress(pingResult);

    // 2. Download Test
    const downloadTest = new DownloadTest({
      url: this.config.downloadUrl,
      onProgress: this.config.onDownloadProgress,
    });
    const downloadSpeed = await downloadTest.run();

    // 3. Upload Test
    const uploadTest = new UploadTest({
      url: this.config.uploadUrl,
      onProgress: this.config.onUploadProgress,
    });
    const uploadSpeed = await uploadTest.run();

    return {
      ping: pingResult.ping,
      jitter: pingResult.jitter,
      download: downloadSpeed,
      upload: uploadSpeed,
    };
  }
}
