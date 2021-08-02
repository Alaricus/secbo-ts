export const throwNullErr = (): never => { throw new Error('Context was null'); };

export const textToBinary = (txt: string): string => `[secbo]${txt}[/secbo]`.split('').map(c => `${c.charCodeAt(0).toString(2)} `).join('');

export const binaryToText = (bin: string): string => bin.split(' ').map(b => String.fromCharCode(parseInt(b, 2))).join('');

export const readAlpha = (context: CanvasRenderingContext2D): string | null => {
  const ctxImageData = context.getImageData(0, 0, context.canvas.width, context.canvas.height);
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

  return null;
};

export const writeAlpha = (context: CanvasRenderingContext2D, binary: string): void => {
  const ctxImageData = context.getImageData(0, 0, context.canvas.width, context.canvas.height);
  if (ctxImageData.data.length / 4 >= binary.length) {
    // This sets everything to 255, so no need to handle zeroes
    ctxImageData.data.forEach((_, index) => {
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

    context.putImageData(ctxImageData, 0, 0);
  } else {
    // TODO: Set up a mechanism for reporting errors to the user
    alert('The image was too small to contain all this data.');
  }
};
