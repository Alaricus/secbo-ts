import { useRef } from 'react';
import ImageUploader from './ImageUploader';

const App = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // TODO: Why do I need to define the above as null and why does the receiving component have to worry about it
  // potentially being null? I have the ref in the JSX below, it could never be null because it's always present.

  return (
    <div className="App">
      <h2>secbo</h2>
      <ImageUploader canvas={canvasRef.current} />
      <canvas ref={canvasRef} />
    </div>
  );
};

export default App;
