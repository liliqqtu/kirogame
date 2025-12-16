import { Bullet, Renderer, Vector2D, BulletType } from '@/types';
import { createVector2D } from '@/utils/math';
import { PIXEL_PALETTE } from '@/systems/colorSystem';
import { DEFAULT_GAME_CONFIG, BULLET_TYPES } from '@/utils/constants';
import { getAsset } from '@/systems/defaultAssets';

/**
 * 子弹实现
 */
export class BulletImpl implements Bullet {
  position: Vector2D;
  velocity: Vector2D;
  size: Vector2D;
  active: boolean;
  owner: 'player' | 'enemy';
  damage: number;
  bulletType: BulletType;

  private canvasWidth: number;
  private canvasHeight: number;

  constructor(
    position: Vector2D,
    velocity: Vector2D,
    owner: 'player' | 'enemy',
    canvasWidth: number,
    canvasHeight: number,
    damage: number = 1,
    bulletType: BulletType = BulletType.NORMAL
  ) {
    this.position = { ...position };
    this.velocity = { ...velocity };
    this.owner = owner;
    this.damage = damage;
    this.bulletType = bulletType;
    this.active = true;
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    
    // 根据子弹类型设置尺寸
    if (bulletType === BulletType.LASER) {
      this.size = { ...BULLET_TYPES.LASER.size };
    } else {
      this.size = { ...BULLET_TYPES.NORMAL.size };
    }
  }

  /**
   * 更新子弹状态
   */
  update(deltaTime: number): void {
    if (!this.active) return;

    // 更新位置
    this.position.x += this.velocity.x * (deltaTime / 1000);
    this.position.y += this.velocity.y * (deltaTime / 1000);

    // 检查是否超出边界
    this.checkBounds();
  }

  /**
   * 渲染子弹
   */
  render(renderer: Renderer): void {
    if (!this.active) return;

    let bulletImageName: string;
    if (this.owner === 'player') {
      bulletImageName = 'playerBullet';
    } else {
      bulletImageName = this.bulletType === BulletType.LASER ? 'enemyLaser' : 'enemyBullet';
    }
    
    const bulletImage = getAsset(bulletImageName);
    
    if (bulletImage) {
      // 使用图片渲染
      renderer.drawImage(
        bulletImage,
        this.position.x,
        this.position.y,
        this.size.x,
        this.size.y
      );
    } else {
      // 降级到矩形渲染
      if (this.bulletType === BulletType.LASER) {
        // 激光束渲染
        renderer.drawRect(
          this.position.x,
          this.position.y,
          this.size.x,
          this.size.y,
          PIXEL_PALETTE.BULLET_ENEMY
        );
        
        // 激光束核心
        renderer.drawRect(
          this.position.x + 1,
          this.position.y,
          this.size.x - 2,
          this.size.y,
          '#FFAA44'
        );
      } else {
        // 普通子弹渲染
        const color = this.owner === 'player' 
          ? PIXEL_PALETTE.BULLET_PLAYER 
          : PIXEL_PALETTE.BULLET_ENEMY;

        // 绘制子弹主体
        renderer.drawRect(
          this.position.x,
          this.position.y,
          this.size.x,
          this.size.y,
          color
        );

        // 添加子弹尾迹效果
        if (this.owner === 'player') {
          // 玩家子弹向上，在底部添加尾迹
          renderer.drawRect(
            this.position.x + 1,
            this.position.y + this.size.y,
            this.size.x - 2,
            2,
            PIXEL_PALETTE.PLAYER_SECONDARY
          );
        } else {
          // 敌人子弹向下，在顶部添加尾迹
          renderer.drawRect(
            this.position.x + 1,
            this.position.y - 2,
            this.size.x - 2,
            2,
            PIXEL_PALETTE.ENEMY_SECONDARY
          );
        }
      }
    }
  }

  /**
   * 检查边界并在超出时销毁子弹
   */
  private checkBounds(): void {
    if (
      this.position.x + this.size.x < 0 ||
      this.position.x > this.canvasWidth ||
      this.position.y + this.size.y < 0 ||
      this.position.y > this.canvasHeight
    ) {
      this.destroy();
    }
  }

  /**
   * 获取中心位置
   */
  getCenterPosition(): Vector2D {
    return {
      x: this.position.x + this.size.x / 2,
      y: this.position.y + this.size.y / 2,
    };
  }

  /**
   * 检查是否在屏幕内
   */
  isInBounds(): boolean {
    return (
      this.position.x + this.size.x >= 0 &&
      this.position.x <= this.canvasWidth &&
      this.position.y + this.size.y >= 0 &&
      this.position.y <= this.canvasHeight
    );
  }

  /**
   * 销毁子弹
   */
  destroy(): void {
    this.active = false;
  }

  /**
   * 设置速度
   */
  setVelocity(vx: number, vy: number): void {
    this.velocity.x = vx;
    this.velocity.y = vy;
  }

  /**
   * 获取边界框
   */
  getBounds(): { x: number; y: number; width: number; height: number } {
    return {
      x: this.position.x,
      y: this.position.y,
      width: this.size.x,
      height: this.size.y,
    };
  }
}

/**
 * 子弹工厂类
 */
export class BulletFactory {
  private canvasWidth: number;
  private canvasHeight: number;

  constructor(canvasWidth: number, canvasHeight: number) {
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
  }

  /**
   * 创建玩家子弹
   */
  createPlayerBullet(position: Vector2D): BulletImpl {
    const velocity = createVector2D(0, -DEFAULT_GAME_CONFIG.bullet.speed);
    return new BulletImpl(
      position,
      velocity,
      'player',
      this.canvasWidth,
      this.canvasHeight,
      1
    );
  }

  /**
   * 创建玩家导弹（支持自定义速度）
   */
  createPlayerMissile(position: Vector2D, velocity: Vector2D): BulletImpl {
    return new BulletImpl(
      position,
      velocity,
      'player',
      this.canvasWidth,
      this.canvasHeight,
      1
    );
  }

  /**
   * 创建敌人子弹
   */
  createEnemyBullet(position: Vector2D, velocity: Vector2D, bulletType: BulletType = BulletType.NORMAL): BulletImpl {
    return new BulletImpl(
      position,
      velocity,
      'enemy',
      this.canvasWidth,
      this.canvasHeight,
      1,
      bulletType
    );
  }

  /**
   * 创建自定义子弹
   */
  createCustomBullet(
    position: Vector2D,
    velocity: Vector2D,
    owner: 'player' | 'enemy',
    damage: number = 1
  ): BulletImpl {
    return new BulletImpl(
      position,
      velocity,
      owner,
      this.canvasWidth,
      this.canvasHeight,
      damage
    );
  }
}

/**
 * 子弹管理器
 */
export class BulletManager {
  private bullets: BulletImpl[] = [];
  private factory: BulletFactory;
  private maxBullets: number;

  constructor(canvasWidth: number, canvasHeight: number, maxBullets: number = 100) {
    this.factory = new BulletFactory(canvasWidth, canvasHeight);
    this.maxBullets = maxBullets;
  }

  /**
   * 添加子弹
   */
  addBullet(bullet: BulletImpl): void {
    if (this.bullets.length >= this.maxBullets) {
      // 移除最老的子弹
      this.bullets.shift();
    }
    this.bullets.push(bullet);
  }

  /**
   * 创建并添加玩家子弹
   */
  createPlayerBullet(position: Vector2D): BulletImpl {
    const bullet = this.factory.createPlayerBullet(position);
    this.addBullet(bullet);
    return bullet;
  }

  /**
   * 创建并添加玩家导弹
   */
  createPlayerMissile(position: Vector2D, velocity: Vector2D): BulletImpl {
    const bullet = this.factory.createPlayerMissile(position, velocity);
    this.addBullet(bullet);
    return bullet;
  }

  /**
   * 创建并添加敌人子弹
   */
  createEnemyBullet(position: Vector2D, velocity: Vector2D, bulletType: BulletType = BulletType.NORMAL): BulletImpl {
    const bullet = this.factory.createEnemyBullet(position, velocity, bulletType);
    this.addBullet(bullet);
    return bullet;
  }

  /**
   * 更新所有子弹
   */
  update(deltaTime: number): void {
    for (const bullet of this.bullets) {
      bullet.update(deltaTime);
    }

    // 移除非活跃的子弹
    this.bullets = this.bullets.filter(bullet => bullet.active);
  }

  /**
   * 渲染所有子弹
   */
  render(renderer: Renderer): void {
    for (const bullet of this.bullets) {
      bullet.render(renderer);
    }
  }

  /**
   * 获取所有活跃的子弹
   */
  getActiveBullets(): BulletImpl[] {
    return this.bullets.filter(bullet => bullet.active);
  }

  /**
   * 获取玩家子弹
   */
  getPlayerBullets(): BulletImpl[] {
    return this.bullets.filter(bullet => bullet.active && bullet.owner === 'player');
  }

  /**
   * 获取敌人子弹
   */
  getEnemyBullets(): BulletImpl[] {
    return this.bullets.filter(bullet => bullet.active && bullet.owner === 'enemy');
  }

  /**
   * 清空所有子弹
   */
  clear(): void {
    this.bullets = [];
  }

  /**
   * 获取子弹数量
   */
  getCount(): number {
    return this.bullets.length;
  }

  /**
   * 获取活跃子弹数量
   */
  getActiveCount(): number {
    return this.bullets.filter(bullet => bullet.active).length;
  }
}