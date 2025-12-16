import { GameStateType, PowerUpType } from '@/types';
import { CanvasRenderer } from '@/systems/renderer';
import { InputManager } from '@/systems/inputManager';
import { CollisionSystem } from '@/systems/collisionSystem';
import { LifeSystem } from '@/systems/lifeSystem';
import { ScoreSystem } from '@/systems/scoreSystem';
import { DifficultySystem } from '@/systems/difficultySystem';
import { PlayerShipImpl } from '@/entities/playerShip';
import { BulletManager } from '@/entities/bullet';
import { EnemyManager } from '@/entities/enemyShip';
import { PowerUpManager } from '@/entities/powerUp';
import { COLORS } from '@/utils/constants';
import { loadGameAssets, getAsset } from '@/systems/defaultAssets';

/**
 * 主游戏类
 */
export class Game {
  private canvas: HTMLCanvasElement;
  private renderer: CanvasRenderer;
  private inputManager: InputManager;
  private collisionSystem: CollisionSystem;
  private lifeSystem: LifeSystem;
  private scoreSystem: ScoreSystem;
  private difficultySystem: DifficultySystem;
  
  private player: PlayerShipImpl;
  private bulletManager: BulletManager;
  private enemyManager: EnemyManager;
  private powerUpManager: PowerUpManager;
  
  private gameState: GameStateType;
  private isRunning: boolean;
  private lastTime: number;
  
  private scoreElement: HTMLElement | null;
  private livesElement: HTMLElement | null;
  private assetsLoaded: boolean = false;
  


  constructor(canvasId: string) {
    // 获取Canvas元素
    this.canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    if (!this.canvas) {
      throw new Error(`Canvas元素 '${canvasId}' 未找到`);
    }

    // 初始化系统
    this.renderer = new CanvasRenderer(this.canvas);
    this.inputManager = new InputManager();
    this.collisionSystem = new CollisionSystem();
    this.lifeSystem = new LifeSystem();
    this.scoreSystem = new ScoreSystem();
    this.difficultySystem = new DifficultySystem();

    // 初始化游戏实体
    this.player = new PlayerShipImpl(this.canvas.width, this.canvas.height);
    this.bulletManager = new BulletManager(this.canvas.width, this.canvas.height);
    this.enemyManager = new EnemyManager(this.canvas.width, this.canvas.height);
    this.powerUpManager = new PowerUpManager(this.canvas.width, this.canvas.height);

    // 初始化游戏状态
    this.gameState = GameStateType.MENU;
    this.isRunning = false;
    this.lastTime = 0;

    // 获取UI元素
    this.scoreElement = document.getElementById('score');
    this.livesElement = document.getElementById('lives');

    // 绑定方法
    this.gameLoop = this.gameLoop.bind(this);
    this.menuLoop = this.menuLoop.bind(this);
    
    // 设置输入处理
    this.setupInput();
    
    // 加载资源然后开始菜单循环
    this.initializeAssets();
  }

  /**
   * 设置输入处理
   */
  private setupInput(): void {
    this.inputManager.onKeyDown('Enter', () => {
      if (this.gameState === GameStateType.MENU || this.gameState === GameStateType.GAME_OVER) {
        this.startGame();
      }
    });

    this.inputManager.onKeyDown('Escape', () => {
      if (this.gameState === GameStateType.PLAYING) {
        this.pauseGame();
      } else if (this.gameState === GameStateType.PAUSED) {
        this.resumeGame();
      }
    });

    // 添加Q键退出游戏功能
    this.inputManager.onKeyDown('KeyQ', () => {
      if (this.gameState === GameStateType.PLAYING || 
          this.gameState === GameStateType.PAUSED || 
          this.gameState === GameStateType.GAME_OVER) {
        this.quitToMenu();
      }
    });

    // 添加K键导弹发射功能
    this.inputManager.onKeyDown('KeyK', () => {
      if (this.gameState === GameStateType.PLAYING) {
        this.handleMissileShoot();
      }
    });
  }

  /**
   * 初始化资源
   */
  private async initializeAssets(): Promise<void> {
    try {
      await loadGameAssets();
      this.assetsLoaded = true;
      this.startMenuLoop();
    } catch (error) {
      console.error('资源加载失败:', error);
      this.assetsLoaded = true; // 即使失败也继续，使用默认渲染
      this.startMenuLoop();
    }
  }

  /**
   * 开始菜单循环
   */
  startMenuLoop(): void {
    this.inputManager.startListening();
    requestAnimationFrame(this.menuLoop);
  }

  /**
   * 菜单循环
   */
  private menuLoop(): void {
    this.render();
    
    // 如果还在菜单状态或游戏结束状态，继续循环
    if (this.gameState === GameStateType.MENU || this.gameState === GameStateType.GAME_OVER) {
      requestAnimationFrame(this.menuLoop);
    }
  }

  /**
   * 开始游戏
   */
  startGame(): void {
    this.gameState = GameStateType.PLAYING;
    this.isRunning = true;
    
    // 重置游戏状态
    this.lifeSystem.reset();
    this.scoreSystem.reset();
    this.difficultySystem.reset();
    this.player.respawn();
    this.bulletManager.clear();
    this.enemyManager.clear();
    this.powerUpManager.clear();
    this.enemyManager.resetBossSpawn();
    
    // 开始游戏循环
    this.lastTime = performance.now();
    requestAnimationFrame(this.gameLoop);
  }

  /**
   * 暂停游戏
   */
  pauseGame(): void {
    this.gameState = GameStateType.PAUSED;
  }

  /**
   * 恢复游戏
   */
  resumeGame(): void {
    this.gameState = GameStateType.PLAYING;
    this.lastTime = performance.now();
  }

  /**
   * 结束游戏
   */
  endGame(): void {
    this.gameState = GameStateType.GAME_OVER;
  }

  /**
   * 退出到菜单
   */
  quitToMenu(): void {
    this.gameState = GameStateType.MENU;
    this.isRunning = false;
    
    // 重置游戏状态
    this.lifeSystem.reset();
    this.scoreSystem.reset();
    this.difficultySystem.reset();
    this.bulletManager.clear();
    this.enemyManager.clear();
    this.powerUpManager.clear();
    this.enemyManager.resetBossSpawn();
    
    // 开始菜单循环
    this.startMenuLoop();
  }

  /**
   * 游戏主循环
   */
  private gameLoop(currentTime: number): void {
    if (!this.isRunning) return;

    const deltaTime = currentTime - this.lastTime;
    this.lastTime = currentTime;

    // 只在游戏进行时更新
    if (this.gameState === GameStateType.PLAYING) {
      this.update(deltaTime);
    }

    this.render();

    // 继续循环
    if (this.isRunning) {
      requestAnimationFrame(this.gameLoop);
    }
  }

  /**
   * 更新游戏状态
   */
  private update(deltaTime: number): void {
    // 更新难度系统
    this.difficultySystem.update(deltaTime);
    this.updateDifficulty();
    
    // 更新玩家
    this.updatePlayer(deltaTime);
    
    // 更新子弹
    this.bulletManager.update(deltaTime);
    
    // 更新敌人
    this.enemyManager.setCurrentScore(this.scoreSystem.getScore());
    this.enemyManager.update(deltaTime);
    
    // 更新道具
    this.powerUpManager.update(deltaTime, this.scoreSystem.getScore());
    
    // 处理敌人射击
    this.handleEnemyShooting();
    
    // 检测碰撞
    this.handleCollisions();
    
    // 检测道具收集
    this.handlePowerUpCollection();
    
    // 检查游戏结束条件
    this.checkGameOver();
    
    // 更新UI
    this.updateUI();
  }

  /**
   * 根据难度系统更新游戏参数
   */
  private updateDifficulty(): void {
    const difficulty = this.difficultySystem.getDifficultyInfo();
    
    // 更新敌人管理器的难度参数
    this.enemyManager.setDifficulty(difficulty.spawnRate, difficulty.enemySpeed);
    
    // 更新玩家速度
    this.player.speed = difficulty.playerSpeed;
  }

  /**
   * 更新玩家
   */
  private updatePlayer(deltaTime: number): void {
    const inputState = this.inputManager.getInputState();
    const movementVector = this.inputManager.getMovementVector();
    
    // 更新玩家移动
    this.player.updateMovement(movementVector, deltaTime);
    this.player.update(deltaTime);
    
    // 处理射击
    if (inputState.shoot && this.player.canShoot()) {
      const bullet = this.player.shoot();
      if (bullet) {
        this.bulletManager.createPlayerBullet(bullet.position);
      }
    }
  }

  /**
   * 处理敌人射击
   */
  private handleEnemyShooting(): void {
    const shootingEnemies = this.enemyManager.getShootingEnemies();
    
    for (const enemy of shootingEnemies) {
      const bullet = enemy.shoot();
      if (bullet) {
        this.bulletManager.createEnemyBullet(bullet.position, bullet.velocity, bullet.bulletType);
      }
    }
  }

  /**
   * 处理碰撞
   */
  private handleCollisions(): void {
    const activeEnemies = this.enemyManager.getActiveEnemies();
    const activeBullets = this.bulletManager.getActiveBullets();
    
    const collisions = this.collisionSystem.checkAllCollisions(
      this.player,
      activeEnemies,
      activeBullets
    );

    // 处理玩家-敌人碰撞
    for (const enemy of collisions.playerEnemyCollisions) {
      enemy.destroy();
      this.lifeSystem.loseLife();
      this.player.respawn();
    }

    // 处理子弹-敌人碰撞
    for (const collision of collisions.bulletEnemyCollisions) {
      collision.bullet.destroy();
      
      // 敌人受伤，如果被摧毁则加分
      if (collision.enemy.takeDamage(1)) {
        const scoreValue = this.enemyManager.getEnemyScoreValue(collision.enemy);
        this.scoreSystem.addScore(scoreValue);
      }
    }

    // 处理敌人子弹-玩家碰撞
    for (const bullet of collisions.bulletPlayerCollisions) {
      bullet.destroy();
      this.lifeSystem.loseLife();
      this.player.respawn();
    }

    // 检查敌人到达底部
    const enemiesAtBottom = this.enemyManager.getEnemiesAtBottom();
    for (const enemy of enemiesAtBottom) {
      enemy.destroy();
      this.lifeSystem.loseLife();
    }
  }

  /**
   * 检查游戏结束
   */
  private checkGameOver(): void {
    if (this.lifeSystem.isGameOver()) {
      this.endGame();
    }
  }

  /**
   * 更新UI
   */
  private updateUI(): void {
    if (this.scoreElement) {
      this.scoreElement.textContent = this.scoreSystem.getScore().toString();
    }
    
    if (this.livesElement) {
      this.livesElement.textContent = this.lifeSystem.getLives().toString();
    }
  }

  /**
   * 渲染游戏UI覆盖层
   */
  private renderGameUI(): void {
    // 显示导弹状态
    if (this.player.hasMissileAbility()) {
      const timeLeft = this.player.getMissileTimeLeft();
      this.renderer.drawText(
        `导弹: ${timeLeft}s`,
        10,
        this.canvas.height - 60,
        COLORS.UI_ACCENT,
        '16px Courier New'
      );
      
      this.renderer.drawText(
        'K - 发射导弹',
        10,
        this.canvas.height - 40,
        COLORS.UI_TEXT,
        '14px Courier New'
      );
    }
  }

  /**
   * 渲染游戏
   */
  private render(): void {
    // 清空画布
    this.renderer.clear();

    // 如果资源还没加载完成，显示加载界面
    if (!this.assetsLoaded) {
      this.renderLoading();
      return;
    }

    switch (this.gameState) {
      case GameStateType.MENU:
        this.renderMenu();
        break;
      case GameStateType.PLAYING:
        this.renderGame();
        this.renderGameUI();
        break;
      case GameStateType.PAUSED:
        this.renderGame();
        this.renderGameUI();
        this.renderPauseOverlay();
        break;
      case GameStateType.GAME_OVER:
        this.renderGame();
        this.renderGameOverOverlay();
        break;
    }
  }

  /**
   * 渲染加载界面
   */
  private renderLoading(): void {
    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2;

    this.renderer.drawText(
      '加载游戏资源中...',
      centerX - 80,
      centerY,
      COLORS.UI_TEXT,
      '18px Courier New'
    );
  }

  /**
   * 渲染菜单
   */
  private renderMenu(): void {
    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2;

    // 游戏标题
    this.renderer.drawText(
      '像素射击游戏',
      centerX - 80,
      centerY - 100,
      COLORS.UI_ACCENT,
      '28px Courier New'
    );

    // 副标题
    this.renderer.drawText(
      'PIXEL SHOOTER',
      centerX - 70,
      centerY - 70,
      COLORS.UI_TEXT,
      '16px Courier New'
    );

    // Play按钮效果
    this.renderer.drawRectOutline(
      centerX - 100,
      centerY - 20,
      200,
      40,
      COLORS.UI_ACCENT,
      2
    );
    
    this.renderer.drawText(
      'PLAY',
      centerX - 20,
      centerY - 5,
      COLORS.UI_ACCENT,
      '20px Courier New'
    );

    this.renderer.drawText(
      '按 Enter 开始游戏',
      centerX - 80,
      centerY + 40,
      COLORS.UI_TEXT,
      '14px Courier New'
    );

    // 控制说明
    this.renderer.drawText(
      '游戏控制:',
      centerX - 50,
      centerY + 80,
      COLORS.UI_TEXT,
      '16px Courier New'
    );

    this.renderer.drawText(
      'WSAD - 移动飞船',
      centerX - 70,
      centerY + 105,
      COLORS.UI_TEXT,
      '14px Courier New'
    );

    this.renderer.drawText(
      'J - 射击',
      centerX - 30,
      centerY + 125,
      COLORS.UI_TEXT,
      '14px Courier New'
    );

    this.renderer.drawText(
      'Esc - 暂停游戏',
      centerX - 50,
      centerY + 145,
      COLORS.UI_TEXT,
      '14px Courier New'
    );

    this.renderer.drawText(
      'K - 导弹发射 (需道具)',
      centerX - 80,
      centerY + 165,
      COLORS.UI_TEXT,
      '14px Courier New'
    );

    this.renderer.drawText(
      'Q - 退出到菜单',
      centerX - 60,
      centerY + 185,
      COLORS.UI_TEXT,
      '14px Courier New'
    );

    // 最高分显示
    if (this.scoreSystem.getHighScore() > 0) {
      this.renderer.drawText(
        `最高分: ${this.scoreSystem.getHighScore()}`,
        centerX - 60,
        centerY + 200,
        COLORS.UI_ACCENT,
        '16px Courier New'
      );
    }
  }

  /**
   * 渲染游戏
   */
  private renderGame(): void {
    // 渲染背景
    this.renderBackground();
    
    // 渲染玩家
    this.player.render(this.renderer);
    
    // 渲染子弹
    this.bulletManager.render(this.renderer);
    
    // 渲染敌人
    this.enemyManager.render(this.renderer);
    
    // 渲染道具
    this.powerUpManager.render(this.renderer);
  }

  /**
   * 渲染背景
   */
  private renderBackground(): void {
    const backgroundImage = getAsset('background');
    
    if (backgroundImage) {
      this.renderer.drawBackground(backgroundImage, 'stretch');
    }
    // 如果没有背景图片，使用默认的清空画布（已经在render()中调用了clear()）
  }

  /**
   * 渲染暂停覆盖层
   */
  private renderPauseOverlay(): void {
    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2;

    // 半透明背景
    this.renderer.setAlpha(0.8);
    this.renderer.drawRect(0, 0, this.canvas.width, this.canvas.height, '#000000');
    this.renderer.setAlpha(1);

    // 暂停框
    this.renderer.drawRectOutline(
      centerX - 120,
      centerY - 60,
      240,
      120,
      COLORS.UI_ACCENT,
      2
    );

    this.renderer.drawText(
      '游戏暂停',
      centerX - 40,
      centerY - 30,
      COLORS.UI_TEXT,
      '20px Courier New'
    );

    this.renderer.drawText(
      'Esc - 继续游戏',
      centerX - 60,
      centerY + 5,
      COLORS.UI_ACCENT,
      '16px Courier New'
    );

    this.renderer.drawText(
      'Q - 退出到菜单',
      centerX - 70,
      centerY + 30,
      COLORS.UI_TEXT,
      '16px Courier New'
    );
  }

  /**
   * 渲染游戏结束覆盖层
   */
  private renderGameOverOverlay(): void {
    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2;

    // 半透明背景
    this.renderer.setAlpha(0.9);
    this.renderer.drawRect(0, 0, this.canvas.width, this.canvas.height, '#000000');
    this.renderer.setAlpha(1);

    // 游戏结束框
    this.renderer.drawRectOutline(
      centerX - 150,
      centerY - 80,
      300,
      160,
      COLORS.UI_ACCENT,
      3
    );

    this.renderer.drawText(
      'GAME OVER',
      centerX - 60,
      centerY - 60,
      COLORS.UI_ACCENT,
      '24px Courier New'
    );

    this.renderer.drawText(
      `最终得分: ${this.scoreSystem.getScore()}`,
      centerX - 80,
      centerY - 20,
      COLORS.UI_TEXT,
      '18px Courier New'
    );

    // 检查是否创造新纪录
    if (this.scoreSystem.getScore() === this.scoreSystem.getHighScore() && this.scoreSystem.getScore() > 0) {
      this.renderer.drawText(
        '🎉 新纪录! 🎉',
        centerX - 60,
        centerY + 5,
        COLORS.UI_ACCENT,
        '16px Courier New'
      );
    } else {
      this.renderer.drawText(
        `最高得分: ${this.scoreSystem.getHighScore()}`,
        centerX - 80,
        centerY + 5,
        COLORS.UI_TEXT,
        '16px Courier New'
      );
    }

    this.renderer.drawText(
      'Enter - 重新开始',
      centerX - 80,
      centerY + 40,
      COLORS.UI_ACCENT,
      '16px Courier New'
    );

    this.renderer.drawText(
      'Q - 返回菜单',
      centerX - 60,
      centerY + 60,
      COLORS.UI_TEXT,
      '16px Courier New'
    );
  }

  /**
   * 处理导弹发射
   */
  private handleMissileShoot(): void {
    const missiles = this.player.shootMissile();
    if (missiles) {
      for (const missile of missiles) {
        this.bulletManager.createPlayerMissile(missile.position, missile.velocity);
      }
    }
  }

  /**
   * 处理道具收集
   */
  private handlePowerUpCollection(): void {
    const collectedPowerUps = this.powerUpManager.checkCollisions(
      this.player.position,
      this.player.size
    );

    for (const powerUp of collectedPowerUps) {
      if (powerUp.powerUpType === PowerUpType.MISSILE) {
        this.player.gainMissiles();
        console.log('获得导弹能力！');
      }
    }
  }

  /**
   * 销毁游戏
   */
  destroy(): void {
    this.isRunning = false;
    this.inputManager.destroy();
  }
}