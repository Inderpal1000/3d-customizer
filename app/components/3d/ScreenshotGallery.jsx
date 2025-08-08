import { useState } from 'react';
import './ScreenshotGallery.css';

const ScreenshotGallery = ({ screenshots, onClose, onDownloadAll }) => {
  if (!screenshots || screenshots.length === 0) return null;

  const [selected, setSelected] = useState(screenshots[0]);

  const downloadImage = (dataUrl, filename) => {
    const link = document.createElement('a');
    link.download = filename;
    link.href = dataUrl;
    link.click();
  };

  const downloadAll = () => {
    screenshots.forEach((screenshot, index) => {
      setTimeout(() => {
        downloadImage(screenshot.image, `${screenshot.angle}-view.png`);
      }, index * 100);
    });
    if (onDownloadAll) onDownloadAll();
  };

  return (
    <div className="kds-gallery-overlay">
      <div className="kds-gallery-modal">
        <div className="kds-gallery-header">
          <h2 className="kds-gallery-title">Model Screenshots</h2>
          <button
            onClick={onClose}
            className="kds-gallery-close-btn"
          >
            ×
          </button>
        </div>

        {/* Large Preview Image */}
        <div className="kds-gallery-preview-container">
          <div className="kds-gallery-preview-wrapper">
            <img
              src={selected?.image}
              alt={`${selected?.angle} view`}
              className="kds-gallery-preview-image"
            />
            <div className="kds-gallery-preview-label">
              {selected?.angle} view
            </div>
          </div>
        </div>

        {/* Thumbnails */}
        <div className="kds-gallery-thumbnails">
          {screenshots.map((screenshot, index) => (
            <div
              key={index}
              onClick={() => setSelected(screenshot)}
              className={`kds-gallery-thumbnail ${
                selected.view === screenshot.view ? 'kds-gallery-thumbnail-active' : ''
              }`}
            >
              <img
                src={screenshot?.image}
                alt={`${screenshot.angle} view`}
                className="kds-gallery-thumbnail-image"
              />
              <div className="kds-gallery-thumbnail-label">
                {screenshot.angle}
              </div>
            </div>
          ))}
        </div>

        {/* Action buttons */}
        <div className="kds-gallery-actions">
          <button
            onClick={downloadAll}
            className="kds-gallery-btn kds-gallery-btn-primary"
          >
            Download All
          </button>
          <button
            onClick={onClose}
            className="kds-gallery-btn kds-gallery-btn-secondary"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScreenshotGallery;
