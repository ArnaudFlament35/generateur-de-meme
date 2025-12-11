// Utilitaires pour le générateur de memes

export interface TextObject {
  text: string;
  size: number;
  color: string;
  position: 'top' | 'center' | 'bottom';
  x: number | null;
  y: number | null;
  rotation: number;
}

export function createTextObject(): TextObject {
  return {
    text: '',
    size: 40,
    color: '#FFFFFF',
    position: 'center',
    x: null,
    y: null,
    rotation: 0,
  };
}

export function drawText(
  ctx: CanvasRenderingContext2D,
  textObj: TextObject,
  canvasWidth: number,
  canvasHeight: number
) {
  const text = textObj.text;
  const fontSize = textObj.size;
  const lines = text.split('\n');

  ctx.font = `bold ${fontSize}px Arial, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  let x: number, y: number;
  const padding = 30;

  if (textObj.x !== null && textObj.y !== null) {
    x = textObj.x;
    y = textObj.y;
  } else {
    x = canvasWidth / 2;
    switch (textObj.position) {
      case 'top':
        y = padding + fontSize / 2;
        break;
      case 'bottom':
        y =
          canvasHeight -
          padding -
          (lines.length - 1) * fontSize * 1.5 -
          fontSize / 2;
        break;
      case 'center':
      default:
        y = canvasHeight / 2;
        break;
    }
  }

  const lineHeight = fontSize * 1.5;

  ctx.save();

  if (textObj.rotation !== 0) {
    ctx.translate(x, y);
    ctx.rotate((textObj.rotation * Math.PI) / 180);
    ctx.translate(-x, -y);
  }

  lines.forEach((line, index) => {
    if (line.trim()) {
      const lineY = y + (index - (lines.length - 1) / 2) * lineHeight;

      ctx.strokeStyle = '#000000';
      ctx.lineWidth = Math.max(6, fontSize / 5);
      ctx.lineJoin = 'round';
      ctx.miterLimit = 2;
      ctx.strokeText(line, x, lineY);

      ctx.fillStyle = textObj.color;
      ctx.fillText(line, x, lineY);
    }
  });

  ctx.restore();
}

export function isPointInText(
  x: number,
  y: number,
  textObj: TextObject,
  canvasWidth: number,
  canvasHeight: number
): boolean {
  if (!textObj.text.trim()) return false;

  const fontSize = textObj.size;
  const lines = textObj.text.split('\n');
  const lineHeight = fontSize * 1.5;
  const totalHeight = lines.length * lineHeight;

  let textX: number, textY: number;
  const padding = 30;

  if (textObj.x !== null && textObj.y !== null) {
    textX = textObj.x;
    textY = textObj.y;
  } else {
    textX = canvasWidth / 2;
    switch (textObj.position) {
      case 'top':
        textY = padding + fontSize / 2;
        break;
      case 'bottom':
        textY =
          canvasHeight -
          padding -
          (lines.length - 1) * fontSize * 1.5 -
          fontSize / 2;
        break;
      case 'center':
      default:
        textY = canvasHeight / 2;
        break;
    }
  }

  const tempCanvas = document.createElement('canvas');
  const tempCtx = tempCanvas.getContext('2d')!;
  tempCtx.font = `bold ${fontSize}px Arial, sans-serif`;
  const maxWidth = Math.max(
    ...lines.map((line) => tempCtx.measureText(line).width)
  );

  const halfWidth = maxWidth / 2;
  const halfHeight = totalHeight / 2;

  if (textObj.rotation !== 0) {
    const angle = (-textObj.rotation * Math.PI) / 180;
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    const dx = x - textX;
    const dy = y - textY;
    const rotatedX = dx * cos - dy * sin;
    const rotatedY = dx * sin + dy * cos;
    return (
      rotatedX >= -halfWidth &&
      rotatedX <= halfWidth &&
      rotatedY >= -halfHeight &&
      rotatedY <= halfHeight
    );
  }

  return (
    x >= textX - halfWidth &&
    x <= textX + halfWidth &&
    y >= textY - halfHeight &&
    y <= textY + halfHeight
  );
}

export function canvasToBase64(canvas: HTMLCanvasElement): Promise<string> {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      if (blob) {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve(reader.result as string);
        };
        reader.readAsDataURL(blob);
      }
    }, 'image/png');
  });
}


