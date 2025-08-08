import { use3D } from '../../context/3DContext';
import './TextureControlsPanel.css';

const TextureControlsPanel = () => {
  const {
    threeDzoom, setthreeDZoom,
    threeDoffsetX, setthreeDOffsetX,
    threeDoffsetY, setthreeDOffsetY
  } = use3D();

  return (
    <div className="kds-texture-controls-panel">
      <div className="kds-texture-control-group">
        <label className="kds-texture-control-label">Zoom (Repeat): {threeDzoom.toFixed(2)}</label>
        <input 
          type="range" 
          min="0.2" 
          max="3" 
          step="0.1" 
          value={threeDzoom} 
          onChange={(e) => setthreeDZoom(parseFloat(e.target.value))}
          className="kds-texture-control-slider"
        />
      </div>
      <div className="kds-texture-control-group">
        <label className="kds-texture-control-label">Offset X: {threeDoffsetX.toFixed(2)}</label>
        <input 
          type="range" 
          min="-1" 
          max="1" 
          step="0.01" 
          value={threeDoffsetX} 
          onChange={(e) => setthreeDOffsetX(parseFloat(e.target.value))}
          className="kds-texture-control-slider"
        />
      </div>
      <div className="kds-texture-control-group">
        <label className="kds-texture-control-label">Offset Y: {threeDoffsetY.toFixed(2)}</label>
        <input 
          type="range" 
          min="-1" 
          max="1" 
          step="0.01" 
          value={threeDoffsetY} 
          onChange={(e) => setthreeDOffsetY(parseFloat(e.target.value))}
          className="kds-texture-control-slider"
        />
      </div>
    </div>
  );
};

export default TextureControlsPanel;
