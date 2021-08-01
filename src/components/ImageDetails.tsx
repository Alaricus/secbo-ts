import { FC } from 'react';
import { ImageInfo } from './types';

interface ImageDetailsProps {
  imageInfo: ImageInfo,
  pixels: number,
  freePixels: number,
}

const ImageDetails: FC<ImageDetailsProps> = props => {
  const { imageInfo, pixels, freePixels } = props;

  return (
    <div className="Details">
      {imageInfo.image && `${pixels} total pixels, ` }
      <span style={{ color: freePixels > 0 ? 'black' : 'red' }}>
        { imageInfo.image && `${freePixels} still available` }
      </span>
    </div>
  );
};

export default ImageDetails;
