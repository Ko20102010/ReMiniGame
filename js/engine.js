export class Engine {
  constructor() { this.lastTime = null; this.running = false; }
  start(frame) {
    if (this.running) return;
    this.running = true;
    const loop = (time) => {
      if (!this.running) return;
      if (this.lastTime === null) this.lastTime = time;
      const dt = Math.min(0.033, Math.max(0, (time - this.lastTime) / 1000));
      this.lastTime = time;
      frame(dt || 1 / 60, time / 1000);
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }
  stop() { this.running = false; this.lastTime = null; }
}
