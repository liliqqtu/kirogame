import { assetManager } from './assetManager';
import { PIXEL_PALETTE } from './colorSystem';

/**
 * 创建默认的像素艺术资源
 */
export class DefaultAssets {
  /**
   * 创建所有默认资源
   */
  static createAll(): void {
    this.createPlayerShip();
    this.createEnemyShips();
    this.createPlayerBullet();
    this.createEnemyBullets();
    this.createPowerUps();
    this.createBackground();
    this.createStars();
  }

  /**
   * 创建玩家飞船图片 - 基于用户提供的像素艺术设计
   */
  private static createPlayerShip(): void {
    assetManager.createPixelArtImage('player', 64, 64, (ctx) => {
      // 飞船主体轮廓 - 浅灰色
      ctx.fillStyle = '#E8E8E8';
      // 中央主体
      ctx.fillRect(28, 8, 8, 32);
      ctx.fillRect(26, 12, 12, 24);
      ctx.fillRect(24, 16, 16, 16);
      
      // 飞船头部尖端
      ctx.fillStyle = '#F8F8F8';
      ctx.fillRect(30, 4, 4, 8);
      ctx.fillRect(28, 6, 8, 6);
      ctx.fillRect(26, 8, 12, 4);
      
      // 深灰色阴影和细节
      ctx.fillStyle = '#A0A0A0';
      ctx.fillRect(29, 10, 6, 2);
      ctx.fillRect(27, 14, 10, 2);
      ctx.fillRect(25, 18, 14, 2);
      
      // 红色装饰条纹和细节
      ctx.fillStyle = '#FF3333';
      // 侧面红色条纹
      ctx.fillRect(20, 20, 6, 16);
      ctx.fillRect(38, 20, 6, 16);
      // 中央红色装饰
      ctx.fillRect(29, 16, 6, 2);
      ctx.fillRect(28, 22, 8, 2);
      
      // 蓝色引擎舱
      ctx.fillStyle = '#3366FF';
      ctx.fillRect(22, 32, 4, 8);
      ctx.fillRect(38, 32, 4, 8);
      ctx.fillRect(28, 34, 8, 6);
      
      // 深蓝色引擎细节
      ctx.fillStyle = '#1144CC';
      ctx.fillRect(23, 34, 2, 4);
      ctx.fillRect(39, 34, 2, 4);
      ctx.fillRect(30, 36, 4, 2);
      
      // 橙色引擎火焰
      ctx.fillStyle = '#FF8800';
      ctx.fillRect(23, 40, 2, 6);
      ctx.fillRect(39, 40, 2, 6);
      ctx.fillRect(29, 40, 6, 8);
      
      // 黄色火焰核心
      ctx.fillStyle = '#FFDD00';
      ctx.fillRect(24, 42, 1, 3);
      ctx.fillRect(39, 42, 1, 3);
      ctx.fillRect(30, 42, 4, 4);
      
      // 白色火焰中心
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(31, 44, 2, 2);
      
      // 驾驶舱窗口
      ctx.fillStyle = '#222222';
      ctx.fillRect(30, 12, 4, 6);
      
      // 驾驶舱内部细节
      ctx.fillStyle = '#444444';
      ctx.fillRect(31, 14, 2, 2);
      
      // 侧翼武器
      ctx.fillStyle = '#BBBBBB';
      ctx.fillRect(18, 24, 4, 8);
      ctx.fillRect(42, 24, 4, 8);
      
      // 武器细节
      ctx.fillStyle = '#888888';
      ctx.fillRect(19, 26, 2, 4);
      ctx.fillRect(43, 26, 2, 4);
      
      // 黑色轮廓线（像素艺术风格）
      ctx.fillStyle = '#000000';
      // 外轮廓点
      ctx.fillRect(29, 3, 6, 1);
      ctx.fillRect(27, 4, 2, 1);
      ctx.fillRect(35, 4, 2, 1);
      
      // 添加一些发光效果点
      ctx.fillStyle = '#AAFFFF';
      ctx.fillRect(26, 20, 1, 1);
      ctx.fillRect(37, 20, 1, 1);
      ctx.fillRect(32, 18, 1, 1);
    });
  }

  /**
   * 创建3种敌人飞船图片
   */
  private static createEnemyShips(): void {
    // 基础敌人 - 红色
    assetManager.createPixelArtImage('enemy-basic', 24, 24, (ctx) => {
      // 飞船主体
      ctx.fillStyle = PIXEL_PALETTE.ENEMY_PRIMARY;
      ctx.fillRect(10, 4, 4, 16);
      
      // 飞船头部（朝下）
      ctx.fillRect(8, 16, 8, 6);
      ctx.fillStyle = PIXEL_PALETTE.ENEMY_SECONDARY;
      ctx.fillRect(10, 20, 4, 4);
      
      // 飞船翅膀
      ctx.fillStyle = PIXEL_PALETTE.ENEMY_DARK;
      ctx.fillRect(4, 8, 6, 8);
      ctx.fillRect(14, 8, 6, 8);
      
      // 武器
      ctx.fillStyle = PIXEL_PALETTE.ENEMY_SECONDARY;
      ctx.fillRect(6, 12, 2, 4);
      ctx.fillRect(16, 12, 2, 4);
      
      // 核心
      ctx.fillStyle = PIXEL_PALETTE.ENEMY_SECONDARY;
      ctx.fillRect(11, 10, 2, 2);
    });

    // 斜射敌人 - 橙色
    assetManager.createPixelArtImage('enemy-diagonal', 28, 28, (ctx) => {
      // 飞船主体
      ctx.fillStyle = '#FF6600';
      ctx.fillRect(12, 4, 4, 18);
      ctx.fillRect(10, 8, 8, 12);
      
      // 飞船头部（朝下）
      ctx.fillStyle = '#FF8800';
      ctx.fillRect(8, 18, 12, 6);
      ctx.fillRect(11, 22, 6, 4);
      
      // 斜向武器
      ctx.fillStyle = '#CC4400';
      ctx.fillRect(4, 10, 6, 6);
      ctx.fillRect(18, 10, 6, 6);
      
      // 斜向炮管
      ctx.fillStyle = '#AA3300';
      ctx.fillRect(2, 12, 4, 2);
      ctx.fillRect(22, 12, 4, 2);
      
      // 核心
      ctx.fillStyle = '#FFAA00';
      ctx.fillRect(13, 12, 2, 2);
    });

    // 激光敌人 - 紫色
    assetManager.createPixelArtImage('enemy-laser', 32, 32, (ctx) => {
      // 飞船主体
      ctx.fillStyle = '#8800FF';
      ctx.fillRect(14, 4, 4, 20);
      ctx.fillRect(12, 8, 8, 16);
      
      // 飞船头部（朝下）
      ctx.fillStyle = '#AA44FF';
      ctx.fillRect(10, 20, 12, 8);
      ctx.fillRect(13, 26, 6, 4);
      
      // 大型激光炮
      ctx.fillStyle = '#6600CC';
      ctx.fillRect(8, 12, 16, 8);
      ctx.fillStyle = '#4400AA';
      ctx.fillRect(10, 14, 12, 4);
      
      // 激光充能核心
      ctx.fillStyle = '#CCAAFF';
      ctx.fillRect(14, 15, 4, 2);
      
      // 侧翼稳定器
      ctx.fillStyle = '#5500BB';
      ctx.fillRect(6, 16, 4, 4);
      ctx.fillRect(22, 16, 4, 4);
    });

    // 精英敌人 - 金色
    assetManager.createPixelArtImage('enemy-elite', 36, 36, (ctx) => {
      // 飞船主体
      ctx.fillStyle = '#FFD700';
      ctx.fillRect(16, 4, 4, 24);
      ctx.fillRect(14, 8, 8, 20);
      
      // 飞船头部（朝下）
      ctx.fillStyle = '#FFA500';
      ctx.fillRect(12, 24, 12, 8);
      ctx.fillRect(15, 30, 6, 4);
      
      // 双重武器系统
      ctx.fillStyle = '#B8860B';
      ctx.fillRect(8, 12, 8, 8);
      ctx.fillRect(20, 12, 8, 8);
      
      // 精英标识
      ctx.fillStyle = '#FFFF00';
      ctx.fillRect(17, 14, 2, 2);
      ctx.fillRect(15, 16, 6, 2);
      
      // 护甲板
      ctx.fillStyle = '#DAA520';
      ctx.fillRect(6, 16, 4, 6);
      ctx.fillRect(26, 16, 4, 6);
      
      // 能量核心
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(17, 18, 2, 2);
    });

    // Boss敌人 - 深红色
    assetManager.createPixelArtImage('enemy-boss', 48, 48, (ctx) => {
      // Boss主体
      ctx.fillStyle = '#8B0000';
      ctx.fillRect(20, 4, 8, 32);
      ctx.fillRect(16, 8, 16, 28);
      
      // Boss头部（朝下）
      ctx.fillStyle = '#DC143C';
      ctx.fillRect(14, 32, 20, 12);
      ctx.fillRect(18, 42, 12, 4);
      
      // 多重武器系统
      ctx.fillStyle = '#4B0000';
      ctx.fillRect(8, 16, 8, 12);
      ctx.fillRect(32, 16, 8, 12);
      ctx.fillRect(12, 20, 24, 8);
      
      // Boss标识装甲
      ctx.fillStyle = '#FF4500';
      ctx.fillRect(4, 20, 6, 8);
      ctx.fillRect(38, 20, 6, 8);
      
      // 能量反应堆
      ctx.fillStyle = '#FF0000';
      ctx.fillRect(22, 22, 4, 4);
      
      // 护盾发生器
      ctx.fillStyle = '#00FFFF';
      ctx.fillRect(21, 18, 2, 2);
      ctx.fillRect(25, 18, 2, 2);
      ctx.fillRect(21, 26, 2, 2);
      ctx.fillRect(25, 26, 2, 2);
      
      // Boss眼部
      ctx.fillStyle = '#FFFF00';
      ctx.fillRect(23, 24, 2, 1);
    });
  }

  /**
   * 创建玩家子弹图片
   */
  private static createPlayerBullet(): void {
    assetManager.createPixelArtImage('playerBullet', 4, 8, (ctx) => {
      // 子弹主体
      ctx.fillStyle = PIXEL_PALETTE.BULLET_PLAYER;
      ctx.fillRect(1, 0, 2, 6);
      
      // 子弹尖端
      ctx.fillStyle = PIXEL_PALETTE.PLAYER_SECONDARY;
      ctx.fillRect(0, 0, 4, 2);
      
      // 尾迹
      ctx.fillStyle = PIXEL_PALETTE.PLAYER_SECONDARY;
      ctx.fillRect(1, 6, 2, 2);
    });
  }

  /**
   * 创建敌人子弹图片
   */
  private static createEnemyBullets(): void {
    // 普通敌人子弹
    assetManager.createPixelArtImage('enemyBullet', 4, 8, (ctx) => {
      // 子弹主体
      ctx.fillStyle = PIXEL_PALETTE.BULLET_ENEMY;
      ctx.fillRect(1, 2, 2, 6);
      
      // 子弹尖端
      ctx.fillStyle = PIXEL_PALETTE.ENEMY_SECONDARY;
      ctx.fillRect(0, 6, 4, 2);
      
      // 尾迹
      ctx.fillStyle = PIXEL_PALETTE.ENEMY_SECONDARY;
      ctx.fillRect(1, 0, 2, 2);
    });

    // 激光束
    assetManager.createPixelArtImage('enemyLaser', 6, 32, (ctx) => {
      // 激光束主体
      ctx.fillStyle = PIXEL_PALETTE.BULLET_ENEMY;
      ctx.fillRect(1, 0, 4, 32);
      
      // 激光束核心
      ctx.fillStyle = '#FFAA44';
      ctx.fillRect(2, 0, 2, 32);
      
      // 激光束边缘发光
      ctx.fillStyle = '#FF6600';
      ctx.fillRect(0, 0, 1, 32);
      ctx.fillRect(5, 0, 1, 32);
    });
  }

  /**
   * 创建道具图片
   */
  private static createPowerUps(): void {
    // 导弹包道具
    assetManager.createPixelArtImage('powerup-missile', 32, 32, (ctx) => {
      // 道具背景
      ctx.fillStyle = '#00AA00';
      ctx.fillRect(0, 0, 32, 32);
      
      // 边框
      ctx.fillStyle = '#00FF00';
      ctx.fillRect(0, 0, 32, 2);
      ctx.fillRect(0, 30, 32, 2);
      ctx.fillRect(0, 0, 2, 32);
      ctx.fillRect(30, 0, 2, 32);
      
      // 导弹图标
      ctx.fillStyle = '#FFFF00';
      ctx.fillRect(8, 6, 16, 4);
      ctx.fillRect(12, 10, 8, 16);
      
      // 导弹尖端
      ctx.fillStyle = '#FF4444';
      ctx.fillRect(14, 4, 4, 4);
      
      // 导弹尾翼
      ctx.fillStyle = '#CCCCCC';
      ctx.fillRect(10, 24, 4, 4);
      ctx.fillRect(18, 24, 4, 4);
    });
  }

  /**
   * 创建背景图片
   */
  private static createBackground(): void {
    assetManager.createPixelArtImage('background', 800, 600, (ctx) => {
      // 深空渐变背景
      const gradient = ctx.createLinearGradient(0, 0, 0, 600);
      gradient.addColorStop(0, PIXEL_PALETTE.SPACE_DARK);
      gradient.addColorStop(0.5, PIXEL_PALETTE.SPACE_MEDIUM);
      gradient.addColorStop(1, PIXEL_PALETTE.SPACE_LIGHT);
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 800, 600);
      
      // 添加一些星星
      ctx.fillStyle = PIXEL_PALETTE.WHITE;
      for (let i = 0; i < 100; i++) {
        const x = Math.random() * 800;
        const y = Math.random() * 600;
        const size = Math.random() < 0.7 ? 1 : 2;
        ctx.fillRect(x, y, size, size);
      }
      
      // 添加一些更亮的星星
      ctx.fillStyle = PIXEL_PALETTE.UI_PRIMARY;
      for (let i = 0; i < 20; i++) {
        const x = Math.random() * 800;
        const y = Math.random() * 600;
        ctx.fillRect(x, y, 1, 1);
      }
    });
  }

  /**
   * 创建动态星星背景
   */
  private static createStars(): void {
    assetManager.createPixelArtImage('star', 2, 2, (ctx) => {
      ctx.fillStyle = PIXEL_PALETTE.WHITE;
      ctx.fillRect(0, 0, 2, 2);
    });
    
    assetManager.createPixelArtImage('brightStar', 3, 3, (ctx) => {
      ctx.fillStyle = PIXEL_PALETTE.UI_PRIMARY;
      ctx.fillRect(1, 0, 1, 3);
      ctx.fillRect(0, 1, 3, 1);
    });
  }
}

/**
 * 资源路径配置
 * 用户可以将自己的图片放在public/assets/目录下
 */
export const ASSET_PATHS = {
  player: '/assets/player.png',
  'enemy-basic': '/assets/enemy-basic.png',
  'enemy-diagonal': '/assets/enemy-diagonal.png',
  'enemy-laser': '/assets/enemy-laser.png',
  'enemy-elite': '/assets/enemy-elite.png',
  'enemy-boss': '/assets/enemy-boss.png',
  playerBullet: '/assets/player-bullet.png',
  enemyBullet: '/assets/enemy-bullet.png',
  enemyLaser: '/assets/enemy-laser-bullet.png',
  'powerup-missile': '/assets/powerup-missile.png',
  background: '/assets/background.png',
  star: '/assets/star.png',
  brightStar: '/assets/bright-star.png',
};

/**
 * 尝试加载用户提供的图片，如果失败则使用默认像素艺术
 */
export async function loadGameAssets(): Promise<void> {
  console.log('正在加载游戏资源...');
  
  // 首先创建默认资源
  DefaultAssets.createAll();
  
  // 尝试加载用户提供的图片
  const loadPromises = Object.entries(ASSET_PATHS).map(async ([name, path]) => {
    try {
      await assetManager.loadImage(`custom_${name}`, path);
      console.log(`✓ 加载自定义图片: ${name} 从 ${path}`);
    } catch (error) {
      console.log(`❌ 加载失败: ${name} 从 ${path}, 错误:`, error);
      console.log(`使用默认像素艺术: ${name}`);
    }
  });
  
  await Promise.allSettled(loadPromises);
  console.log('游戏资源加载完成!');
}

/**
 * 获取资源（优先使用自定义图片，否则使用默认图片）
 */
export function getAsset(name: string): HTMLImageElement | null {
  const customAsset = assetManager.getImage(`custom_${name}`);
  const defaultAsset = assetManager.getImage(name);
  
  // 调试信息
  if (!customAsset && !defaultAsset) {
    console.log(`资源未找到: ${name}, 尝试了 custom_${name} 和 ${name}`);
  }
  
  return customAsset || defaultAsset;
}