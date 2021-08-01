import { useRef, useEffect, useState, ChangeEvent } from 'react';
import ImageUploader, { ReadAlpha, TextConversion, UpdateCanvas } from './ImageUploader';
import ImageDetails, { ImageInfo } from './ImageDetails';

const App = (): JSX.Element => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvasReady, setCanvasReady] = useState(false);
  const [imageInfo, setImageInfo] = useState<ImageInfo>({ text: '', binary: '', image: null, name: '', dl: '' });
  const [pixels, setPixels] = useState(0);
  const [freePixels, setFreePixels] = useState(0);

  // TODO: Why do I need to define the above as null and why does the receiving component have to worry about it
  // potentially being null? I have the ref in the JSX below, it could never be null because it's always present.

  let ctx: CanvasRenderingContext2D | null = null;

  if (canvasRef.current) {
    ctx = canvasRef.current.getContext('2d');
  }

  const updateCanvas: UpdateCanvas = image => {
    // TODO: See if this "if" null check can be avoided.
    if (ctx) {
      ctx.canvas.width = image.width;
      ctx.canvas.height = image.height;
      ctx.drawImage(image, 0, 0);
    }
  };

  useEffect(() => {
    if (canvasRef.current && !canvasReady) {
      setCanvasReady(true);
    }
  }, [canvasRef]);

  useEffect(() => {
    if (imageInfo?.image) {
      const tempPixels = imageInfo.image.width * imageInfo.image.height;
      const tempFreePixels = tempPixels - imageInfo.binary.length;

      setPixels(tempPixels);
      setFreePixels(tempFreePixels);
    }
  }, [imageInfo.text, imageInfo.binary, imageInfo.image]);

  const textToBinary: TextConversion = txt => `[secbo]${txt}[/secbo]`.split('').map(c => `${c.charCodeAt(0).toString(2)} `).join('');

  const binaryToText: TextConversion = bin => bin.split(' ').map(b => String.fromCharCode(parseInt(b, 2))).join('');

  const reset = (image: HTMLImageElement | null, name: string): void => {
    setImageInfo({
      text: '',
      binary: '1011011 1110011 1100101 1100011 1100010 1101111 1011101  1011011 101111 1110011 1100101 1100011 1100010 1101111 1011101',
      image,
      name,
      dl: '',
    });
  };

  const readAlpha: ReadAlpha = () => {
    // TODO: See if this "if" null check can be avoided.
    if (ctx) {
      const ctxImageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
      const bin = ctxImageData.data.reduce((acc, value, index) => {
        if (index > 0 && (index + 1) % 4 === 0) {
          if (value === 253) {
            const tempAcc = `${acc} `;
            return tempAcc;
          }
          if (value === 254) {
            const tempAcc = `${acc}1`;
            return tempAcc;
          }
          if (value === 255) {
            const tempAcc = `${acc}0`;
            return tempAcc;
          }
        }
        return acc;
      }, '');

      const text = binaryToText(bin);

      if (text.startsWith('[secbo]') && text.substring(0, text.length - 1).endsWith('[/secbo]')) {
        return text.substring(7, text.length - 9);
      }
    }

    return null;
  };

  const writeAlpha = (binary: string): void => {
    // TODO: See if this "if" null check can be avoided.
    if (ctx) {
      const ctxImageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
      if (ctxImageData.data.length / 4 >= binary.length) {
        // This sets everything to 255, so no need to handle zeroes
        ctxImageData.data.forEach((datum, index) => {
          if (index > 0 && (index + 1) % 4 === 0) {
            ctxImageData.data[index] = 255;
          }
        });

        binary.split('').forEach((digit, index) => {
          if (digit === '1') {
            ctxImageData.data[(index * 4) + 3] = 254;
          }

          if (digit === ' ') {
            ctxImageData.data[(index * 4) + 3] = 253;
          }
        });

        ctx.putImageData(ctxImageData, 0, 0);
      } else {
        // TODO: Set up a mechanism for reporting errors to the user
        alert('The image was too small to contain all this data.');
      }
    }
  };

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>): void => {
    writeAlpha(textToBinary(e.target.value));
    setImageInfo({
      ...imageInfo,
      text: e.target.value,
      binary: textToBinary(e.target.value),
      dl: canvasRef.current?.toDataURL('image/png') || '',
    });
  };

  return (
    <div className="App">
      <h2>secbo</h2>
      <ImageUploader
        updateCanvas={updateCanvas}
        imageInfo={imageInfo}
        setImageInfo={setImageInfo}
        readAlpha={readAlpha}
        textToBinary={textToBinary}
      />
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
      {
        imageInfo.text.length > 0
        && imageInfo?.image?.src
        && freePixels >= 0
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
          <button type="button" onClick={() => reset(null, '')}>clear</button>
        )
      }
      <canvas ref={canvasRef} />
    </div>
  );
};

export default App;
