// Updated ClipartTab.js - Completely Dynamic Based on Product Data
'use client'

import { use3D } from '@/app/context/3DContext';
import React, { useState, useEffect } from 'react';
import * as THREE from 'three'
import './ClipartTab.css';

const DynamicClipartTab = ({
  setShowClipartTab,
  selectedProduct,
  handleAddDesignToCanvas,
  handleAddPatternToCanvas,
  handleDynamicLayerChange,
  editor
}) => {
  const [view, setView] = useState('main');
  const [availableCategories, setAvailableCategories] = useState([]);

  const is3DProduct = selectedProduct?.productType === '3D';
  const shirtDesigns = selectedProduct?.threeDDesigns?.shirtDesign || [];

  const { setthreeDTexture, threeDcolor, setCustomizationData, threeDselectedPart } = use3D();

  const handleApply3DDesign = (designUrl) => {
    const image = new window.Image();
    image.crossOrigin = "anonymous";
    image.src = designUrl;
    image.onload = () => {
      const size = 512;
      const canvas = document.createElement('canvas');
      canvas.width = canvas.height = size;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = threeDcolor || "#fff";
      ctx.fillRect(0, 0, size, size);
      ctx.drawImage(image, 0, 0, size, size);

      const texture = new THREE.CanvasTexture(canvas);
      texture.needsUpdate = true;
      setthreeDTexture(texture);

      setCustomizationData(prev => ({
        ...prev,
        parts: {
          ...prev.parts,
          [threeDselectedPart]: {
            ...prev.parts[threeDselectedPart],
            image: {
              mode: "full",
              url: designUrl
            }
          }
        }
      }));
    };
  };

  // Extract available categories from product data
  useEffect(() => {
    if (!selectedProduct) return;

    const categories = [];

    // Check what data is available in the product
    if (selectedProduct.layersDesigns) {
      Object.keys(selectedProduct.layersDesigns).forEach(category => {
        if (selectedProduct.layersDesigns[category] && selectedProduct.layersDesigns[category].length > 0) {
          categories.push({
            key: category,
            name: getCategoryDisplayName(category),
            items: selectedProduct.layersDesigns[category]
          });
        }
      });
    }

    setAvailableCategories(categories);
    console.log('📦 Available categories from product:', categories.map(c => c.name));
  }, [selectedProduct]);

  // Convert category keys to display names
  const getCategoryDisplayName = (key) => {
    const displayNames = {
      designs: 'Product Designs',
      patterns: 'Product Patterns',
      sole: 'Shoe Sole Options',
      surface: 'Surface Colors',
      middle: 'Middle Parts',
      lace: 'Lace Colors',
      backgrounds: 'Background Designs',
      textures: 'Texture Patterns',
      graphics: 'Graphic Elements',
      logos: 'Logo Designs',
      typography: 'Typography Styles'
    };

    return displayNames[key] || key.charAt(0).toUpperCase() + key.slice(1);
  };

  const handleBack = () => {
    setView('main');
  };

  const getHeaderTitle = () => {
    const backIcon = (
      <img
        src="https://res.cloudinary.com/dd9tagtiw/image/upload/v1750138078/chevron-right_p6kmcp.svg"
        className="kds-back-icon"
      />
    );

    if (view === 'main') {
      return 'Product Customization';
    }

    const currentCategory = availableCategories.find(cat => cat.key === view);
    const categoryName = currentCategory ? currentCategory.name : 'Back';

    return (
      <span className='kds-back-button' onClick={handleBack}>
        {backIcon}
        <span className='kds-back-text'>
          {categoryName}
        </span>
      </span>
    );
  };

  // Handle item selection based on category type
  const handleItemSelect = (item, categoryKey) => {
    console.log(`🎨 Selected item from ${categoryKey}:`, item.name);

    switch (categoryKey) {
      case 'designs':
        handleAddDesignToCanvas(item.url, item.position, item.offsetX, item.offsetY);
        break;

      case 'patterns':
        handleAddPatternToCanvas(item.url);
        break;

      // Handle dynamic layer types (shoe parts, etc.)
      case 'sole':
      case 'surface':
      case 'middle':
      case 'lace':
        handleDynamicLayerChange && handleDynamicLayerChange(categoryKey, item);
        break;

      // Handle any other custom categories
      default:
        if (handleDynamicLayerChange) {
          handleDynamicLayerChange(categoryKey, item);
        } else {
          console.log(`No handler for category: ${categoryKey}`);
        }
        break;
    }
  };

  // Render main category selection
  const renderMainView = () => (
    <>
      {
        selectedProduct.productType === '2D' && (
          <div className="kds-clipart-content kds-clipart-space-y-2">
            {availableCategories.length === 0 ? (
              <div className="kds-empty-state">
                <div className="kds-empty-icon">📦</div>
                <p className="kds-empty-text kds-reset">No customization options available</p>
                <p className="kds-empty-subtext kds-reset">This product doesn't have configurable layers</p>
              </div>
            ) : (
              availableCategories.map((category) => (
                <div
                  key={category.key}
                  onClick={() => setView(category.key)}
                  className="kds-category-item"
                >
                  <div className="kds-category-left">
                    <div className="kds-category-badge">
                      {category.items.length}
                    </div>
                    <div className="kds-category-info">
                      <h4 className="kds-reset">{category.name}</h4>
                      <p className="kds-reset">{category.items.length} options available</p>
                    </div>
                  </div>
                  <img
                    src="https://res.cloudinary.com/dd9tagtiw/image/upload/v1750138078/chevron-right_p6kmcp.svg"
                    className="kds-chevron-icon"
                  />
                </div>
              ))
            )}
          </div>
        )
      }

      {
        is3DProduct && shirtDesigns.length > 0 && (
          <div className="kds-3d-section">
            <h3 className="kds-3d-title">3D Shirt Designs</h3>
            <div className="kds-3d-grid">
              {shirtDesigns.map(design => (
                <div key={design.id} className="kds-3d-item"
                  onClick={() => handleApply3DDesign(design.url)}>
                  <img src={design.url} alt={design.name} className="kds-3d-image" />
                  <div className="kds-3d-name">{design.name}</div>
                </div>
              ))}
            </div>
          </div>
        )
      }
    </>
  );

  // Render category items
  const renderCategoryView = () => {
    const currentCategory = availableCategories.find(cat => cat.key === view);
    if (!currentCategory) return null;

    const isShoeCategory = ['sole', 'surface', 'middle', 'lace'].includes(view);
    const isDesignCategory = ['designs', 'patterns'].includes(view);

    return (
      <div className="kds-category-content">
        {isDesignCategory ? (
          // Grid layout for designs and patterns
          <div className={view === 'designs' ? 'kds-design-grid-3' : 'kds-design-grid-2'}>
            {currentCategory.items.map((item, index) => (
              <div key={item.id || index} className="kds-design-item">
                {view === 'patterns' ? (
                  // Special layout for patterns
                  <div className="kds-pattern-container">
                    <img
                      src={item.url}
                      alt={item.name}
                      className="kds-pattern-image"
                    />
                    <button
                      onClick={() => handleItemSelect(item, view)}
                      className="kds-add-pattern-btn"
                    >
                      ADD PATTERN
                    </button>
                    <p className="kds-pattern-name">{item.name}</p>
                  </div>
                ) : (
                  // Simple grid for designs
                  <div
                    onClick={() => handleItemSelect(item, view)}
                    className="kds-design-simple"
                  >
                    <img
                      src={item.url}
                      alt={item.name}
                      className="kds-design-image"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          // List layout for shoe parts and other categories
          <div className="kds-clipart-space-y-2">
            {currentCategory.items.map((item, index) => (
              <div
                key={item.id || index}
                onClick={() => handleItemSelect(item, view)}
                className="kds-shoe-item"
              >
                <div className="kds-shoe-thumbnail">
                  <img
                    src={item.url}
                    alt={item.name}
                  />
                </div>
                <div className="kds-shoe-info">
                  <h4 className="kds-shoe-name">{item.name}</h4>
                  {item.color && (
                    <p className="kds-shoe-detail">Color: {item.color}</p>
                  )}
                  {item.description && (
                    <p className="kds-shoe-detail">{item.description}</p>
                  )}
                </div>
                <div className="kds-shoe-arrow">
                  <svg fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty state for categories with no items */}
        {currentCategory.items.length === 0 && (
          <div className="kds-empty-state">
            <div className="kds-empty-icon">🎨</div>
            <p className="kds-empty-text kds-reset">No {currentCategory.name.toLowerCase()} available</p>
            <p className="kds-empty-subtext kds-reset">This category is empty</p>
          </div>
        )}
      </div>
    );
  };


  return (
    <div className="kds-clipart-container">
      <div className='kds-clipart-header'>
        <h3 className='kds-clipart-title'>
          {getHeaderTitle()}
        </h3>
        <div className="kds-clipart-close" onClick={() => setShowClipartTab(false)}>
          <img src="https://res.cloudinary.com/dd9tagtiw/image/upload/v1749341803/Vector_hm0yzo.png" alt="Close" />
        </div>
      </div>
      <hr className="kds-clipart-divider" />

      {view === 'main' ? renderMainView() : renderCategoryView()}

      {/* Dynamic info footer */}
      <div className="kds-footer">
        {view === 'main'
          ? `Product Type: ${selectedProduct?.type || 'Unknown'} • ${availableCategories.length} categories available`
          : `Select an option to customize your ${selectedProduct?.type || 'product'}`
        }
      </div>
    </div>
  );
};

export default DynamicClipartTab;