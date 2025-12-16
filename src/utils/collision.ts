import { Vector2D, GameEntity, CollisionResult } from '@/types';

/**
 * 检查两个矩形是否碰撞 (AABB碰撞检测)
 */
export function checkAABBCollision(
  pos1: Vector2D,
  size1: Vector2D,
  pos2: Vector2D,
  size2: Vector2D
): boolean {
  return (
    pos1.x < pos2.x + size2.x &&
    pos1.x + size1.x > pos2.x &&
    pos1.y < pos2.y + size2.y &&
    pos1.y + size1.y > pos2.y
  );
}

/**
 * 检查两个游戏实体是否碰撞
 */
export function checkEntityCollision(entity1: GameEntity, entity2: GameEntity): CollisionResult {
  const hasCollision = checkAABBCollision(
    entity1.position,
    entity1.size,
    entity2.position,
    entity2.size
  );

  return {
    hasCollision,
    entity1,
    entity2,
  };
}

/**
 * 检查点是否在矩形内
 */
export function pointInRect(point: Vector2D, rectPos: Vector2D, rectSize: Vector2D): boolean {
  return (
    point.x >= rectPos.x &&
    point.x <= rectPos.x + rectSize.x &&
    point.y >= rectPos.y &&
    point.y <= rectPos.y + rectSize.y
  );
}

/**
 * 检查实体是否在边界内
 */
export function isEntityInBounds(
  entity: GameEntity,
  boundsWidth: number,
  boundsHeight: number
): boolean {
  return (
    entity.position.x >= 0 &&
    entity.position.y >= 0 &&
    entity.position.x + entity.size.x <= boundsWidth &&
    entity.position.y + entity.size.y <= boundsHeight
  );
}

/**
 * 将实体位置限制在边界内
 */
export function clampEntityToBounds(
  entity: GameEntity,
  boundsWidth: number,
  boundsHeight: number
): void {
  entity.position.x = Math.max(0, Math.min(entity.position.x, boundsWidth - entity.size.x));
  entity.position.y = Math.max(0, Math.min(entity.position.y, boundsHeight - entity.size.y));
}