import { FC } from 'react';

export interface ImageInfo {
  text: string,
  binary: string,
  image: HTMLImageElement | null,
  name: string,
  dl: string,
}

interface ImageDetailsProps {
  imageInfo: ImageInfo,
  pixels: number,
  freePixels: number,
}

const ImageDetails: FC<ImageDetailsProps> = props => {
  const { imageInfo, pixels, freePixels } = props;

  return (
    <div className="Details">
      {imageInfo.image && `${pixels} total pixels, `}
      <span style={{ color: freePixels > 0 ? 'black' : 'red' }}>
        {imageInfo.image && `${freePixels} still available`}
      </span>
    </div>
  );
};

export default ImageDetails;
