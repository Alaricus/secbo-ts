import { Dispatch, FC, DragEvent, SetStateAction } from 'react';
import { ImageInfo } from './ImageDetails';

export type UpdateCanvas = (image: HTMLImageElement) => void;

interface ImageUploaderProps {
  updateCanvas: UpdateCanvas,
  imageInfo: ImageInfo,
  setImageInfo: Dispatch<SetStateAction<ImageInfo>>,
  readAlpha: () => string | null,
  textToBinary: (str: string) => string,
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
      img.onload = () => {
        updateCanvas(img);
        const alpha = readAlpha() ?? '';
        setImageInfo({
          ...imageInfo,
          image: img,
          name: file.name,
          text: alpha,
          binary: textToBinary(alpha),
        });
      };

      const { result } = event.target ?? {};
      if (typeof result === 'string') {
        img.src = result;
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
