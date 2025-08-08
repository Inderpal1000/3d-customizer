import { use3D } from '../../context/3DContext';
import './TextControlsPanel.css';

const TextControlsPanel = () => {
  const {
    threeDtextScale, setthreeDTextScale,
    threeDtextPosX, setthreeDTextPosX,
    threeDtextPosY, setthreeDTextPosY
  } = use3D();

  return (
    <div className="kds-text-controls-panel">
      <div className="kds-text-control-group">
        <label className="kds-text-control-label">Text Scale: {threeDtextScale.toFixed(2)}</label>
        <input 
          type="range" 
          min="0.2" 
          max="2" 
          step="0.05" 
          value={threeDtextScale} 
          onChange={(e) => setthreeDTextScale(parseFloat(e.target.value))}
          className="kds-text-control-slider"
        />
      </div>
      <div className="kds-text-control-group">
        <label className="kds-text-control-label">Text Position X: {threeDtextPosX.toFixed(2)}</label>
        <input 
          type="range" 
          min="0" 
          max="1" 
          step="0.01" 
          value={threeDtextPosX} 
          onChange={(e) => setthreeDTextPosX(parseFloat(e.target.value))}
          className="kds-text-control-slider"
        />
      </div>
      <div className="kds-text-control-group">
        <label className="kds-text-control-label">Text Position Y: {threeDtextPosY.toFixed(2)}</label>
        <input 
          type="range" 
          min="0" 
          max="1" 
          step="0.01" 
          value={threeDtextPosY} 
          onChange={(e) => setthreeDTextPosY(parseFloat(e.target.value))}
          className="kds-text-control-slider"
        />
      </div>
    </div>
  );
};

export default TextControlsPanel;
