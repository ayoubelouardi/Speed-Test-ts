import { ThroughputConfig } from './DownloadTest';

export class UploadTest {
  private config: Required<ThroughputConfig>;
  private activeXHRs: XMLHttpRequest[] = [];
  private totalLoaded = 0;
  private startTime = 0;
  private running = false;
  private dataBlob: Blob;

  constructor(config: ThroughputConfig) {
    this.config = {
      threads: 6,
      duration: 10,
      onProgress: () => {},
      ...config,
    };
    // Create 1MB of random data
    const data = new Uint8Array(1024 * 1024); 
    for(let i=0; i<data.length; i++) data[i] = Math.random() * 255;
    this.dataBlob = new Blob([data]);
  }

  async run(): Promise<number> {
    this.running = true;
    this.startTime = performance.now();
    this.totalLoaded = 0;
    this.activeXHRs = [];

    for (let i = 0; i < this.config.threads; i++) {
      this.startThread();
    }

    await new Promise<void>(resolve => {
      const interval = setInterval(() => {
        const now = performance.now();
        const elapsed = (now - this.startTime) / 1000;
        
        const speed = this.calculateSpeed(elapsed);
        this.config.onProgress(speed, Math.min(elapsed / this.config.duration, 1));

        if (elapsed >= this.config.duration || !this.running) {
          clearInterval(interval);
          this.stop();
          resolve();
        }
      }, 200);
    });

    return this.calculateSpeed((performance.now() - this.startTime) / 1000);
  }

  private startThread() {
    if (!this.running) return;

    const xhr = new XMLHttpRequest();
    this.activeXHRs.push(xhr);
    
    let loadedInThisRequest = 0;

    xhr.open('POST', this.config.url + '?r=' + Math.random(), true);
    
    xhr.upload.onprogress = (e) => {
      if (!this.running) return;
      const diff = e.loaded - loadedInThisRequest;
      this.totalLoaded += diff;
      loadedInThisRequest = e.loaded;
    };

    xhr.onload = () => {
      const index = this.activeXHRs.indexOf(xhr);
      if (index > -1) this.activeXHRs.splice(index, 1);
      if (this.running) this.startThread();
    };

    xhr.onerror = () => {
       if (this.running) this.startThread();
    };

    xhr.send(this.dataBlob);
  }

  private stop() {
    this.running = false;
    this.activeXHRs.forEach(xhr => xhr.abort());
    this.activeXHRs = [];
  }

  private calculateSpeed(elapsedSeconds: number): number {
    if (elapsedSeconds <= 0) return 0;
    const bits = this.totalLoaded * 8;
    const mbps = bits / 1000000 / elapsedSeconds;
    return mbps;
  }
}
