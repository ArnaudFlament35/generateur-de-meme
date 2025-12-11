'use client';

import { useState } from 'react';
import { TextObject, createTextObject, canvasToBase64 } from '@/lib/utils';
import MemeCanvas from './MemeCanvas';
import TextControls from './TextControls';
import GalleryTemplates from './GalleryTemplates';

interface MemeGeneratorProps {
  onPublish?: (imageBase64: string) => void;
}

export default function MemeGenerator({ onPublish }: MemeGeneratorProps) {
  const [currentImage, setCurrentImage] = useState<HTMLImageElement | null>(null);
  const [texts, setTexts] = useState<TextObject[]>([]);
  const [selectedTextIndex, setSelectedTextIndex] = useState(-1);

  const handleImageSelect = (src: string) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      setCurrentImage(img);
      if (texts.length > 0) {
        setSelectedTextIndex(0);
      } else {
        setSelectedTextIndex(-1);
      }
    };
    img.onerror = () => {
      alert("Erreur lors du chargement de l'image");
    };
    img.src = src;
  };

  const handleTextDrag = (index: number, x: number, y: number) => {
    const newTexts = [...texts];
    newTexts[index] = {
      ...newTexts[index],
      x,
      y,
    };
    setTexts(newTexts);
  };

  const downloadMeme = async () => {
    if (!currentImage) return;

    const canvas = document.createElement('canvas');
    canvas.width = currentImage.width;
    canvas.height = currentImage.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(currentImage, 0, 0);

    const scaleFactor = currentImage.width / (document.querySelector('.meme-canvas') as HTMLCanvasElement)?.width || 1;

    texts.forEach((textObj) => {
      if (textObj.text.trim()) {
        const originalFontSize = textObj.size * scaleFactor;
        const text = textObj.text;
        const fontSize = originalFontSize;
        const lines = text.split('\n');

        ctx.font = `bold ${fontSize}px Arial, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        let x: number, y: number;
        const padding = 30 * scaleFactor;

        if (textObj.x !== null && textObj.y !== null) {
          x = textObj.x * scaleFactor;
          y = textObj.y * scaleFactor;
        } else {
          x = canvas.width / 2;
          switch (textObj.position) {
            case 'top':
              y = padding + fontSize / 2;
              break;
            case 'bottom':
              y =
                canvas.height -
                padding -
                (lines.length - 1) * fontSize * 1.5 -
                fontSize / 2;
              break;
            case 'center':
            default:
              y = canvas.height / 2;
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
            ctx.lineWidth = Math.max(6 * scaleFactor, fontSize / 5);
            ctx.lineJoin = 'round';
            ctx.miterLimit = 2;
            ctx.strokeText(line, x, lineY);

            ctx.fillStyle = textObj.color;
            ctx.fillText(line, x, lineY);
          }
        });

        ctx.restore();
      }
    });

    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `meme-${Date.now()}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    }, 'image/png');
  };

  const handlePublish = async () => {
    if (!currentImage || !onPublish) return;

    const canvas = document.querySelector('.meme-canvas') as HTMLCanvasElement;
    if (!canvas) return;

    const downloadCanvas = document.createElement('canvas');
    downloadCanvas.width = currentImage.width;
    downloadCanvas.height = currentImage.height;
    const ctx = downloadCanvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(currentImage, 0, 0);

    const scaleFactor = currentImage.width / canvas.width;

    texts.forEach((textObj) => {
      if (textObj.text.trim()) {
        const originalFontSize = textObj.size * scaleFactor;
        const text = textObj.text;
        const fontSize = originalFontSize;
        const lines = text.split('\n');

        ctx.font = `bold ${fontSize}px Arial, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        let x: number, y: number;
        const padding = 30 * scaleFactor;

        if (textObj.x !== null && textObj.y !== null) {
          x = textObj.x * scaleFactor;
          y = textObj.y * scaleFactor;
        } else {
          x = downloadCanvas.width / 2;
          switch (textObj.position) {
            case 'top':
              y = padding + fontSize / 2;
              break;
            case 'bottom':
              y =
                downloadCanvas.height -
                padding -
                (lines.length - 1) * fontSize * 1.5 -
                fontSize / 2;
              break;
            case 'center':
            default:
              y = downloadCanvas.height / 2;
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
            ctx.lineWidth = Math.max(6 * scaleFactor, fontSize / 5);
            ctx.lineJoin = 'round';
            ctx.miterLimit = 2;
            ctx.strokeText(line, x, lineY);

            ctx.fillStyle = textObj.color;
            ctx.fillText(line, x, lineY);
          }
        });

        ctx.restore();
      }
    });

    const base64 = await canvasToBase64(downloadCanvas);
    onPublish(base64);
  };

  return (
    <div className="app-wrapper">
      <main className="app-main">
        <div className="main-grid">
          <GalleryTemplates onImageSelect={handleImageSelect} />
          <TextControls
            texts={texts}
            selectedTextIndex={selectedTextIndex}
            onTextsChange={setTexts}
            onSelectedTextChange={setSelectedTextIndex}
          />
          <section className="preview-panel">
            <MemeCanvas
              currentImage={currentImage}
              texts={texts}
              selectedTextIndex={selectedTextIndex}
              onTextSelect={setSelectedTextIndex}
              onTextDrag={handleTextDrag}
            />
          </section>
        </div>
      </main>
      <div className="action-section">
        <button
          className="action-button"
          onClick={downloadMeme}
          disabled={!currentImage}
        >
          <span>Télécharger</span>
        </button>
        {onPublish && (
          <button
            className="action-button"
            onClick={handlePublish}
            disabled={!currentImage}
            style={{ marginTop: '10px' }}
          >
            <span>Publier</span>
          </button>
        )}
      </div>
    </div>
  );
}


