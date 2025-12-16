# 设计文档

## 概述

像素射击游戏是一个基于HTML5 Canvas和TypeScript的2D射击游戏。游戏采用经典的街机射击游戏机制，具有像素艺术风格、实时战斗系统和渐进式难度增长。

核心游戏循环包括玩家输入处理、游戏状态更新、碰撞检测和渲染。游戏使用组件化架构来管理不同的游戏实体（玩家、敌人、子弹）和系统（输入、渲染、音频）。

## 架构

### 整体架构
```
Game Engine
├── Core Systems
│   ├── Game Loop (更新/渲染循环)
│   ├── Input Manager (键盘输入处理)
│   ├── Collision System (碰撞检测)
│   └── Renderer (Canvas渲染)
├── Game Systems  
│   ├── Entity Manager (实体生命周期)
│   ├── Difficulty Manager (难度调节)
│   ├── Score System (得分管理)
│   └── Life System (生命管理)
└── Game Entities
    ├── Player Ship (玩家飞船)
    ├── Enemy Ship (敌人飞船)
    ├── Bullet (子弹)
    └── UI Elements (界面元素)
```

### 技术栈
- **前端**: TypeScript + HTML5 Canvas
- **构建工具**: Vite (快速开发和构建)
- **测试框架**: Vitest (单元测试) + fast-check (属性测试)
- **代码质量**: ESLint + Prettier

## 组件和接口

### 核心接口

```typescript
interface GameEntity {
  position: Vector2D;
  velocity: Vector2D;
  size: Vector2D;
  active: boolean;
  update(deltaTime: number): void;
  render(renderer: Renderer): void;
}

interface Vector2D {
  x: number;
  y: number;
}

interface GameState {
  player: PlayerShip;
  enemies: EnemyShip[];
  bullets: Bullet[];
  score: number;
  lives: number;
  gameTime: number;
  isGameOver: boolean;
}
```

### 主要组件

#### Game Engine
- 管理主游戏循环（60 FPS目标）
- 协调所有系统的更新和渲染
- 处理游戏状态转换（运行/暂停/游戏结束）

#### Input Manager
- 监听键盘事件（WSAD移动，空格射击）
- 提供当前输入状态查询接口
- 支持按键按下和释放事件

#### Entity Manager
- 管理所有游戏实体的生命周期
- 提供实体创建、更新和销毁功能
- 实现对象池化以优化性能

#### Collision System
- 实现轴对齐边界框（AABB）碰撞检测
- 处理玩家-敌人、子弹-敌人、子弹-玩家碰撞
- 优化碰撞检测性能（空间分割或简单优化）

#### Renderer
- 管理Canvas渲染上下文
- 实现像素完美渲染（禁用图像平滑）
- 提供基本图形绘制功能（矩形、精灵）

## 数据模型

### PlayerShip
```typescript
class PlayerShip implements GameEntity {
  position: Vector2D;
  velocity: Vector2D;
  size: Vector2D;
  speed: number;
  shootCooldown: number;
  active: boolean;
}
```

### EnemyShip  
```typescript
class EnemyShip implements GameEntity {
  position: Vector2D;
  velocity: Vector2D;
  size: Vector2D;
  speed: number;
  shootTimer: number;
  shootInterval: number;
  active: boolean;
}
```

### Bullet
```typescript
class Bullet implements GameEntity {
  position: Vector2D;
  velocity: Vector2D;
  size: Vector2D;
  owner: 'player' | 'enemy';
  active: boolean;
}
```

### GameConfig
```typescript
interface GameConfig {
  canvas: {
    width: number;
    height: number;
  };
  player: {
    speed: number;
    size: Vector2D;
    shootCooldown: number;
  };
  enemy: {
    baseSpeed: number;
    size: Vector2D;
    spawnRate: number;
    shootInterval: number;
  };
  bullet: {
    speed: number;
    size: Vector2D;
  };
  difficulty: {
    speedIncreaseRate: number;
    maxSpeed: number;
    enemySpawnIncreaseRate: number;
  };
}
```

## 正确性属性

*属性是一个特征或行为，应该在系统的所有有效执行中保持为真——本质上，是关于系统应该做什么的正式声明。属性作为人类可读规范和机器可验证正确性保证之间的桥梁。*

基于预工作分析，以下是从验收标准转换而来的可测试属性：

### 属性反思

在编写具体属性之前，我识别出以下冗余性：
- 移动属性（1.1-1.4）可以合并为一个综合的方向移动属性
- 子弹清理属性（2.3, 8.3）可以合并为通用的边界清理属性
- 生命损失属性（3.3, 3.4, 3.5）可以合并为综合的伤害机制属性
- 得分显示和更新属性（5.3, 5.5）可以合并为UI同步属性

### 核心属性

**属性 1: 方向移动一致性**
*对于任何*有效的方向输入（WSAD），玩家飞船的位置应该朝相应方向改变，且在边界内时移动距离应该一致
**验证: 需求 1.1, 1.2, 1.3, 1.4**

**属性 2: 边界约束保持**
*对于任何*玩家飞船位置，当飞船在游戏区域边界时，继续朝边界方向的移动输入不应使飞船超出边界
**验证: 需求 1.5**

**属性 3: 射击创建一致性**
*对于任何*射击输入，如果冷却时间已过，应该创建一颗新子弹，且子弹初始位置应该在玩家飞船位置
**验证: 需求 2.1, 2.5**

**属性 4: 碰撞移除对称性**
*对于任何*子弹和敌人的碰撞，两个实体都应该被标记为非活跃状态
**验证: 需求 2.2**

**属性 5: 边界清理一致性**
*对于任何*移动到屏幕边界外的子弹，该子弹应该被移除
**验证: 需求 2.3, 8.3**

**属性 6: 得分增长单调性**
*对于任何*敌人被摧毁的事件，玩家分数应该增加且永不减少
**验证: 需求 2.4, 5.2**

**属性 7: 敌人移动一致性**
*对于任何*活跃的敌人飞船，在每次更新后其Y坐标应该增加（向下移动）
**验证: 需求 3.2**

**属性 8: 伤害机制一致性**
*对于任何*导致玩家受伤的事件（敌人碰撞、敌人子弹击中、敌人到达底部），玩家生命数应该减少1
**验证: 需求 3.3, 3.4, 3.5, 8.2**

**属性 9: 生命系统完整性**
*对于任何*生命变化，当生命数大于0时游戏应继续，当生命数为0时游戏应结束
**验证: 需求 4.2, 4.3**

**属性 10: 重生位置一致性**
*对于任何*玩家死亡但未游戏结束的情况，玩家飞船应该重新出现在预定义的起始位置
**验证: 需求 4.5**

**属性 11: UI状态同步**
*对于任何*游戏状态变化（分数、生命），UI显示应该立即反映当前状态
**验证: 需求 4.4, 5.3, 5.5**

**属性 12: 难度递增单调性**
*对于任何*游戏时间的增加，敌人生成率和移动速度应该单调递增直到达到最大值
**验证: 需求 6.1, 6.2, 6.3**

**属性 13: 速度上限约束**
*对于任何*达到最大速度的游戏状态，进一步的时间推进应该只增加敌人数量而不增加速度
**验证: 需求 6.4**

**属性 14: 动画离散性**
*对于任何*动画帧，渲染应该使用离散的像素位置而非插值位置
**验证: 需求 7.4**

**属性 15: 敌人射击独立性**
*对于任何*多个敌人的场景，每个敌人的射击计时器应该独立运行
**验证: 需求 8.1, 8.5**

**属性 16: 敌人子弹移动一致性**
*对于任何*敌人发射的子弹，其Y坐标应该在每次更新后增加（向下移动）
**验证: 需求 8.4**

## 错误处理

### 输入验证
- 验证所有用户输入的有效性
- 处理无效的键盘输入
- 防止在游戏暂停或结束状态下的输入处理

### 边界检查
- 确保所有实体位置在有效范围内
- 处理实体移动超出屏幕边界的情况
- 验证碰撞检测的边界条件

### 状态一致性
- 验证游戏状态转换的有效性
- 处理并发状态修改
- 确保实体状态的一致性（活跃/非活跃）

### 性能保护
- 限制同时存在的实体数量
- 处理帧率下降的情况
- 实现对象池化以避免内存泄漏

### 渲染错误
- 处理Canvas上下文丢失
- 验证渲染参数的有效性
- 提供降级渲染选项

## 测试策略

### 双重测试方法

本项目将采用单元测试和基于属性的测试相结合的方法：

**单元测试**覆盖：
- 特定的游戏场景和边界情况
- 组件集成点
- 错误条件和异常处理
- 游戏状态转换的具体示例

**基于属性的测试**覆盖：
- 上述定义的所有正确性属性
- 使用fast-check库进行属性测试
- 每个属性测试运行最少100次迭代
- 每个属性测试必须用注释明确引用设计文档中的正确性属性

**属性测试标记格式**：
每个基于属性的测试必须使用以下格式标记：
`**Feature: pixel-shooter-game, Property {number}: {property_text}**`

**测试配置要求**：
- 属性测试最少运行100次迭代以确保随机性覆盖
- 单个正确性属性对应单个属性测试
- 测试应该验证真实功能而非使用模拟数据

### 测试覆盖范围

**核心功能测试**：
- 玩家移动和边界检查
- 射击机制和子弹管理
- 敌人生成和移动
- 碰撞检测系统
- 生命和得分系统

**集成测试**：
- 完整游戏循环
- 输入到渲染的端到端流程
- 难度系统随时间的变化

**性能测试**：
- 大量实体的处理能力
- 帧率稳定性
- 内存使用优化