import { useRef, useEffect, useState } from 'react';
import ImageUploader from './ImageUploader';

const App = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvasReady, setCanvasReady] = useState(false);

  // TODO: Why do I need to define the above as null and why does the receiving component have to worry about it
  // potentially being null? I have the ref in the JSX below, it could never be null because it's always present.

  useEffect(() => {
    if (canvasRef.current && !canvasReady) {
      setCanvasReady(true);
    }
  }, [canvasRef]);

  return (
    <div className="App">
      <h2>secbo</h2>
      {
        canvasReady && <ImageUploader canvas={canvasRef.current} />
      }
      <canvas ref={canvasRef} />
    </div>
  );
};

export default App;
