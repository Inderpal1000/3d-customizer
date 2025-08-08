import React, { useState } from 'react'
import { use2D } from '../../context/2DContext';
import { use3D } from '@/app/context/3DContext';
import './SelectColorsTab.css';

const SelectColorsTab = () => {
  const {
    selectedColor, setSelectedColor,
    selectedTopColor, setSelectedTopColor,
    selectedBottomColor, setSelectedBottomColor,
    showSidebar, setShowSidebar,
    showAddModal, setShowAddModal,
    showEditModal, setShowEditModal,
    setShowBgColorsModal
  } = use2D();

  const {
    threeDcolor, setthreeDColor,
    threeDselectedPart, setthreeDSelectedPart, selectedProduct
  } = use3D();

  // Get available parts from product data
  const parts = selectedProduct?.parts || [
    'Front',
    'Back',
    'LeftSleeve',
    'RightSleeve',
  ];

  const [activeTab, setActiveTab] = useState('background'); // 'background', 'topColor', 'bottomColor'

  // Fallback colors if product doesn't have color arrays
  const defaultColorOptions = [
    { color: "#000000", name: "Black" },
    { color: "#434343", name: "Dark Gray" },
    { color: "#666666", name: "Gray" },
    { color: "#999999", name: "Medium Gray" },
    { color: "#b7b7b7", name: "Silver Gray" },
    { color: "#cccccc", name: "Light Gray" },
    { color: "#e6e6e6", name: "Lighter Gray" },
    { color: "#f3f3f3", name: "Off White" },
    { color: "#dbebe6", name: "Mint Gray" },
    { color: "#b3e5fc", name: "Sky Blue" },
    { color: "#4fc3f7", name: "Light Blue" },
    { color: "#0288d1", name: "Medium Blue" },
    { color: "#512da8", name: "Indigo" },
    { color: "#002f6c", name: "Navy Blue" },
    { color: "#4a148c", name: "Dark Purple" },
    { color: "#c2185b", name: "Deep Pink" },
    { color: "#ce93d8", name: "Lavender" },
    { color: "#f8bbd0", name: "Baby Pink" },
    { color: "#f48fb1", name: "Pink" },
    { color: "#ff5252", name: "Coral Red" },
    { color: "#ef9a9a", name: "Light Coral" },
    { color: "#ffab91", name: "Peach" },
    { color: "#ffe0b2", name: "Light Orange" },
    { color: "#fff59d", name: "Light Yellow" },
    { color: "#ffeb3b", name: "Yellow" },
    { color: "#ffd740", name: "Amber" },
    { color: "#ffb300", name: "Golden Orange" },
    { color: "#a1887f", name: "Brown Gray" },
    { color: "#8d6e63", name: "Brown" },
    { color: "#d7ccc8", name: "Beige" },
    { color: "#80cbc4", name: "Teal" },
    { color: "#a5d6a7", name: "Light Green" },
    { color: "#c5e1a5", name: "Lime Green" },
    { color: "#8bc34a", name: "Green" },
    { color: "#388e3c", name: "Dark Green" },
    { color: "#004d40", name: "Forest Green" },
    { color: "#006064", name: "Dark Teal" },
    { color: "#e0f2f1", name: "Aqua Mist" },
    { color: "#ffffff", name: "White" },
  ];

  // Get colors from product or use defaults
  const getColorsForTab = (tab) => {
    if (!selectedProduct) return defaultColorOptions;

    switch (tab) {
      case 'background':
        return defaultColorOptions; // Background colors remain the same
      case 'topColor':
        // FIXED: Access colors.topColor instead of just topColor
        return selectedProduct.colors?.topColor || defaultColorOptions;
      case 'bottomColor':
        // FIXED: Access colors.bottomColor instead of just bottomColor  
        return selectedProduct.colors?.bottomColor || defaultColorOptions;
      default:
        return defaultColorOptions;
    }
  };

  const getCurrentSelectedColor = (tab) => {
    switch (tab) {
      case 'background':
        return selectedColor;
      case 'topColor':
        return selectedTopColor;
      case 'bottomColor':
        return selectedBottomColor;
      default:
        return null;
    }
  };

  const handleColorSelect = (colorObj, tab) => {
    switch (tab) {
      case 'background':
        setSelectedColor(colorObj);
        break;
      case 'topColor':
        setSelectedTopColor(colorObj);
        break;
      case 'bottomColor':
        setSelectedBottomColor(colorObj);
        break;
    }
  };

  const renderColorPreview = (colorObj, tab) => {
    if (tab === 'background') {
      // For background colors, show the solid color
      return (
        <div
          className="kds-color-preview"
          style={{ backgroundColor: colorObj.color }}
        />
      );
    } else {
      // For gradient colors, show the image if available
      if (colorObj.url) {
        return (
          <div className="kds-color-preview">
            <img
              src={colorObj.url}
              alt={colorObj.name}
            />
          </div>
        );
      } else {
        // Fallback to solid color if no URL
        return (
          <div
            className="kds-color-preview"
            style={{ backgroundColor: colorObj.color || '#ccc' }}
          />
        );
      }
    }
  };

  const currentColors = getColorsForTab(activeTab);
  const currentSelected = getCurrentSelectedColor(activeTab);

  // Check if gradient tabs should be shown
  const hasGradientColors = selectedProduct?.colors?.topColor || selectedProduct?.colors?.bottomColor;

  return (
    <div className="kds-container">
      <div className='kds-header'>
        <div className='kds-header-left'>
          <h3 className='kds-title'>Select Colors</h3>
        </div>
        <div onClick={() => setShowBgColorsModal(false)} className="kds-close-button">
          <img src="https://res.cloudinary.com/dd9tagtiw/image/upload/v1749341803/Vector_hm0yzo.png" alt="Close" />
        </div>
      </div>
      <hr className="kds-divider" />

      {
        selectedProduct?.productType === "3D" && (
          <div className="kds-3d-section">
            <label className="kds-part-label">Select Part:</label>
            <div className="kds-parts-grid">
              {parts.map((part) => (
                <button
                  key={part}
                  onClick={() => setthreeDSelectedPart(part)}
                  className={`kds-part-button ${threeDselectedPart === part ? 'active' : ''}`}
                >
                  {part} 
                </button>
              ))}
            </div>

            <div className="kds-color-picker-section">
              <label className="kds-color-picker-label">Pick Color:</label>
              <input
                type="color"
                value={threeDcolor}
                onChange={(e) => setthreeDColor(e.target.value)}
                className="kds-color-picker"
              />
            </div>
          </div>
        )
      }

      {/* Tab Navigation - Only show if there are gradient colors */}
      {
        selectedProduct?.productType === '2D' && (
          <>
            <div className="kds-tab-navigation">
              <button
                onClick={() => setActiveTab('background')}
                className={`kds-tab-button ${activeTab === 'background' ? 'active background' : ''}`}
              >
                Background
              </button>

              {/* Only show gradient tabs if product has gradient colors */}
              {selectedProduct?.colors?.topColor && (
                <button
                  onClick={() => setActiveTab('topColor')}
                  className={`kds-tab-button ${activeTab === 'topColor' ? 'active topColor' : ''}`}
                >
                  Top Color
                </button>
              )}

              {selectedProduct?.colors?.bottomColor && (
                <button
                  onClick={() => setActiveTab('bottomColor')}
                  className={`kds-tab-button ${activeTab === 'bottomColor' ? 'active bottomColor' : ''}`}
                >
                  Bottom Color
                </button>
              )}
            </div>

            {/* Color Grid */}
            <div className='kds-colors-container'>
              <div className='kds-colors-list'>
                {currentColors.map((colorObj, index) => {
                  const isSelected = currentSelected && (
                    (activeTab === 'background' && currentSelected.color === colorObj.color) ||
                    (activeTab !== 'background' && currentSelected?.id === colorObj.id)
                  );

                  return (
                    <div
                      key={`${activeTab}-${index}`}
                      onClick={() => handleColorSelect(colorObj, activeTab)}
                      className={`kds-color-item ${isSelected ? "selected" : ""}`}
                    >
                      {renderColorPreview(colorObj, activeTab)}

                      <div className='kds-color-info'>
                        <p className='kds-color-name'>{colorObj.name}</p>
                        <span className='kds-color-description'>
                          {activeTab === 'background' ? '8 sizes in stock' : 'Gradient effect'}
                        </span>
                      </div>

                      {isSelected && (
                        <img
                          src="https://res.cloudinary.com/dd9tagtiw/image/upload/v1750146342/check-circle_1_lry4rw.svg"
                          alt="Selected"
                          className='kds-selected-icon'
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Info Footer */}
            <div className="kds-info-footer">
              {activeTab === 'background' && "Background colors change the base canvas color"}
              {activeTab === 'topColor' && "Top colors create gradient effects on the upper part"}
              {activeTab === 'bottomColor' && "Bottom colors create gradient effects on the lower part"}
              {!hasGradientColors && activeTab === 'background' && " • This product doesn't support gradient colors"}
            </div>
          </>
        )
      }
    </div>
  );
};

export default SelectColorsTab;