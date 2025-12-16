// 游戏主入口文件
import { Game } from './game';

console.log('像素射击游戏初始化中...');

// 创建游戏实例
let game: Game;

try {
  game = new Game('gameCanvas');
  console.log('游戏初始化完成! 正在加载资源...');
  console.log('');
  console.log('🎮 控制说明:');
  console.log('- Enter: 开始游戏');
  console.log('- WSAD: 移动飞船');
  console.log('- 空格: 射击');
  console.log('- Esc: 暂停/继续');
  console.log('- Q: 退出到菜单');
  console.log('');
  console.log('🎨 自定义图片:');
  console.log('将图片放在 public/assets/ 文件夹中:');
  console.log('- player.png (玩家飞船)');
  console.log('- enemy.png (敌人飞船)');
  console.log('- player-bullet.png (玩家子弹)');
  console.log('- enemy-bullet.png (敌人子弹)');
  console.log('- background.png (游戏背景)');
  console.log('如果没有图片，会使用默认的像素艺术风格。');
} catch (error) {
  console.error('游戏初始化失败:', error);
  
  // 显示错误信息
  const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
  if (canvas) {
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#ff0000';
      ctx.font = '16px Courier New';
      ctx.fillText('游戏初始化失败!', 50, 50);
      ctx.fillText('请检查控制台错误信息', 50, 80);
    }
  }
}

// 处理页面卸载
window.addEventListener('beforeunload', () => {
  if (game) {
    game.destroy();
  }
});