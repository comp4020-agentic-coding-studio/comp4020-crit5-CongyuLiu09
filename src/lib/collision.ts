export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

// Axis-aligned bounding box overlap: the one rule the round hinges on.
export function rectsOverlap(a: Rect, b: Rect): boolean {
  return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
}
