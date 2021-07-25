import { FC, useState, DragEvent } from 'react';

interface ImageData {
  text: string,
  binary: string,
  image: HTMLImageElement | null,
  name: string,
}

interface ImageUploaderProps {
  canvas: HTMLCanvasElement | null
}

const ImageUploader: FC<ImageUploaderProps> = ({ canvas }) => {
  const [imageData, setImageData] = useState<ImageData>({ text: '', binary: '', image: null, name: '' });

  const refresh = (image: HTMLImageElement, name: string) => {
    setImageData({
      text: '',
      binary: '1011011 1110011 1100101 1100011 1100010 1101111 1011101  1011011 101111 1110011 1100101 1100011 1100010 1101111 1011101',
      image,
      name,
    });
  };

  const updateCanvas = () => {
    // TODO: See if this "if" null check can be avoided.
    if (imageData.image && canvas) {
      const ctx = canvas.getContext('2d');
      // TODO: See if this "if" null check can be avoided.
      if (ctx) {
        ctx.canvas.width = imageData.image.width;
        ctx.canvas.height = imageData.image.height;
        ctx.drawImage(imageData.image, 0, 0);
      }
    }
  };

  const readAlpha = () => { console.log('readAlpha()'); };
  const getDownload = () => { console.log('getDownload()'); };

  const uploadImage = (e: DragEvent<HTMLDivElement>) => {
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
          refresh(img, file.name);
          updateCanvas();
          readAlpha();
          getDownload();
        };
        // TODO: This seems like a bad way of doing things. Sesearch further.
        img.src = event?.target ? event.target.result as string : '';
      } catch (err) {
        console.log('File failed to load.');
      }
    };
  };

  return (
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
  );
};

export default ImageUploader;
