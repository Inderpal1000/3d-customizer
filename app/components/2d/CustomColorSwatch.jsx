import { useState } from "react";
import "./CustomColorSwatch.css";

const colorOptions = [
    "#000000", "#434343", "#666666", "#999999", "#b7b7b7", "#cccccc", "#e6e6e6", "#f3f3f3", "#dbebe6",
    "#b3e5fc", "#4fc3f7", "#0288d1", "#512da8", "#002f6c",
    "#4a148c", "#c2185b", "#ce93d8", "#f8bbd0",
    "#f48fb1", "#ff5252", "#ef9a9a", "#ffab91", "#ffe0b2", "#fff59d",
    "#ffeb3b", "#ffd740", "#ffb300", "#a1887f", "#8d6e63",
    "#d7ccc8", "#80cbc4", "#a5d6a7", "#c5e1a5", "#8bc34a",
    "#388e3c", "#004d40", "#006064", "#e0f2f1", "#ffffff"
];

export default function CustomColorSwatch({setTextColor, setChangeTextColor, selectedColor, setSelectedColor, setShowColorTab }) {
    
    const handleColorClick = (color) => {
        setChangeTextColor(color); 
    };

    return (
        <div className="kds-color-container">
            
            <div className='kds-color-header'>
                <div className='kds-color-title-section'>
                    <h3 className='kds-color-title'>Choose Color</h3>
                </div>
                <div className="kds-color-close" onClick={() => setShowColorTab(false)}>
                    <img src="https://res.cloudinary.com/dd9tagtiw/image/upload/v1749341803/Vector_hm0yzo.png" alt="Close" />
                </div>
            </div>
            <hr className="kds-color-divider" />
            
            <div className="kds-color-content">
                <div className="kds-used-colors-section">
                    <h3>USED IN YOUR DESIGN</h3>
                    <div className="kds-used-color-display">
                        <div 
                            className="kds-used-color-swatch" 
                            style={{ backgroundColor: setTextColor }} 
                            onClick={() => handleColorClick(setTextColor)}
                        />
                        <span className="kds-used-color-text">{setTextColor}</span>
                    </div>
                </div>
                
                <div className="kds-all-colors-section">
                    <h3>ALL COLORS</h3>
                    <div className="kds-color-grid">
                        {colorOptions.map((color) => (
                            <div
                                key={color}
                                className={`kds-color-swatch ${
                                    selectedColor === color ? "kds-selected" : "kds-unselected"
                                }`}
                                style={{ backgroundColor: color }}
                                onClick={() => handleColorClick(color)}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}