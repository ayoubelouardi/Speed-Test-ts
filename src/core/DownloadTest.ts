export interface ThroughputConfig {
  url: string;
  threads?: number;
  duration?: number; // seconds
  onProgress?: (speed: number, progress: number) => void; // speed in Mbps
}

export class DownloadTest {
  private config: Required<ThroughputConfig>;
  private activeXHRs: XMLHttpRequest[] = [];
  private totalLoaded = 0;
  private startTime = 0;
  private running = false;

  constructor(config: ThroughputConfig) {
    this.config = {
      threads: 6,
      duration: 10,
      onProgress: () => {},
      ...config,
    };
  }

  async run(): Promise<number> {
    this.running = true;
    this.startTime = performance.now();
    this.totalLoaded = 0;
    this.activeXHRs = [];

    const threadPromises = [];
    for (let i = 0; i < this.config.threads; i++) {
      threadPromises.push(this.startThread());
    }

    // Run for the specified duration
    await new Promise<void>(resolve => {
      const interval = setInterval(() => {
        const now = performance.now();
        const elapsed = (now - this.startTime) / 1000;
        
        // Calculate current speed
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

  private startThread(): Promise<void> {
    return new Promise((resolve) => {
      if (!this.running) return resolve();

      const xhr = new XMLHttpRequest();
      this.activeXHRs.push(xhr);
      
      let loadedInThisRequest = 0;

      xhr.open('GET', this.config.url + '?r=' + Math.random(), true);
      xhr.responseType = 'arraybuffer';
      
      xhr.onprogress = (e) => {
        if (!this.running) return;
        const diff = e.loaded - loadedInThisRequest;
        this.totalLoaded += diff;
        loadedInThisRequest = e.loaded;
      };

      xhr.onload = () => {
        // If finished, restart thread if still running
        const index = this.activeXHRs.indexOf(xhr);
        if (index > -1) this.activeXHRs.splice(index, 1);
        
        if (this.running) {
          this.startThread().then(resolve);
        } else {
          resolve();
        }
      };

      xhr.onerror = () => {
         // Retry on error?
         if (this.running) this.startThread().then(resolve);
         else resolve();
      };

      xhr.send();
    });
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
