import { use3D } from '../../context/3DContext';
import './ControlsPanel.css';

const ControlsPanel = ({ onScreenshot }) => {
  const {
    threeDcolor, setthreeDColor,
    threeDselectedPart, setthreeDSelectedPart,
    threeDtext, setthreeDText,
    threeDtextColor, setthreeDTextColor,
    threeDoutlineColor, setthreeDOutlineColor
  } = use3D();

  const parts = ['Front', 'Back', 'LeftSleeve', 'RightSleeve', 'Slides'];

  return (
    <div className="kds-controls-panel">
      <label className="kds-label">Select Part:</label>
      <div className="kds-parts-grid">
        {parts.map((part) => (
          <button
            key={part}
            onClick={() => setthreeDSelectedPart(part)}
            className={`kds-part-btn ${threeDselectedPart === part ? 'kds-part-btn-active' : ''}`}
          >
            {part}
          </button>
        ))}
      </div>

      <div>
        <label className="kds-label-regular">Pick Color:</label>
        <input
          type="color"
          value={threeDcolor}
          onChange={(e) => setthreeDColor(e.target.value)}
          className="kds-color-input"
        />
      </div>

      <hr className="kds-divider" />
      <label className="kds-label">Add Text:</label>
      <input
        type="text"
        placeholder="Enter text"
        value={threeDtext}
        onChange={(e) => setthreeDText(e.target.value)}
        className="kds-text-input"
      />

      <label className="kds-label-regular">Text Color:</label>
      <input
        type="color"
        value={threeDtextColor}
        onChange={(e) => setthreeDTextColor(e.target.value)}
        className="kds-color-input"
      />

      <label className="kds-label-regular">Outline Color:</label>
      <input
        type="color"
        value={threeDoutlineColor}
        onChange={(e) => setthreeDOutlineColor(e.target.value)}
        className="kds-color-input"
      />

      <button
        className="kds-save-btn"
        onClick={onScreenshot}
      >
        Save All Views
      </button>
    </div>
  );
};

export default ControlsPanel;