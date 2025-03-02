import React from 'react';
import { createRoot } from 'react-dom/client';
import { Button } from './components/ui/button/Button';
import './styles/globals.css';

const App = () => {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">UI 组件库</h1>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">按钮组件</h2>
        <div className="flex flex-wrap gap-4">
          <div>
            <h3 className="text-lg mb-2">默认按钮</h3>
            <div className="flex gap-2">
              <Button>默认</Button>
              <Button disabled>禁用</Button>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg mb-2">次要按钮</h3>
            <div className="flex gap-2">
              <Button variant="secondary">次要</Button>
              <Button variant="secondary" disabled>禁用</Button>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg mb-2">轮廓按钮</h3>
            <div className="flex gap-2">
              <Button variant="outline">轮廓</Button>
              <Button variant="outline" disabled>禁用</Button>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg mb-2">危险按钮</h3>
            <div className="flex gap-2">
              <Button variant="destructive">危险</Button>
              <Button variant="destructive" disabled>禁用</Button>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg mb-2">幽灵按钮</h3>
            <div className="flex gap-2">
              <Button variant="ghost">幽灵</Button>
              <Button variant="ghost" disabled>禁用</Button>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg mb-2">链接按钮</h3>
            <div className="flex gap-2">
              <Button variant="link">链接</Button>
              <Button variant="link" disabled>禁用</Button>
            </div>
          </div>
        </div>
        
        <div className="mt-8">
          <h3 className="text-lg mb-2">按钮尺寸</h3>
          <div className="flex items-center gap-2">
            <Button size="sm">小按钮</Button>
            <Button>默认按钮</Button>
            <Button size="lg">大按钮</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

// 等待 DOM 加载完成
document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('root');
  if (container) {
    const root = createRoot(container);
    root.render(<App />);
  }
});
