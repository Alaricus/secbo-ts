import { Dispatch, FC, DragEvent, SetStateAction } from 'react';
import { ImageInfo } from './ImageDetails';

export type UpdateCanvas = (image: HTMLImageElement) => void;

export type ReadAlpha = () => string | null;

export type TextConversion = (input: string) => string;

interface ImageUploaderProps {
  updateCanvas: UpdateCanvas,
  imageInfo: ImageInfo,
  setImageInfo: Dispatch<SetStateAction<ImageInfo>>,
  readAlpha: ReadAlpha,
  textToBinary: TextConversion,
}

const ImageUploader: FC<ImageUploaderProps> = ({ updateCanvas, imageInfo, setImageInfo, readAlpha, textToBinary }) => {
  const uploadImage = (e: DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    const fr = new FileReader();
    const img = new Image();

    // Only accept png images and only use the first file if several are dragged.
    const file = e.dataTransfer.files.item(0);

    if (!file) {
      console.error('Something went wrong with the file upload');
      return;
    }

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
          setImageInfo({
            ...imageInfo,
            image: img,
            name: file.name,
            text: readAlpha() ?? '',
            binary: textToBinary(readAlpha() ?? ''),
          });
        };

        const { result } = event.target ?? {};
        if (typeof result === 'string') {
          img.src = result;
        }
      } catch (err) {
        // TODO: Set up a mechanism for reporting errors to the user
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
        imageInfo.image
          ? (
            <img
              className="ImagePreview"
              src={imageInfo.image.src}
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
