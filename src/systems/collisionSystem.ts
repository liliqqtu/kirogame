// 碰撞检测系统相关导入
import { checkEntityCollision } from '@/utils/collision';
import { PlayerShipImpl } from '@/entities/playerShip';
import { EnemyShipImpl } from '@/entities/enemyShip';
import { BulletImpl } from '@/entities/bullet';

/**
 * 碰撞检测系统
 */
export class CollisionSystem {
  /**
   * 检测玩家与敌人的碰撞
   */
  checkPlayerEnemyCollisions(
    player: PlayerShipImpl,
    enemies: EnemyShipImpl[]
  ): EnemyShipImpl[] {
    const collisions: EnemyShipImpl[] = [];

    if (!player.active) return collisions;

    for (const enemy of enemies) {
      if (!enemy.active) continue;

      const collision = checkEntityCollision(player, enemy);
      if (collision.hasCollision) {
        collisions.push(enemy);
      }
    }

    return collisions;
  }

  /**
   * 检测玩家子弹与敌人的碰撞
   */
  checkPlayerBulletEnemyCollisions(
    bullets: BulletImpl[],
    enemies: EnemyShipImpl[]
  ): Array<{ bullet: BulletImpl; enemy: EnemyShipImpl }> {
    const collisions: Array<{ bullet: BulletImpl; enemy: EnemyShipImpl }> = [];

    const playerBullets = bullets.filter(b => b.active && b.owner === 'player');

    for (const bullet of playerBullets) {
      for (const enemy of enemies) {
        if (!enemy.active) continue;

        const collision = checkEntityCollision(bullet, enemy);
        if (collision.hasCollision) {
          collisions.push({ bullet, enemy });
        }
      }
    }

    return collisions;
  }

  /**
   * 检测敌人子弹与玩家的碰撞
   */
  checkEnemyBulletPlayerCollisions(
    bullets: BulletImpl[],
    player: PlayerShipImpl
  ): BulletImpl[] {
    const collisions: BulletImpl[] = [];

    if (!player.active) return collisions;

    const enemyBullets = bullets.filter(b => b.active && b.owner === 'enemy');

    for (const bullet of enemyBullets) {
      const collision = checkEntityCollision(bullet, player);
      if (collision.hasCollision) {
        collisions.push(bullet);
      }
    }

    return collisions;
  }

  /**
   * 处理所有碰撞检测
   */
  checkAllCollisions(
    player: PlayerShipImpl,
    enemies: EnemyShipImpl[],
    bullets: BulletImpl[]
  ): {
    playerEnemyCollisions: EnemyShipImpl[];
    bulletEnemyCollisions: Array<{ bullet: BulletImpl; enemy: EnemyShipImpl }>;
    bulletPlayerCollisions: BulletImpl[];
  } {
    return {
      playerEnemyCollisions: this.checkPlayerEnemyCollisions(player, enemies),
      bulletEnemyCollisions: this.checkPlayerBulletEnemyCollisions(bullets, enemies),
      bulletPlayerCollisions: this.checkEnemyBulletPlayerCollisions(bullets, player),
    };
  }
}