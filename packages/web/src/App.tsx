import { TestTRPC } from './components/TestTRPC';

function App() {
  console.log('渲染 App 组件...');

  return (
    <div style={{
      maxWidth: '800px',
      margin: '0 auto',
      padding: '20px',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      backgroundColor: '#f5f5f5',
      minHeight: '100vh',
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      }}>
        <h1 style={{ 
          color: '#333',
          marginTop: 0,
          marginBottom: '20px',
        }}>
          Noteum tRPC 测试
        </h1>
        <TestTRPC />
      </div>
    </div>
  );
}

export default App;
