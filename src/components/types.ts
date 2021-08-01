export interface ImageInfo {
  text: string,
  binary: string,
  image: HTMLImageElement | null,
  name: string,
  dl: string,
}

export type UpdateCanvas = (image: HTMLImageElement) => void;

export type ReadAlpha = () => string | null;

export type TextConversion = (input: string) => string;
