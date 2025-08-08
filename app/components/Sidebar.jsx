"use client";
import React, { useState, useEffect } from "react";
import EditorTab from "./2d/EditorTab";
import PreviewTab from "./2d/PreviewTab";
import EditTab from "./2d/EditTab";
import AddTextTab from "./2d/AddTextTab";
import EditTextTab from "./2d/EditTextTab";
import SelectColorsTab from "./2d/SelectColorsTab";
import DynamicClipartTab from "./2d/ClipartTab"; // Updated import
import RightSideImageUpload from "./2d/RightSideImageComponent";
import "./Sidebar.css";

const Sidebar = ({
  editor,
  selectedProduct,
  handleAddCustomText,
  customText,
  setCustomText,
  showAddModal,
  showEditModal,
  setShowEditModal,
  setShowAddModal,
  textSize,
  setTextSize,
  textSpacing,
  setTextSpacing,
  textArc,
  setTextArc,
  handleColorChange,
  selectedColor,
  setSelectedColor,
  addEmojiTextToCanvas,
  updateArrange,
  setTextColor,
  setTextFontFamily,
  setFontStyle,
  alignFabricObject,
  bringForward,
  handleAddDesignToCanvas,
  constrainObjectToProduct,
  addIconToCanvas,
  handleAddPatternToCanvas,
  applyClippingToObject,
  setFlipX,
  setFlipY,
  layerManager,
  handleTopColorChange,
  handleBottomColorChange,
  selectedTopColor,
  selectedBottomColor,
  setTextFlipX,
  setTextFlipY,
  handleDynamicLayerChange, // NEW: For dynamic shoe layers
  selectedLayers, // NEW: Current selected layers for shoes
  handleDynamicColorChange
}) => {
  const [activeTab, setActiveTab] = useState("editor");
  const [showClipartTab, setShowClipartTab] = useState(false);
  const [showEditorModal, setShowEditorModal] = useState(true);
  const [showImageEditModal, setShowImageEditModal] = useState(false);
  const [showBgColorsModal, setShowBgColorsModal] = useState(false);
  const [showrightImage, setShowrightImage] = useState(false);

  const [hasUploadedImage, setHasUploadedImage] = useState(false);
  const [hasAddedText, setHasAddedText] = useState(false);

  const checkForDesignOnCanvas = () => {
    if (!editor?.canvas) return false;

    const objects = editor.canvas.getObjects();
    const designObjects = objects.filter(obj =>
      obj.type === "image" &&
      !obj.isTshirtBase &&
      obj.name === "design-image"
    );

    return designObjects.length > 0;
  };

  const checkForTextOnCanvas = () => {
    if (!editor?.canvas) return false;

    const objects = editor.canvas.getObjects();
    const textObjects = objects.filter(obj => obj.type === "i-text");

    return textObjects.length > 0;
  };

  useEffect(() => {
    if (!editor?.canvas) return;

    const checkCanvasContent = () => {
      const designExists = checkForDesignOnCanvas();
      const textExists = checkForTextOnCanvas();

      if (!designExists && hasUploadedImage) {
        setHasUploadedImage(false);
        if (showImageEditModal) {
          setShowImageEditModal(false);
        }
      }

      if (!textExists && hasAddedText) {
        setHasAddedText(false);
        if (showEditModal) {
          setShowEditModal(false);
        }
      }

      if (textExists && !hasAddedText && activeTab === "text") {
        setHasAddedText(true);
        setShowAddModal(false);
        setShowEditModal(true);
      }

      if (designExists && !hasUploadedImage && activeTab === "edit") {
        setHasUploadedImage(true);
        setShowImageEditModal(true);
      } else {
        setHasUploadedImage(false);
      }
    };

    const canvas = editor.canvas;
    canvas.on('object:removed', checkCanvasContent);
    canvas.on('object:added', () => {
      setTimeout(checkCanvasContent, 100);
    });

    checkCanvasContent();

    return () => {
      canvas.off('object:removed', checkCanvasContent);
      canvas.off('object:added', checkCanvasContent);
    };
  }, [editor, hasUploadedImage, hasAddedText, showImageEditModal, showEditModal, activeTab]);

  const handleAddCustomTextWithTracking = () => {
    if (customText.trim() !== "") {
      handleAddCustomText();
      setHasAddedText(true);
      setShowAddModal(false);
      setShowEditModal(true);
    }
  };

  const update3DText = () => {
    setHasAddedText(true);
    setShowAddModal(false);
    setShowEditModal(true);
  }

  const handleTabClick = (key) => {
    setShowEditorModal(false);
    setShowImageEditModal(false);
    setShowAddModal(false);
    setShowEditModal(false);
    setShowBgColorsModal(false);
    setShowClipartTab(false);
    setShowrightImage(false)
    setActiveTab(key);

    if (key === "editor") {
      setShowEditorModal(true);
    }
    if (key === "edit") {
      const designExists = checkForDesignOnCanvas();
      if (designExists) {
        setHasUploadedImage(true);
        setShowImageEditModal(true);
      } else {
        setHasUploadedImage(false);
      }
    }
    if (key === "text") {
      const textExists = checkForTextOnCanvas();
      if (textExists) {
        setHasAddedText(true);
        setShowEditModal(true);
      } else {
        setHasAddedText(false);
        setShowAddModal(true);
      }
    }
    if (key === "colors") {
      setShowBgColorsModal(true);
    }
    if (key === "clipart") {
      setShowClipartTab(true);
    }
    if (key === "rightImage") {
      setShowrightImage(true);
    }
  };

  // Determine tab label based on product type
  const getClipartTabLabel = () => {
    if (!selectedProduct) return "Clipart";

    switch (selectedProduct.type) {
      case "shoe":
        return "Customize";
      case "sando":
        return "Designs";
      default:
        return "Clipart";
    }
  };

  return (
    <div className="kds-sidebar">
      <div className="kds-sidebar-menu">
        {[
          { key: "editor", label: "Editor", icon: "Frame_4_vzkhrn" },
          { key: "edit", label: "Edit", icon: "pencil-outline_c6lwsj" },
          { key: "text", label: "Text", icon: "text-recognition_emsdp8" },
          { key: "colors", label: "Colors", icon: "invert-colors_bybi8l" },
          { key: "clipart", label: getClipartTabLabel(), icon: "heart-multiple-outline_rjqkb7" },
          { key: "rightImage", label: "Right Image", icon: "heart-multiple-outline_rjqkb7" },
        ].map(({ key, label, icon }) => (
          <div
            key={key}
            onClick={() => handleTabClick(key)}
            className="kds-tab"
          >
            <img
              src={`https://res.cloudinary.com/dd9tagtiw/image/upload/v1749641805/${icon}.svg`}
              alt={label}
              className="kds-tab-icon"
            />
            <p className={`kds-tab-label ${activeTab === key ? "kds-active" : ""}`}>
              {label}
            </p>
          </div>
        ))}
      </div>

      {activeTab === "editor" && showEditorModal && (
        <EditorTab setShowEditorModal={setShowEditorModal} />
      )}

      {activeTab === "edit" && (
        <>
          {!hasUploadedImage && (
            <EditTab
              handleAddDesignToCanvas={handleAddDesignToCanvas}
              editor={editor}
              setShowImageEditModal={setShowImageEditModal}
              setHasUploadedImage={setHasUploadedImage}
              selectedProduct={selectedProduct}
            />
          )}
          {hasUploadedImage && showImageEditModal && (
            <PreviewTab
              editor={editor}
              setShowImageEditModal={setShowImageEditModal}
              updateArrange={updateArrange}
              constrainObjectToProduct={constrainObjectToProduct}
              applyClippingToObject={applyClippingToObject}
            />
          )}
        </>
      )}

      {activeTab === "text" && (
        <>
          {!hasAddedText && showAddModal && (
            <AddTextTab
              setShowAddModal={setShowAddModal}
              customText={customText}
              setCustomText={setCustomText}
              handleAddCustomText={handleAddCustomTextWithTracking}
              update3DText={update3DText} // NEW: Pass update function
            />
          )}
          {hasAddedText && showEditModal && (
            <EditTextTab
              setTextColor={setTextColor}
              editor={editor}
              setShowEditModal={setShowEditModal}
              customText={customText}
              setCustomText={setCustomText}
              textSize={textSize}
              setTextSize={setTextSize}
              textSpacing={textSpacing}
              setTextSpacing={setTextSpacing}
              setTextFontFamily={setTextFontFamily}
              setFontStyle={setFontStyle}
              setTextFlipX={setTextFlipX}
              setTextFlipY={setTextFlipY}
              bringForward={bringForward}
              layerManager={layerManager}
            />
          )}
        </>
      )}

      {activeTab === "colors" && showBgColorsModal && (
        <SelectColorsTab
          handleColorChange={handleColorChange}
          selectedColor={selectedColor}
          setShowBgColorsModal={setShowBgColorsModal}
          handleTopColorChange={handleTopColorChange}
          handleBottomColorChange={handleBottomColorChange}
          selectedTopColor={selectedTopColor}
          selectedBottomColor={selectedBottomColor}
          selectedProduct={selectedProduct}
          handleDynamicColorChange={handleDynamicColorChange}
        />
      )}

      {activeTab === "clipart" && showClipartTab && (
        <DynamicClipartTab
          addEmojiTextToCanvas={addEmojiTextToCanvas}
          setShowClipartTab={setShowClipartTab}
          selectedProduct={selectedProduct}
          handleAddDesignToCanvas={handleAddDesignToCanvas}
          addIconToCanvas={addIconToCanvas}
          editor={editor}
          handleAddPatternToCanvas={handleAddPatternToCanvas}
          handleDynamicLayerChange={handleDynamicLayerChange} // NEW: Pass dynamic layer handler
          selectedLayers={selectedLayers} // NEW: Pass selected layers
        />
      )}

      {activeTab === "rightImage" && showrightImage && (
        <RightSideImageUpload
          editor={editor}
          selectedProduct={selectedProduct}
          layerManager={layerManager}
          setShowrightImage={setShowrightImage}
        />
      )}
    </div>
  );
};

export default Sidebar;