import { InputState } from '@/types';
import { KEYS } from '@/utils/constants';

/**
 * 输入管理器
 * 处理键盘输入并维护当前输入状态
 */
export class InputManager {
  private inputState: InputState;
  private keyDownHandlers: Map<string, () => void>;
  private keyUpHandlers: Map<string, () => void>;
  private isListening: boolean = false;

  constructor() {
    this.inputState = {
      up: false,
      down: false,
      left: false,
      right: false,
      shoot: false,
    };

    this.keyDownHandlers = new Map();
    this.keyUpHandlers = new Map();

    // 绑定事件处理器
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
  }

  /**
   * 开始监听键盘事件
   */
  startListening(): void {
    if (this.isListening) return;

    document.addEventListener('keydown', this.handleKeyDown);
    document.addEventListener('keyup', this.handleKeyUp);
    this.isListening = true;
  }

  /**
   * 停止监听键盘事件
   */
  stopListening(): void {
    if (!this.isListening) return;

    document.removeEventListener('keydown', this.handleKeyDown);
    document.removeEventListener('keyup', this.handleKeyUp);
    this.isListening = false;
  }

  /**
   * 处理按键按下事件
   */
  private handleKeyDown(event: KeyboardEvent): void {
    // 阻止默认行为
    if (this.isGameKey(event.code)) {
      event.preventDefault();
    }

    switch (event.code) {
      case KEYS.W:
        this.inputState.up = true;
        break;
      case KEYS.S:
        this.inputState.down = true;
        break;
      case KEYS.A:
        this.inputState.left = true;
        break;
      case KEYS.D:
        this.inputState.right = true;
        break;
      case KEYS.J:
        this.inputState.shoot = true;
        break;
    }

    // 调用自定义按键处理器
    const handler = this.keyDownHandlers.get(event.code);
    if (handler) {
      handler();
    }
  }

  /**
   * 处理按键释放事件
   */
  private handleKeyUp(event: KeyboardEvent): void {
    // 阻止默认行为
    if (this.isGameKey(event.code)) {
      event.preventDefault();
    }

    switch (event.code) {
      case KEYS.W:
        this.inputState.up = false;
        break;
      case KEYS.S:
        this.inputState.down = false;
        break;
      case KEYS.A:
        this.inputState.left = false;
        break;
      case KEYS.D:
        this.inputState.right = false;
        break;
      case KEYS.J:
        this.inputState.shoot = false;
        break;
    }

    // 调用自定义按键处理器
    const handler = this.keyUpHandlers.get(event.code);
    if (handler) {
      handler();
    }
  }

  /**
   * 检查是否是游戏相关按键
   */
  private isGameKey(keyCode: string): boolean {
    return Object.values(KEYS).includes(keyCode as any);
  }

  /**
   * 获取当前输入状态
   */
  getInputState(): InputState {
    return { ...this.inputState };
  }

  /**
   * 检查特定方向是否被按下
   */
  isDirectionPressed(direction: 'up' | 'down' | 'left' | 'right'): boolean {
    return this.inputState[direction];
  }

  /**
   * 检查射击键是否被按下
   */
  isShootPressed(): boolean {
    return this.inputState.shoot;
  }

  /**
   * 检查是否有任何移动输入
   */
  hasMovementInput(): boolean {
    return this.inputState.up || this.inputState.down || 
           this.inputState.left || this.inputState.right;
  }

  /**
   * 获取移动向量 (-1 到 1)
   */
  getMovementVector(): { x: number; y: number } {
    let x = 0;
    let y = 0;

    if (this.inputState.left) x -= 1;
    if (this.inputState.right) x += 1;
    if (this.inputState.up) y -= 1;
    if (this.inputState.down) y += 1;

    return { x, y };
  }

  /**
   * 注册按键按下处理器
   */
  onKeyDown(keyCode: string, handler: () => void): void {
    this.keyDownHandlers.set(keyCode, handler);
  }

  /**
   * 注册按键释放处理器
   */
  onKeyUp(keyCode: string, handler: () => void): void {
    this.keyUpHandlers.set(keyCode, handler);
  }

  /**
   * 移除按键处理器
   */
  removeKeyHandler(keyCode: string): void {
    this.keyDownHandlers.delete(keyCode);
    this.keyUpHandlers.delete(keyCode);
  }

  /**
   * 清空所有自定义处理器
   */
  clearAllHandlers(): void {
    this.keyDownHandlers.clear();
    this.keyUpHandlers.clear();
  }

  /**
   * 重置输入状态
   */
  reset(): void {
    this.inputState = {
      up: false,
      down: false,
      left: false,
      right: false,
      shoot: false,
    };
  }

  /**
   * 模拟按键按下（用于测试）
   */
  simulateKeyDown(keyCode: string): void {
    const event = new KeyboardEvent('keydown', { code: keyCode });
    this.handleKeyDown(event);
  }

  /**
   * 模拟按键释放（用于测试）
   */
  simulateKeyUp(keyCode: string): void {
    const event = new KeyboardEvent('keyup', { code: keyCode });
    this.handleKeyUp(event);
  }

  /**
   * 销毁输入管理器
   */
  destroy(): void {
    this.stopListening();
    this.clearAllHandlers();
    this.reset();
  }
}