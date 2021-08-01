export interface ImageInfo {
  text: string,
  binary: string,
  image: HTMLImageElement | null,
  name: string,
  dl: string,
}

// eslint-disable-next-line no-unused-vars
export type UpdateCanvas = (image: HTMLImageElement) => void;

export type ReadAlpha = () => string | null;

// eslint-disable-next-line no-unused-vars
export type TextConversion = (input: string) => string;
