export class Player {
  constructor() { this.x = 260; this.y = 390; this.radius = 22; this.speed = 235; this.food = 0; this.mana = 0; this.meat = 0; this.facing = 1; this.sway = 0; }
  update(dt, input, bounds) {
    const length = Math.hypot(input.moveX, input.moveY);
    const nx = length > 1 ? input.moveX / length : input.moveX;
    const ny = length > 1 ? input.moveY / length : input.moveY;
    this.x += nx * this.speed * dt; this.y += ny * this.speed * dt;
    if (Math.abs(nx) > 0.05) this.facing = Math.sign(nx);
    this.sway += length * dt * 10; this.isMoving = length > 0.12;
    this.x = Math.max(this.radius, Math.min(bounds.width - this.radius, this.x));
    this.y = Math.max(bounds.top + this.radius, Math.min(bounds.height - this.radius, this.y));
  }
}
