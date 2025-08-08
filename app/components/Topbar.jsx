// Simplified Topbar.jsx without 3D functionality

import React from 'react';
import { use3D } from '../context/3DContext';
import './Topbar.css';

const Topbar = ({
  setShowSidebar,
  onSave,
  isSaving,
  // selectedProduct
}) => {
  const { handleScreenshot, handleClearSelectedPart, selectedProduct, threeDscreenshots } = use3D();

  // Handle save for both 2D and 3D
  const handleSave = async () => {
    if (selectedProduct?.productType === "3D") {
      // Wait for screenshots to finish
      const screenshots = await handleScreenshot();

      if (!screenshots || screenshots.length === 0) {
        alert("Screenshots not ready yet. Please try again.");
        return;
      }

      // Pass screenshots to save logic
      if (onSave) {
        onSave(screenshots);
      }
    } else {
      if (onSave) {
        onSave();
      }
    }
  };



  return (
    <div className="kds-topbar">
      <div className="kds-topbar-container">

        <div className="kds-left-section">
          <div className="kds-logo-section">

            <img src="https://res.cloudinary.com/dd9tagtiw/image/upload/v1749337982/Customizer_w0ruf6.png" alt="" />

            <button
              onClick={() => setShowSidebar(prev => !prev)}
              className="kds-menu-button"
              aria-label="Toggle Sidebar"
            >
              <svg className="kds-menu-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Right Section - Action Buttons */}
        <div className="kds-right-section">

          {
            selectedProduct?.productType === "3D" && (
              <>
                <button
                  className="kds-save-views-button"
                  onClick={handleScreenshot}
                >
                  Save All Views
                </button>

                <button
                  className="kds-clear-part-button"
                  onClick={handleClearSelectedPart}
                >
                  Clear Selected Part
                </button>
              </>
            )
          }

          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="kds-save-button"
            title="Save design"
          >
            {isSaving ? (
              <>
                <div className="kds-spinner"></div>
                <span className="kds-reset">Saving...</span>
              </>
            ) : (
              <>
                <svg className="kds-save-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <span className="kds-reset">Save</span>
              </>
            )}
          </button>

          <img src="https://res.cloudinary.com/dd9tagtiw/image/upload/v1749338383/Buttons_klifkp.png" alt="" />
        </div>
      </div>
    </div>
  );
};

export default Topbar;