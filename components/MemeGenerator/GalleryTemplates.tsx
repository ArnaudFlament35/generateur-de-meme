'use client';

import { useState } from 'react';
import Image from 'next/image';

interface GalleryTemplatesProps {
  onImageSelect: (src: string) => void;
}

const TEMPLATE_IMAGES = [
  '/templates/all_well.jpg',
  '/templates/clever.jpg',
  '/templates/made_it.jpg',
  '/templates/disaster_girl.webp',
];

export default function GalleryTemplates({ onImageSelect }: GalleryTemplatesProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onImageSelect(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTemplateClick = (src: string, index: number) => {
    setSelectedIndex(index);
    onImageSelect(src);
  };

  return (
    <section className="gallery-section">
      <div className="section-header">
        <h2 className="section-title">Templates</h2>
        <label htmlFor="image-upload" className="upload-button">
          <span>Upload</span>
          <input
            type="file"
            id="image-upload"
            accept="image/*"
            hidden
            onChange={handleImageUpload}
          />
        </label>
      </div>
      <div className="gallery-grid">
        {TEMPLATE_IMAGES.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#666666', padding: '20px', fontSize: '0.875rem' }}>
            Aucun template disponible. Utilisez le bouton Upload pour ajouter votre propre image.
          </p>
        ) : (
          TEMPLATE_IMAGES.map((src, index) => (
            <div
              key={index}
              className={`gallery-item ${selectedIndex === index ? 'selected' : ''}`}
              onClick={() => handleTemplateClick(src, index)}
            >
              <img src={src} alt={`Template ${index + 1}`} loading="lazy" />
            </div>
          ))
        )}
      </div>
    </section>
  );
}


