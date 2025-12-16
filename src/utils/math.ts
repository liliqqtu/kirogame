import { Vector2D } from '@/types';

/**
 * 创建新的2D向量
 */
export function createVector2D(x: number = 0, y: number = 0): Vector2D {
  return { x, y };
}

/**
 * 向量加法
 */
export function addVectors(a: Vector2D, b: Vector2D): Vector2D {
  return {
    x: a.x + b.x,
    y: a.y + b.y,
  };
}

/**
 * 向量减法
 */
export function subtractVectors(a: Vector2D, b: Vector2D): Vector2D {
  return {
    x: a.x - b.x,
    y: a.y - b.y,
  };
}

/**
 * 向量标量乘法
 */
export function multiplyVector(vector: Vector2D, scalar: number): Vector2D {
  return {
    x: vector.x * scalar,
    y: vector.y * scalar,
  };
}

/**
 * 计算向量长度
 */
export function vectorLength(vector: Vector2D): number {
  return Math.sqrt(vector.x * vector.x + vector.y * vector.y);
}

/**
 * 向量归一化
 */
export function normalizeVector(vector: Vector2D): Vector2D {
  const length = vectorLength(vector);
  if (length === 0) {
    return { x: 0, y: 0 };
  }
  return {
    x: vector.x / length,
    y: vector.y / length,
  };
}

/**
 * 计算两点之间的距离
 */
export function distance(a: Vector2D, b: Vector2D): number {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * 限制数值在指定范围内
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * 线性插值
 */
export function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * t;
}

/**
 * 检查数值是否在范围内
 */
export function inRange(value: number, min: number, max: number): boolean {
  return value >= min && value <= max;
}

/**
 * 将角度转换为弧度
 */
export function degreesToRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * 将弧度转换为角度
 */
export function radiansToDegrees(radians: number): number {
  return radians * (180 / Math.PI);
}