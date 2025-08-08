import React, { useState, useEffect } from 'react';
import FontSelector from './FontSelector';
import CustomColorSwatch from './CustomColorSwatch';
import { use2D } from '../../context/2DContext';
import { use3D } from '@/app/context/3DContext';
import './EditTextTab.css';

const EditTextTab = ({ editor, layerManager }) => {
    const {
        customText, setCustomText,
        textSize, setTextSize,
        textSpacing, setTextSpacing,
        textArc, setTextArc,
        textColor, setTextColor,
        fontFamily, setFontFamily,
        fontStyle, setFontStyle,
        textFlipX, setTextFlipX,
        textFlipY, setTextFlipY,
        showEditModal, setShowEditModal,
        showAddModal, setShowAddModal
    } = use2D();

    const {
        threeDtextScale, setthreeDTextScale,
        threeDtextPosX, setthreeDTextPosX,
        threeDtextPosY, setthreeDTextPosY,
        threeDtextColor, setthreeDTextColor,
        threeDoutlineColor, setthreeDOutlineColor,
    } = use3D();

    const [showColorTab, setShowColorTab] = useState(false);
    const [showTextSelectTab, setShowTextSelectTab] = useState(false);
    const [currentFont, setCurrentFont] = useState('Arial');
    const [currentColor, setCurrentColor] = useState('#000000');
    const [activeTextObject, setActiveTextObject] = useState(null);
    const [textObjectsCount, setTextObjectsCount] = useState(0);

    // Get all i-text objects from canvas (excluding emojis)
    const getAllTextObjects = () => {
        if (!editor?.canvas) return [];
        return editor.canvas.getObjects().filter(obj =>
            obj.type === 'i-text' && !obj.isEmoji
        );
    };

    // Get the most recently added or selected text object
    const getActiveTextObject = () => {
        if (!editor?.canvas) return null;

        const textObjects = getAllTextObjects();

        if (textObjects.length === 0) {
            return null;
        }

        // Return the last added text object (highest index)
        return textObjects[textObjects.length - 1];
    };

    // Create a new text object with proper layer management
    const createNewTextObject = () => {
        if (!editor?.canvas) return null;

        import("fabric").then((fabric) => {
            const canvas = editor.canvas;
            const productImage = canvas.getObjects().find((obj) => obj.isTshirtBase);

            if (!productImage) {
                console.error('❌ No base product found for text placement');
                return null;
            }

            const productBounds = productImage.getBoundingRect();

            const newTextObj = new fabric.IText('Add your text here', {
                left: productBounds.left + productBounds.width * 0.25,
                top: productBounds.top + productBounds.height / 3.5,
                originX: "center",
                originY: "center",
                fontSize: textSize || 28,
                fill: currentColor || '#000000',
                fontFamily: currentFont || 'Arial',
                fontStyle: 'normal',
                selectable: false, // Consistent with parent component
                evented: false,    // Consistent with parent component
                hasControls: false,
                hasBorders: false,
                moveCursor: "default",
                lockMovementX: true,  // Consistent with parent component
                lockMovementY: true,
                lockScalingX: true,
                lockScalingY: true,
                lockRotation: true,
                editable: false // Consistent with parent component
            });

            canvas.add(newTextObj);

            // Apply proper layer management using the parent's layer system
            if (layerManager) {
                layerManager.setObjectLayer(newTextObj);
                layerManager.arrangeCanvasLayers();
            }

            setActiveTextObject(newTextObj);
            console.log('✅ New text object created with proper layering (zIndex: 5)');

            return newTextObj;
        });
    };

    // Auto-detect and sync with text objects
    useEffect(() => {
        if (!editor?.canvas) return;

        const syncWithTextObjects = () => {
            const textObjects = getAllTextObjects();
            const currentCount = textObjects.length;

            // Update count to trigger re-renders when text objects change
            setTextObjectsCount(currentCount);

            let targetTextObj = getActiveTextObject();

            // If we have text objects, work with the most recent one
            if (targetTextObj && targetTextObj !== activeTextObject) {
                setActiveTextObject(targetTextObj);

                // Sync all properties from the detected text object
                if (targetTextObj.text !== customText) {
                    setCustomText(targetTextObj.text || 'Add your text here');
                }
                setCurrentFont(targetTextObj.fontFamily || 'Arial');
                setCurrentColor(targetTextObj.fill || '#000000');
                setTextSize(targetTextObj.fontSize || 28);
                setTextSpacing(Math.round((targetTextObj.charSpacing || 0) / 10));
                setFontStyle(targetTextObj.fontWeight || 'normal');
                setTextFlipX(targetTextObj.flipX || false);
                setTextFlipY(targetTextObj.flipY || false);
                setTextColor(targetTextObj.fill || '#000000');

                console.log('🔄 Synced with existing text object:', targetTextObj.text);
            }
        };

        // Initial sync
        syncWithTextObjects();

        // Listen for canvas events to detect changes
        const handleCanvasEvents = () => {
            setTimeout(syncWithTextObjects, 50); // Small delay to ensure objects are properly added
        };

        // Monitor canvas changes
        editor.canvas.on('object:added', handleCanvasEvents);
        editor.canvas.on('object:removed', handleCanvasEvents);
        editor.canvas.on('object:modified', handleCanvasEvents);
        editor.canvas.on('path:created', handleCanvasEvents);

        // Cleanup
        return () => {
            if (editor?.canvas) {
                editor.canvas.off('object:added', handleCanvasEvents);
                editor.canvas.off('object:removed', handleCanvasEvents);
                editor.canvas.off('object:modified', handleCanvasEvents);
                editor.canvas.off('path:created', handleCanvasEvents);
            }
        };
    }, [editor?.canvas, activeTextObject, layerManager]);

    // Apply changes to the active text object
    const applyToTextObject = (updateFn) => {
        let textObj = activeTextObject || getActiveTextObject();

        if (!textObj) {
            // If no text object exists, create one
            textObj = createNewTextObject();
            if (!textObj) return;
        }

        if (textObj) {
            updateFn(textObj);
            editor.canvas.renderAll();

            // Ensure proper layering after any change
            if (layerManager) {
                setTimeout(() => {
                    layerManager.arrangeCanvasLayers();
                }, 10);
            }
        }
    };

    const handleTextChange = (e) => {
        const newText = e.target.value;
        setCustomText(newText);

        applyToTextObject((textObj) => {
            textObj.set('text', newText);
        });
    };

    const handleFontSelection = (font) => {
        setFontFamily(font);
        setCurrentFont(font);

        applyToTextObject((textObj) => {
            textObj.set('fontFamily', font);
        });

        setShowTextSelectTab(false);
    };

    const handleColorSelection = (color) => {
        setTextColor(color);
        setCurrentColor(color);

        applyToTextObject((textObj) => {
            textObj.set('fill', color);
        });

        setShowColorTab(false);
    };

    const handleFontStyleChange = (styleType) => {
        applyToTextObject((textObj) => {
            if (styleType === 'bold') {
                const currentWeight = textObj.fontWeight;
                const newWeight = currentWeight === 'bold' ? 'normal' : 'bold';
                textObj.set('fontWeight', newWeight);
                setFontStyle(newWeight);
            } else if (styleType === 'italic') {
                const currentStyle = textObj.fontStyle;
                const newStyle = currentStyle === 'italic' ? 'normal' : 'italic';
                textObj.set('fontStyle', newStyle);
                setFontStyle(newStyle);
            }
        });
    };

    const handleFlipX = () => {
        applyToTextObject((textObj) => {
            const currentFlipX = textObj.flipX;
            const newFlipX = !currentFlipX;
            textObj.set('flipX', newFlipX);
            setTextFlipX(newFlipX);
        });
    };

    const handleFlipY = () => {
        applyToTextObject((textObj) => {
            const currentFlipY = textObj.flipY;
            const newFlipY = !currentFlipY;
            textObj.set('flipY', newFlipY);
            setTextFlipY(newFlipY);
        });
    };

    const handleSizeChange = (e) => {
        const newSize = parseInt(e.target.value);
        setTextSize(newSize);

        applyToTextObject((textObj) => {
            textObj.set("fontSize", newSize);
        });
    };

    const handleSpacingChange = (e) => {
        const newSpacing = parseInt(e.target.value);
        setTextSpacing(newSpacing);

        applyToTextObject((textObj) => {
            textObj.set("charSpacing", newSpacing * 10);
        });
    };

    // Enhanced arrange functions that work with the layer system
    const handleBringForward = () => {
        const textObj = activeTextObject || getActiveTextObject();
        if (textObj && editor?.canvas) {
            // Use the parent's bringForward if available, otherwise use canvas method
            if (bringForward) {
                bringForward();
            } else {
                editor.canvas.bringForward(textObj);
                editor.canvas.renderAll();
            }

            // Re-apply layer management after arrange
            if (layerManager) {
                setTimeout(() => {
                    layerManager.arrangeCanvasLayers();
                }, 50);
            }
        }
    };

    const handleArrangeAction = (action) => {
        const textObj = activeTextObject || getActiveTextObject();
        if (!textObj || !editor?.canvas) return;

        const canvas = editor.canvas;

        switch (action) {
            case 'bringToFront':
                canvas.bringToFront(textObj);
                break;
            case 'bringForward':
                canvas.bringForward(textObj);
                break;
            case 'sendBackward':
                canvas.sendBackwards(textObj);
                break;
            case 'sendToBack':
                canvas.sendToBack(textObj);
                break;
        }

        textObj.setCoords();
        canvas.renderAll();

        // Re-apply layer management to maintain proper order
        if (layerManager) {
            setTimeout(() => {
                layerManager.arrangeCanvasLayers();
            }, 50);
        }
    };

    const shouldShowEditText = !showTextSelectTab && !showColorTab;

    return (
        <>
            {shouldShowEditText && (
                <div className="kds-edit-text-container">

                    <div className='kds-edit-text-header'>
                        <div className='kds-edit-text-title-section'>
                            <h3 className='kds-edit-text-title'>Edit text</h3>
                            {activeTextObject && (
                                <span className='kds-edit-text-status kds-detected'>
                                    ● Auto-detected ({textObjectsCount} text{textObjectsCount !== 1 ? 's' : ''})
                                </span>
                            )}
                            {!activeTextObject && textObjectsCount === 0 && (
                                <span className='kds-edit-text-status kds-ready'>
                                    ● Ready to create
                                </span>
                            )}
                        </div>
                        <div className="kds-edit-text-close" onClick={() => setShowEditModal(false)}>
                            <img src="https://res.cloudinary.com/dd9tagtiw/image/upload/v1749341803/Vector_hm0yzo.png" alt="Close" />
                        </div>
                    </div>
                    <hr className="kds-edit-text-divider" />

                    <div className='kds-edit-text-content'>
                        <input
                            type="text"
                            value={customText}
                            onChange={handleTextChange}
                            placeholder="Add Headline"
                            className="kds-edit-text-input"
                        />
                        {!activeTextObject && (
                            <p className="kds-edit-text-hint">
                                💡 Type text above to automatically create a text object
                            </p>
                        )}
                    </div>

                    <hr className="kds-edit-text-divider" />

                    <div className='kds-edit-text-section'>
                        <div className='kds-edit-text-title-section'>
                            <h3 className='kds-edit-text-section-title'>Flip</h3>
                        </div>
                        <div className="kds-edit-text-controls">
                            <img
                                onClick={handleFlipX}
                                className='kds-edit-text-control-icon'
                                src="https://res.cloudinary.com/dd9tagtiw/image/upload/v1749507255/tune-vertical_ezas8p.png"
                                alt="flip horizontal"
                            />
                            <img
                                onClick={handleFlipY}
                                className='kds-edit-text-control-icon'
                                src="https://res.cloudinary.com/dd9tagtiw/image/upload/v1749507254/flip-vertical_ajs5ur.png"
                                alt="flip vertical"
                            />
                        </div>
                    </div>

                    <hr className="kds-edit-text-divider" />

                    <div className='kds-edit-text-font-section'>
                        <div className='kds-edit-text-font-header'>
                            <h3 className='kds-edit-text-section-title'>Font</h3>
                        </div>
                        <div className="kds-edit-text-font-controls">
                            <div
                                onClick={() => setShowTextSelectTab(true)}
                                className='kds-edit-text-font-selector'
                            >
                                <span className='kds-edit-text-font-name'>
                                    {currentFont}
                                </span>
                                <img src="https://res.cloudinary.com/dd9tagtiw/image/upload/v1750138078/chevron-right_p6kmcp.svg" alt="arrow" className="kds-edit-text-font-arrow" />
                            </div>

                            <img
                                className='kds-edit-text-style-icon'
                                onClick={() => handleFontStyleChange('bold')}
                                src="https://res.cloudinary.com/dd9tagtiw/image/upload/v1750137959/alpha-b_aygypw.svg"
                                alt="bold"
                            />
                            <img
                                className='kds-edit-text-style-icon'
                                onClick={() => handleFontStyleChange('italic')}
                                src="https://res.cloudinary.com/dd9tagtiw/image/upload/v1750137959/format-italic_d9ndma.svg"
                                alt="italic"
                            />

                            <div
                                className="kds-edit-text-color-swatch"
                                style={{ backgroundColor: currentColor }}
                                onClick={() => setShowColorTab(true)}
                            />
                        </div>
                    </div>

                    <hr className="kds-edit-text-divider" />

                    <div className="kds-edit-text-3d-section">
                        <div className="kds-edit-text-3d-controls">
                            <div className="kds-edit-text-3d-control">
                                <label className="kds-edit-text-3d-label">3D Text Scale: {threeDtextScale.toFixed(2)}</label>
                                <input type="range" min="0.2" max="2" step="0.05" value={threeDtextScale} onChange={(e) => setthreeDTextScale(parseFloat(e.target.value))} className="kds-edit-text-3d-range" />
                            </div>
                            <div className="kds-edit-text-3d-control">
                                <label className="kds-edit-text-3d-label">3D Text Position X: {threeDtextPosX.toFixed(2)}</label>
                                <input type="range" min="0" max="1" step="0.01" value={threeDtextPosX} onChange={(e) => setthreeDTextPosX(parseFloat(e.target.value))} className="kds-edit-text-3d-range" />
                            </div>
                            <div className="kds-edit-text-3d-control">
                                <label className="kds-edit-text-3d-label">3D Text Position Y: {threeDtextPosY.toFixed(2)}</label>
                                <input type="range" min="0" max="1" step="0.01" value={threeDtextPosY} onChange={(e) => setthreeDTextPosY(parseFloat(e.target.value))} className="kds-edit-text-3d-range" />
                            </div>
                        </div>
                    </div>

                    <div className="kds-edit-text-3d-color-section">
                        <div className="kds-edit-text-3d-color-controls">
                            <label className="kds-edit-text-3d-color-label">Text Color:</label>
                            <input
                                type="color"
                                value={threeDtextColor}
                                onChange={(e) => setthreeDTextColor(e.target.value)}
                                className="kds-edit-text-3d-color-input"
                            />

                            <label className="kds-edit-text-3d-color-label">Outline Color:</label>
                            <input
                                type="color"
                                value={threeDoutlineColor}
                                onChange={(e) => setthreeDOutlineColor(e.target.value)}
                                className="kds-edit-text-3d-color-input"
                            />
                        </div>
                    </div>

                    <div className='kds-edit-text-sliders'>
                        <label className="kds-edit-text-slider-label">Size</label>
                        <input
                            type="range"
                            min={23}
                            max={40}
                            value={textSize}
                            onChange={handleSizeChange}
                            className="kds-edit-text-slider"
                        />

                        <label className="kds-edit-text-slider-label">Spacing</label>
                        <input
                            type="range"
                            min={-10}
                            max={100}
                            value={textSpacing}
                            onChange={handleSpacingChange}
                            className="kds-edit-text-slider"
                        />
                    </div>

                    <hr className="kds-edit-text-divider" />

                    <div className='kds-edit-text-arrange'>
                        <h3 className='kds-edit-text-arrange-title'>Arrange</h3>
                        <div className="kds-edit-text-arrange-controls">
                            <img
                                onClick={handleBringForward}
                                className='kds-edit-text-arrange-icon'
                                src="https://res.cloudinary.com/dd9tagtiw/image/upload/v1749508122/arrange-bring-forward_vigco4.png"
                                alt="bring forward"
                                title="Bring Forward"
                            />
                            <img
                                onClick={() => handleArrangeAction('bringToFront')}
                                className='kds-edit-text-arrange-icon'
                                src="https://res.cloudinary.com/dd9tagtiw/image/upload/v1749508122/arrange-bring-to-front_povosv.png"
                                alt="bring to front"
                                title="Bring to Front"
                            />
                            <img
                                onClick={() => handleArrangeAction('sendBackward')}
                                className='kds-edit-text-arrange-icon'
                                src="https://res.cloudinary.com/dd9tagtiw/image/upload/v1749508122/arrange-send-backward_buzw6f.png"
                                alt="send backward"
                                title="Send Backward"
                            />
                            <img
                                onClick={() => handleArrangeAction('sendToBack')}
                                className='kds-edit-text-arrange-icon'
                                src="https://res.cloudinary.com/dd9tagtiw/image/upload/v1749508121/arrange-send-to-back_bcyzlu.png"
                                alt="send to back"
                                title="Send to Back"
                            />
                        </div>
                        {layerManager && (
                            <p className="kds-edit-text-layer-info">
                                ⚡ Layer system active - TEXT layer (zIndex: 5)
                            </p>
                        )}
                    </div>

                </div>
            )}

            {showTextSelectTab && (
                <FontSelector
                    selectedFont={currentFont}
                    setShowTextSelectTab={setShowTextSelectTab}
                    setSelectedFont={handleFontSelection}
                />
            )}

            {showColorTab && (
                <CustomColorSwatch
                    setTextColor={setTextColor}
                    setChangeTextColor={handleColorSelection}
                    setShowColorTab={setShowColorTab}
                />
            )}
        </>
    )
}

export default EditTextTab;