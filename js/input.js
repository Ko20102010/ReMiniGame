const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
export class Input {
  constructor(canvas) {
    this.canvas = canvas;
    this.moveX = 0; this.moveY = 0;
    this.activeId = null;
    this.baseX = 0; this.baseY = 0; this.knobX = 0; this.knobY = 0;
    this.radius = 58;
    this.actionQueued = false;
    canvas.addEventListener('contextmenu', e => e.preventDefault());
    canvas.addEventListener('pointerdown', e => this.onDown(e));
    canvas.addEventListener('pointermove', e => this.onMove(e));
    canvas.addEventListener('pointerup', e => this.onUp(e));
    canvas.addEventListener('pointercancel', e => this.onUp(e));
    window.addEventListener('blur', () => this.reset());
  }
  onDown(e) {
    e.preventDefault();
    this.canvas.setPointerCapture?.(e.pointerId);
    if (e.clientX <= innerWidth * 0.55 && this.activeId === null) {
      this.activeId = e.pointerId;
      this.baseX = this.knobX = e.clientX;
      this.baseY = this.knobY = e.clientY;
      this.updateStick(e.clientX, e.clientY);
    } else {
      this.actionQueued = true;
    }
  }
  onMove(e) {
    if (e.pointerId !== this.activeId) return;
    e.preventDefault();
    this.updateStick(e.clientX, e.clientY);
  }
  onUp(e) {
    if (e.pointerId === this.activeId) this.resetStick();
  }
  updateStick(x, y) {
    let dx = x - this.baseX, dy = y - this.baseY;
    const length = Math.hypot(dx, dy);
    if (length > this.radius) { dx *= this.radius / length; dy *= this.radius / length; }
    this.knobX = this.baseX + dx; this.knobY = this.baseY + dy;
    this.moveX = clamp(dx / this.radius, -1, 1);
    this.moveY = clamp(dy / this.radius, -1, 1);
  }
  consumeAction() { const value = this.actionQueued; this.actionQueued = false; return value; }
  resetStick() { this.activeId = null; this.moveX = 0; this.moveY = 0; }
  reset() { this.resetStick(); this.actionQueued = false; }
  get stickActive() { return this.activeId !== null; }
}
