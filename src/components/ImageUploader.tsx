import { FC, useState, DragEvent, ChangeEvent, useEffect } from 'react';

interface ImageData {
  text: string,
  binary: string,
  image: HTMLImageElement | null,
  name: string,
  dl: string,
}

interface ImageUploaderProps {
  canvas: HTMLCanvasElement | null
}

const ImageUploader: FC<ImageUploaderProps> = ({ canvas }) => {
  const [imageData, setImageData] = useState<ImageData>({ text: '', binary: '', image: null, name: '', dl: '' });
  const [pixels, setPixels] = useState(0);
  const [freePixels, setFreePixels] = useState(0);

  useEffect(() => {
    if (imageData?.image) {
      const tempPixels = imageData.image.width * imageData.image.height;
      const tempFreePixels = tempPixels - imageData.binary.length;

      setPixels(tempPixels);
      setFreePixels(tempFreePixels);
    }
  }, [imageData.text, imageData.binary]);

  let ctx: CanvasRenderingContext2D | null = null;
  if (canvas) {
    ctx = canvas.getContext('2d');
  }

  const textToBinary = (txt: string): string => `[secbo]${txt}[/secbo]`.split('').map(c => `${c.charCodeAt(0).toString(2)} `).join('');

  const binaryToText = (bin: string): string => bin.split(' ').map(b => String.fromCharCode(parseInt(b, 2))).join('');

  const reset = (image: HTMLImageElement | null, name: string): void => {
    setImageData({
      text: '',
      binary: '1011011 1110011 1100101 1100011 1100010 1101111 1011101  1011011 101111 1110011 1100101 1100011 1100010 1101111 1011101',
      image,
      name,
      dl: '',
    });
  };

  const updateCanvas = (image: HTMLImageElement): void => {
    // TODO: See if this "if" null check can be avoided.
    if (ctx) {
      ctx.canvas.width = image.width;
      ctx.canvas.height = image.height;
      ctx.drawImage(image, 0, 0);
    }
  };

  const readAlpha = (): string | null => {
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

  const uploadImage = (e: DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    const fr = new FileReader();
    const img = new Image();

    // Only accept png images and only use the first file if several are dragged.
    const file = e.dataTransfer.files[0];

    if (file.type === 'image/png') {
      fr.readAsDataURL(file);
    } else {
      // TODO: Set up a mechanism for reporting errors to the user
      console.log('Invalid format. Use a PNG image.');
    }

    fr.onload = event => {
      try {
        img.onload = () => {
          updateCanvas(img);
          const text = readAlpha();
          setImageData({
            ...imageData,
            image: img,
            name: file.name,
            text: text || '',
            binary: textToBinary(text || ''),
          });
        };
        // TODO: This seems like a bad way of doing things. Sesearch further.
        img.src = event?.target ? event.target.result as string : '';
      } catch (err) {
        // TODO: Set up a mechanism for reporting errors to the user
        console.log('File failed to load.');
      }
    };
  };

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>): void => {
    writeAlpha(textToBinary(e.target.value));
    setImageData({
      ...imageData,
      text: e.target.value,
      binary: textToBinary(e.target.value),
      dl: canvas?.toDataURL('image/png') || '',
    });
  };

  return (
    <>
      <div
        className="ImageUploader"
        onDrop={uploadImage}
        onDragEnter={e => e.preventDefault()}
        onDragOver={e => e.preventDefault()}
      >
        {
        imageData.image
          ? (
            <img
              className="ImagePreview"
              src={imageData.image.src}
              alt="thumbnail"
            />
          ) : (
            <span>drag an image file here</span>
          )
        }
      </div>
      {
        // These should probably be their own components and should be used in App.tsx, but what's
        // a good way to pass all the data to them? A callback function on this component, or some
        // kind of Context or state in App?
      }
      <div className="Info">
        {imageData.image && `${pixels} total pixels, ` }
        <span style={{ color: freePixels > 0 ? 'black' : 'red' }}>
          { imageData.image && `${freePixels} still available` }
        </span>
      </div>
      <textarea
        rows={15}
        cols={50}
        value={imageData.text}
        onChange={e => handleChange(e)}
      />
      <br />
      { /* canvas was here in the JS version */ }
      <br />
      {
        imageData.text.length > 0
        && imageData?.image?.src
        && freePixels >= 0
        && (
          <a
            href={imageData.dl}
            download={imageData.name}
          >
            download
          </a>
        )
      }
      {
        imageData?.image?.src
        && (
          <button type="button" onClick={() => reset(null, '')}>clear</button>
        )
      }
    </>
  );
};

export default ImageUploader;
