export interface PingResult {
  ping: number;
  jitter: number;
}

export interface PingConfig {
  url: string;
  samples?: number;
  timeout?: number;
}

export class PingTest {
  private config: Required<PingConfig>;
  private _results: number[] = [];

  constructor(config: PingConfig) {
    this.config = {
      samples: 10,
      timeout: 5000,
      ...config,
    };
  }

  async run(): Promise<PingResult> {
    this._results = [];
    
    for (let i = 0; i < this.config.samples; i++) {
      try {
        const duration = await this.ping();
        this._results.push(duration);
      } catch (e) {
        // Ignore failed pings or handle them
      }
    }

    return this.calculateStats();
  }

  private ping(): Promise<number> {
    return new Promise((resolve, reject) => {
      const start = performance.now();
      const xhr = new XMLHttpRequest();
      
      // Add random query param to prevent caching
      xhr.open('GET', this.config.url + '?r=' + Math.random(), true);
      xhr.timeout = this.config.timeout;
      
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            const end = performance.now();
            resolve(end - start);
          } else {
            reject(new Error(`Ping failed: ${xhr.status}`));
          }
        }
      };

      xhr.onerror = () => reject(new Error('Network Error'));
      xhr.ontimeout = () => reject(new Error('Timeout'));
      
      xhr.send();
    });
  }

  private calculateStats(): PingResult {
    if (this._results.length === 0) return { ping: 0, jitter: 0 };

    // OpenSpeedTest typically uses the Minimum Ping as the "Latency"
    const min = Math.min(...this._results);
    
    // Jitter: Average of absolute differences between consecutive measurements
    let jitterSum = 0;
    if (this._results.length > 1) {
        for (let i = 1; i < this._results.length; i++) {
            jitterSum += Math.abs(this._results[i] - this._results[i - 1]);
        }
    }
    
    const jitter = this._results.length > 1 ? jitterSum / (this._results.length - 1) : 0;

    return {
      ping: min,
      jitter: jitter
    };
  }
}
