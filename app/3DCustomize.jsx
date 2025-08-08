'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import ModelViewer from './components/3d/ModelViewer';
import TextureUploader from './components/3d/TextureUploader';
import ControlsPanel from './components/3d/ControlsPanel';
import { Suspense, useEffect, useRef } from 'react';
import TextureControlsPanel from './components/3d/TextureControlsPanel';
import { createTextTexture } from './utility/createTextTexture';
import ScreenshotManager from './components/3d/ScreenshotManage';
import ScreenshotGallery from './components/3d/ScreenshotGallery';
import TextControlsPanel from './components/3d/TextControlsPanel';
import { use3D } from './context/3DContext';
import './3DCustomize.css';

export default function ThreeDCustomize() {
  const {
    threeDcolor,
    setthreeDColor,
    threeDtexture,
    setthreeDTexture,
    threeDselectedPart,
    setthreeDSelectedPart,
    threeDzoom,
    setthreeDZoom,
    threeDoffsetX,
    setthreeDOffsetX,
    threeDoffsetY,
    setthreeDOffsetY,
    threeDtext,
    setthreeDText,
    threeDtextTexture,
    setthreeDTextTexture,
    threeDtextColor,
    setthreeDTextColor,
    threeDoutlineColor,
    setthreeDOutlineColor,
    threeDtextScale,
    setthreeDTextScale,
    threeDtextPosX,
    setthreeDTextPosX,
    threeDtextPosY,
    setthreeDTextPosY,
    threeDscreenshots,
    setthreeDScreenshots,
    threeDloading,
    setthreeDLoading,
    threeDtextureMode,
    setthreeDTextureMode,
    threeDlogoScale,
    setthreeDLogoScale,
    threeDlogoPosX,
    setthreeDLogoPosX,
    threeDlogoPosY,
    setthreeDLogoPosY,
    customizationData,
    setCustomizationData,
    screenshotRef,
    selectedProduct,
  } = use3D();

  // const screenshotRef = useRef();

  // Reset text position to center when text changes or part changes
  const handleTextChange = (newText) => {
    setthreeDText(newText);
    if (newText.trim() && !threeDtext.trim()) {
      setthreeDTextPosX(0.5);
      setthreeDTextPosY(0.5);
    }
  };

  useEffect(() => {
    if (threeDtext.trim()) {
      const texture = createTextTexture({
        text: threeDtext,
        fill: threeDtextColor,
        stroke: threeDoutlineColor,
        baseColor: 'transparent',
        textScale: threeDtextScale,
        textPosX: threeDtextPosX,
        textPosY: threeDtextPosY,
      });
      setthreeDTextTexture(texture);

      setCustomizationData((prev) => ({
        ...prev,
        parts: {
          ...prev.parts,
          [threeDselectedPart]: {
            ...prev.parts[threeDselectedPart],
            text: {
              content: threeDtext,
              color: threeDtextColor,
              outline: threeDoutlineColor,
              scale: threeDtextScale,
              position: { x: threeDtextPosX, y: threeDtextPosY },
            },
          },
        },
      }));
    } else {
      setthreeDTextTexture(null);
    }
  }, [
    threeDtext,
    threeDtextColor,
    threeDoutlineColor,
    threeDtextScale,
    threeDtextPosX,
    threeDtextPosY,
    threeDselectedPart,
  ]);

  // Get model URL from product data
  const modelUrl = selectedProduct?.model3D || '/models/brand1.glb';

  return (
    <main className="kds-main">
      <div className="kds-canvas-container">
        <Canvas
          gl={{ preserveDrawingBuffer: true }}
          camera={{ position: [0, 0.5, 2.5], fov: 80 }}
        >
          <ambientLight intensity={1} />
          <Suspense fallback={null}>
            <Environment preset="city" />
          </Suspense>

          <ModelViewer modelUrl={modelUrl} selectedPart={threeDselectedPart} />

          <ScreenshotManager ref={screenshotRef} />
          <OrbitControls />
        </Canvas>
      </div>

      <div className="kds-controls-container">
        

        {/* <ControlsPanel
          onScreenshot={handleScreenshot}
        />

        <TextControlsPanel
        />

        <TextureUploader
        />

        <TextureControlsPanel
        /> */}

        {/* {customizationData?.parts && Object.keys(customizationData.parts).length > 0 && (
          <button
            className="kds-btn kds-btn-primary kds-btn-mt-2"
            onClick={() => console.log('Customization Data:', customizationData)}
          >
            Save Customization
          </button>
        )}

        {threeDloading && (
          <div className="kds-loading-overlay">
            <div className="kds-loading-content">
              <div className="kds-spinner"></div>
              <div className="kds-loading-text">Capturing screenshots...</div>
            </div>
          </div>
        )}

        {threeDscreenshots.length > 0 && (
          <ScreenshotGallery
            screenshots={threeDscreenshots}
            onClose={() => setthreeDScreenshots([])}
            onDownloadAll={() => console.log('All downloaded')}
          />
        )}

        <button
          className="kds-btn kds-btn-danger kds-btn-full kds-btn-mt-2"
          onClick={handleClearSelectedPart}
        >
          Clear Selected Part
        </button> */}
      </div>
    </main>
  );
}