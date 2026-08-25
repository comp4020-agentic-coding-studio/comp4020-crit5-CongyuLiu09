import { rectsOverlap } from "./collision";
import type { Rect } from "./collision";

interface Obstacle extends Rect {
  passed: boolean;
}

const GROUND_Y_RATIO = 0.72;
const RUNNER_SIZE = 30;
const RUNNER_X_RATIO = 0.16;
const GRAVITY = 2600;
const JUMP_VELOCITY = 900;
const BASE_SPEED = 260;
const SPEED_RAMP = 6;
const MAX_SPEED = 640;
const SPAWN_INTERVAL_BASE = 1.35;
const SPAWN_INTERVAL_MIN = 0.7;
const MAX_FRAME_DT = 0.05;

// Starts the runner game on `canvas`, announcing round-end text through
// `status`. Returns a cleanup function that stops the loop and its listeners.
export function startGame(canvas: HTMLCanvasElement, status: HTMLElement): () => void {
  const context2d = canvas.getContext("2d");
  if (!context2d) throw new Error("2d canvas context unavailable");
  const ctx: CanvasRenderingContext2D = context2d;

  let width = 0;
  let height = 0;
  let groundY = 0;

  function resize(): void {
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    width = rect.width;
    height = rect.height;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    groundY = height * GROUND_Y_RATIO;
  }

  let runnerLift = 0; // height above the ground
  let velocityY = 0;
  let onGround = true;
  let obstacles: Obstacle[] = [];
  let elapsed = 0;
  let sinceSpawn = 0;
  let score = 0;
  let running = true;
  let lastTime: number | null = null;
  let rafId = 0;

  function reset(): void {
    runnerLift = 0;
    velocityY = 0;
    onGround = true;
    obstacles = [];
    elapsed = 0;
    sinceSpawn = 0;
    score = 0;
    running = true;
    status.textContent = "";
  }

  function jump(): void {
    if (!running) {
      reset();
      return;
    }
    if (onGround) {
      velocityY = JUMP_VELOCITY;
      onGround = false;
    }
  }

  function speedAt(t: number): number {
    return Math.min(MAX_SPEED, BASE_SPEED + t * SPEED_RAMP);
  }

  function spawnIntervalAt(t: number): number {
    return Math.max(SPAWN_INTERVAL_MIN, SPAWN_INTERVAL_BASE - t * 0.01);
  }

  function runnerRect(): Rect {
    return {
      x: width * RUNNER_X_RATIO,
      y: groundY - RUNNER_SIZE - runnerLift,
      width: RUNNER_SIZE,
      height: RUNNER_SIZE,
    };
  }

  function step(dt: number): void {
    if (!running) return;
    elapsed += dt;
    const speed = speedAt(elapsed);

    velocityY -= GRAVITY * dt;
    runnerLift += velocityY * dt;
    if (runnerLift <= 0) {
      runnerLift = 0;
      velocityY = 0;
      onGround = true;
    }

    sinceSpawn += dt;
    if (sinceSpawn >= spawnIntervalAt(elapsed)) {
      sinceSpawn = 0;
      const obstacleHeight = 22 + Math.random() * 30;
      obstacles.push({
        x: width + 20,
        y: groundY - obstacleHeight,
        width: 16 + Math.random() * 12,
        height: obstacleHeight,
        passed: false,
      });
    }

    const runner = runnerRect();
    for (const obstacle of obstacles) {
      obstacle.x -= speed * dt;
      if (!obstacle.passed && obstacle.x + obstacle.width < runner.x) {
        obstacle.passed = true;
        score += 1;
      }
      if (rectsOverlap(runner, obstacle)) {
        running = false;
        status.textContent = `Game over — score ${score}. Press space, click, or tap to try again.`;
      }
    }
    obstacles = obstacles.filter((obstacle) => obstacle.x + obstacle.width > -20);
  }

  function draw(): void {
    ctx.clearRect(0, 0, width, height);

    ctx.strokeStyle = "rgba(245, 245, 247, 0.35)";
    ctx.beginPath();
    ctx.moveTo(0, groundY);
    ctx.lineTo(width, groundY);
    ctx.stroke();

    const runner = runnerRect();
    ctx.fillStyle = "#f5f5f7";
    ctx.fillRect(runner.x, runner.y, runner.width, runner.height);

    ctx.fillStyle = "#ff6b6b";
    for (const obstacle of obstacles) {
      ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    }

    ctx.fillStyle = "rgba(245, 245, 247, 0.7)";
    ctx.font = "16px system-ui, sans-serif";
    ctx.textAlign = "right";
    ctx.fillText(`${score}`, width - 24, 32);
  }

  function frame(time: number): void {
    if (lastTime === null) lastTime = time;
    const dt = Math.min(MAX_FRAME_DT, (time - lastTime) / 1000);
    lastTime = time;
    step(dt);
    draw();
    rafId = requestAnimationFrame(frame);
  }

  function onKeydown(event: KeyboardEvent): void {
    if (event.code === "Space" || event.code === "ArrowUp") {
      event.preventDefault();
      jump();
    }
  }

  resize();
  window.addEventListener("resize", resize);
  window.addEventListener("keydown", onKeydown);
  canvas.addEventListener("pointerdown", jump);

  rafId = requestAnimationFrame(frame);

  return () => {
    cancelAnimationFrame(rafId);
    window.removeEventListener("resize", resize);
    window.removeEventListener("keydown", onKeydown);
    canvas.removeEventListener("pointerdown", jump);
  };
}
