import { FC, ChangeEvent, useEffect, useRef, useState } from 'react';
import DEFAULT_BINARY_CONTENT from '../constants';
import { readAlpha, textToBinary, throwNullErr, writeAlpha } from '../utils';
import ImageDetails, { ImageInfo } from './ImageDetails';
import ImageUploader, { UpdateCanvas } from './ImageUploader';
import UserAlert from './UserAlert';

const App: FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [imageInfo, setImageInfo] = useState<ImageInfo>({ text: '', binary: '', image: null, name: '', dl: '' });
  const [pixels, setPixels] = useState(0);
  const [freePixels, setFreePixels] = useState(0);
  const [alertMessage, setAlertMessage] = useState('');

  useEffect(() => {
    if (imageInfo?.image) {
      const tempPixels = imageInfo.image.width * imageInfo.image.height;
      const tempFreePixels = tempPixels - imageInfo.binary.length;

      setPixels(tempPixels);
      setFreePixels(tempFreePixels);
    }
  }, [imageInfo.text, imageInfo.binary, imageInfo.image]);

  const getCTX = () => canvasRef.current?.getContext('2d') ?? throwNullErr();

  const updateCanvas: UpdateCanvas = image => {
    const ctx = getCTX();
    ctx.canvas.width = image.width;
    ctx.canvas.height = image.height;
    ctx.drawImage(image, 0, 0);
  };

  const reset = (): void => {
    setImageInfo({
      text: '',
      binary: DEFAULT_BINARY_CONTENT,
      image: null,
      name: '',
      dl: '',
    });
  };

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>): void => {
    const ctx = getCTX();
    writeAlpha(ctx, textToBinary(e.target.value), setAlertMessage);
    setImageInfo({
      ...imageInfo,
      text: e.target.value,
      binary: textToBinary(e.target.value),
      dl: canvasRef.current?.toDataURL('image/png') ?? '',
    });
  };

  return (
    <div className="App" data-testid="app">
      <UserAlert message={alertMessage} dismiss={setAlertMessage} />
      <h2>secbo-ts</h2>
      <p>v 1.2.1</p>
      <ImageUploader
        updateCanvas={updateCanvas}
        imageInfo={imageInfo}
        setImageInfo={setImageInfo}
        readAlpha={() => readAlpha(getCTX())}
        textToBinary={textToBinary}
        fireAlert={setAlertMessage}
      />
      {
        imageInfo?.image?.src
        && (
          <>
            <ImageDetails
              imageInfo={imageInfo}
              pixels={pixels}
              freePixels={freePixels}
            />
            <textarea
              rows={15}
              cols={50}
              value={imageInfo.text}
              onChange={e => handleChange(e)}
            />
          </>
        )
      }
      {
        imageInfo.text.length > 0
        && (
          <a
            role="button"
            href={imageInfo.dl}
            download={imageInfo.name}
          >
            download
          </a>
        )
      }
      {
        imageInfo?.image?.src
        && (
          <button type="button" onClick={reset}>reset</button>
        )
      }
      <canvas ref={canvasRef} />
    </div>
  );
};

export default App;
