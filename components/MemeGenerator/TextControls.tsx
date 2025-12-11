'use client';

import { TextObject, createTextObject } from '@/lib/utils';

interface TextControlsProps {
  texts: TextObject[];
  selectedTextIndex: number;
  onTextsChange: (texts: TextObject[]) => void;
  onSelectedTextChange: (index: number) => void;
}

export default function TextControls({
  texts,
  selectedTextIndex,
  onTextsChange,
  onSelectedTextChange,
}: TextControlsProps) {
  const selectedText =
    selectedTextIndex >= 0 && selectedTextIndex < texts.length
      ? texts[selectedTextIndex]
      : null;

  const handleTextChange = (field: keyof TextObject, value: any) => {
    if (selectedTextIndex === -1) return;

    const newTexts = [...texts];
    newTexts[selectedTextIndex] = {
      ...newTexts[selectedTextIndex],
      [field]: value,
    };
    onTextsChange(newTexts);
  };

  const addText = () => {
    const newTexts = [...texts, createTextObject()];
    onTextsChange(newTexts);
    onSelectedTextChange(newTexts.length - 1);
  };

  const deleteSelectedText = () => {
    if (selectedTextIndex === -1 || texts.length === 0) return;

    const newTexts = texts.filter((_, index) => index !== selectedTextIndex);
    onTextsChange(newTexts);
    onSelectedTextChange(
      newTexts.length === 0 ? -1 : Math.min(selectedTextIndex, newTexts.length - 1)
    );
  };

  const selectText = (index: number) => {
    onSelectedTextChange(index);
  };

  const handlePositionChange = (position: 'top' | 'center' | 'bottom') => {
    if (selectedTextIndex === -1) return;

    const newTexts = [...texts];
    newTexts[selectedTextIndex] = {
      ...newTexts[selectedTextIndex],
      position,
      x: null,
      y: null,
    };
    onTextsChange(newTexts);
  };

  return (
    <div className="controls-panel">
      <section className="control-card">
        <div className="card-header">
          <h2 className="card-title">Textes</h2>
          <button className="icon-button" onClick={addText} title="Ajouter un texte">
            <span>+</span>
          </button>
        </div>
        <div className="card-body">
          <div className="form-group">
            <label className="form-label">Texte sélectionné</label>
            <div className="texts-list">
              {texts.length === 0 ? (
                <div className="text-item" style={{ justifyContent: 'center', opacity: 0.5 }}>
                  Aucun texte
                </div>
              ) : (
                texts.map((textObj, index) => (
                  <div
                    key={index}
                    className={`text-item ${index === selectedTextIndex ? 'active' : ''}`}
                    onClick={() => selectText(index)}
                  >
                    <span className="text-item-number">{index + 1}</span>
                    <span className="text-item-content">
                      {textObj.text.trim() || `Texte ${index + 1}`}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {selectedText && (
            <>
              <div className="form-group">
                <textarea
                  className="form-textarea"
                  placeholder="Entrez votre texte..."
                  rows={2}
                  value={selectedText.text}
                  onChange={(e) => handleTextChange('text', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  Taille: <span className="value-display">{selectedText.size}</span>px
                </label>
                <div className="slider-wrapper">
                  <input
                    type="range"
                    className="form-slider"
                    min="20"
                    max="100"
                    value={selectedText.size}
                    onChange={(e) => handleTextChange('size', parseInt(e.target.value))}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Couleur</label>
                <div className="color-input-wrapper">
                  <input
                    type="color"
                    className="color-input"
                    value={selectedText.color}
                    onChange={(e) => handleTextChange('color', e.target.value.toUpperCase())}
                  />
                  <span className="color-hex">{selectedText.color}</span>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Position</label>
                <div className="button-group">
                  <button
                    className={`group-button ${selectedText.position === 'top' ? 'active' : ''}`}
                    onClick={() => handlePositionChange('top')}
                  >
                    <span>Haut</span>
                  </button>
                  <button
                    className={`group-button ${selectedText.position === 'center' ? 'active' : ''}`}
                    onClick={() => handlePositionChange('center')}
                  >
                    <span>Centre</span>
                  </button>
                  <button
                    className={`group-button ${selectedText.position === 'bottom' ? 'active' : ''}`}
                    onClick={() => handlePositionChange('bottom')}
                  >
                    <span>Bas</span>
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">
                  Rotation: <span className="value-display">{selectedText.rotation}</span>°
                </label>
                <div className="slider-wrapper">
                  <input
                    type="range"
                    className="form-slider"
                    min="-180"
                    max="180"
                    value={selectedText.rotation}
                    onChange={(e) => handleTextChange('rotation', parseInt(e.target.value))}
                  />
                </div>
              </div>

              <div className="form-group">
                <button
                  className="delete-button"
                  onClick={deleteSelectedText}
                  disabled={texts.length === 0}
                >
                  <span>Supprimer ce texte</span>
                </button>
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}


