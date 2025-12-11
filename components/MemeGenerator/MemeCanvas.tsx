'use client';

import { useRef, useEffect, useState } from 'react';
import { TextObject, drawText, isPointInText } from '@/lib/utils';
import Image from 'next/image';

interface MemeCanvasProps {
  currentImage: HTMLImageElement | null;
  texts: TextObject[];
  selectedTextIndex: number;
  onTextSelect: (index: number) => void;
  onTextDrag: (index: number, x: number, y: number) => void;
}

export default function MemeCanvas({
  currentImage,
  texts,
  selectedTextIndex,
  onTextSelect,
  onTextDrag,
}: MemeCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!currentImage || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!container) return;

    const maxWidth = container.clientWidth - 40;
    const maxHeight = container.clientHeight - 40;

    let width = currentImage.width;
    let height = currentImage.height;

    if (width > maxWidth || height > maxHeight) {
      const ratio = Math.min(maxWidth / width, maxHeight / height);
      width = width * ratio;
      height = height * ratio;
    }

    canvas.width = width;
    canvas.height = height;
    canvas.style.display = 'block';

    renderMeme();
  }, [currentImage, texts]);

  const renderMeme = () => {
    if (!currentImage || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(currentImage, 0, 0, canvas.width, canvas.height);

    texts.forEach((textObj) => {
      if (textObj.text.trim()) {
        drawText(ctx, textObj, canvas.width, canvas.height);
      }
    });
  };

  const getCanvasCoordinates = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const findTextAtPoint = (x: number, y: number): number => {
    if (!canvasRef.current) return -1;

    for (let i = texts.length - 1; i >= 0; i--) {
      if (
        isPointInText(
          x,
          y,
          texts[i],
          canvasRef.current.width,
          canvasRef.current.height
        )
      ) {
        return i;
      }
    }
    return -1;
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!currentImage || !canvasRef.current) return;

    const coords = getCanvasCoordinates(e);
    const textIndex = findTextAtPoint(coords.x, coords.y);

    if (textIndex !== -1) {
      const textObj = texts[textIndex];
      const fontSize = textObj.size;
      const padding = 30;

      let textX: number, textY: number;

      if (textObj.x !== null && textObj.y !== null) {
        textX = textObj.x;
        textY = textObj.y;
      } else {
        textX = canvasRef.current.width / 2;
        const lines = textObj.text.split('\n');
        switch (textObj.position) {
          case 'top':
            textY = padding + fontSize / 2;
            break;
          case 'bottom':
            textY =
              canvasRef.current.height -
              padding -
              (lines.length - 1) * fontSize * 1.5 -
              fontSize / 2;
            break;
          case 'center':
          default:
            textY = canvasRef.current.height / 2;
            break;
        }
      }

      setDragOffset({
        x: coords.x - textX,
        y: coords.y - textY,
      });
      setIsDragging(true);
      onTextSelect(textIndex);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!currentImage || !isDragging || selectedTextIndex === -1) {
      if (canvasRef.current) {
        const coords = getCanvasCoordinates(e);
        const textIndex = findTextAtPoint(coords.x, coords.y);
        canvasRef.current.style.cursor = textIndex !== -1 ? 'move' : 'default';
      }
      return;
    }

    const coords = getCanvasCoordinates(e);
    onTextDrag(selectedTextIndex, coords.x - dragOffset.x, coords.y - dragOffset.y);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div className="preview-container" ref={containerRef}>
      <div className="canvas-wrapper">
        <canvas
          ref={canvasRef}
          className="meme-canvas"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        />
        {!currentImage && (
          <div className="preview-placeholder">
            <div className="placeholder-icon">🖼️</div>
            <p className="placeholder-text">Sélectionnez un template</p>
          </div>
        )}
      </div>
    </div>
  );
}


