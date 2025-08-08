import { useState, useEffect } from 'react';
import * as THREE from 'three';
import { use3D } from '../../context/3DContext';
import './TextureUploader.css';

const TextureUploader = () => {
  const {
    setthreeDTexture,
    threeDtexture,
    threeDtext,
    threeDtextColor,
    threeDoutlineColor,
    threeDcolor,
    threeDtextureMode,
    setthreeDTextureMode,
    threeDlogoScale,
    setthreeDLogoScale,
    threeDlogoPosX,
    setthreeDLogoPosX,
    threeDlogoPosY,
    setthreeDLogoPosY,
    setCustomizationData,
    threeDselectedPart
  } = use3D();

  const [previewUrl, setPreviewUrl] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
  };

  const handleUploadDesign = () => {
    if (!selectedFile) return;
    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewUrl(reader.result);
      setIsUploading(false);
    };
    reader.readAsDataURL(selectedFile);
  };

  useEffect(() => {
    if (!previewUrl) return;

    const image = new window.Image();
    image.src = previewUrl;
    image.onload = () => {
      const size = 512;
      const canvas = document.createElement('canvas');
      canvas.width = canvas.height = size;
      const ctx = canvas.getContext('2d');

      // Fill base color
      ctx.fillStyle = threeDcolor || "#fff"; 
      ctx.fillRect(0, 0, size, size);

      // Apply image based on mode
      if (threeDtextureMode === 'full') {
        ctx.drawImage(image, 0, 0, size, size);
      } else if (threeDtextureMode === 'logo') {
        const logoSize = size * threeDlogoScale;
        const x = size * threeDlogoPosX - logoSize / 2;
        const y = size * threeDlogoPosY - logoSize / 2;
        ctx.drawImage(image, x, y, logoSize, logoSize);
      }

      const finalTexture = new THREE.CanvasTexture(canvas);
      finalTexture.needsUpdate = true;
      setthreeDTexture(finalTexture);

      setCustomizationData(prev => ({
        ...prev,
        parts: {
          ...prev.parts,
          [threeDselectedPart]: {
            ...prev.parts[threeDselectedPart],
            image: {
              mode: threeDtextureMode,
              url: previewUrl,
              position: { x: threeDlogoPosX, y: threeDlogoPosY },
              scale: threeDlogoScale
            }
          }
        }
      }));
    };
  // eslint-disable-next-line
  }, [
    previewUrl,
    threeDtextureMode,
    threeDlogoScale,
    threeDlogoPosX,
    threeDlogoPosY,
    threeDcolor,
    setthreeDTexture,
    setCustomizationData,
    threeDselectedPart
  ]);

  return (
    <div className="kds-texture-uploader">
      <select
        className="kds-texture-mode-select"
        value={threeDtextureMode}
        onChange={(e) => setthreeDTextureMode(e.target.value)}
      >
        <option value="full">Full Texture</option>
        <option value="logo">Logo Only</option>
      </select>

      <div className='kds-texture-upload-container'>
        <h3 className='kds-texture-upload-title'>Original vector artwork best, if you have?</h3>
        <label className="kds-texture-upload-area">
          <input
            type="file"
            accept="image/*"
            className="kds-texture-file-input"
            onChange={handleFileSelect}
          />
          <div className="kds-texture-upload-content">
            <div className="kds-texture-upload-btn">
              {selectedFile ? "Image Uploaded" : "Choose a file"}
            </div>
            <p className='kds-texture-upload-text'>
              We support JPG, PNG, EAPS<br />
              An max 5 MB
            </p>
          </div>
        </label>
        <button
          onClick={handleUploadDesign}
          disabled={!selectedFile || isUploading}
          className={`kds-texture-submit-btn ${selectedFile && !isUploading
            ? 'kds-texture-submit-btn-enabled'
            : 'kds-texture-submit-btn-disabled'
            }`}
        >
          {isUploading ? 'Uploading...' : 'Upload'}
        </button>
      </div>

      {previewUrl && (
        <div className="kds-texture-preview-container">
          <img
            src={previewUrl}
            alt="Preview"
            className="kds-texture-preview-image"
          />
          <button
            className="kds-texture-remove-btn"
            onClick={() => {
              setPreviewUrl(null);
              setSelectedFile(null);
              setthreeDTexture(null);
              setCustomizationData(prev => ({
                ...prev,
                parts: {
                  ...prev.parts,
                  [threeDselectedPart]: {
                    ...prev.parts[threeDselectedPart],
                    image: null
                  }
                }
              }));
            }}
          >
            Remove Image
          </button>
        </div>
      )}

      {threeDtextureMode === 'logo' && (
        <div className="kds-texture-logo-controls">
          <div className="kds-texture-control-group">
            <label className="kds-texture-logo-label">Logo Scale</label>
            <input
              type="range"
              min={0.1}
              max={1}
              step={0.05}
              value={threeDlogoScale}
              onChange={(e) => setthreeDLogoScale(parseFloat(e.target.value))}
              className="kds-texture-logo-slider"
            />
            <div className="kds-texture-logo-labels">
              <span className="kds-reset">Small</span><span className="kds-reset">Large</span>
            </div>
          </div>

          <div className="kds-texture-control-group">
            <label className="kds-texture-logo-label">Logo Position X</label>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={threeDlogoPosX}
              onChange={(e) => setthreeDLogoPosX(parseFloat(e.target.value))}
              className="kds-texture-logo-slider"
            />
          </div>

          <div className="kds-texture-control-group">
            <label className="kds-texture-logo-label">Logo Position Y</label>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={threeDlogoPosY}
              onChange={(e) => setthreeDLogoPosY(parseFloat(e.target.value))}
              className="kds-texture-logo-slider"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default TextureUploader;