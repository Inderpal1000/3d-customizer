'use client'
import React, { useEffect } from "react";
import './FontSelector.css';

const families = [
  "Roboto", "Open Sans", "Lato", "Montserrat", "Poppins", "Source Sans Pro",
  "Raleway", "Noto Sans", "Ubuntu", "Merriweather", "Nunito", "Playfair Display",
  "Rubik", "Work Sans", "PT Sans", "Oswald", "Inter", "Quicksand", "DM Sans",
  "Roboto Condensed", "Bebas Neue", "Anton", "Dancing Script", "Cabin", "Fira Sans",
  "Mukta", "Josefin Sans", "Abel", "Teko", "Titillium Web",
  "Arimo", "Asap", "Barlow", "Cairo", "Chivo", "Cinzel", "Cormorant Garamond",
  "Domine", "EB Garamond", "Exo 2", "Francois One", "Heebo", "Hind", "IBM Plex Sans",
  "Inconsolata", "Kanit", "Karla", "Libre Baskerville", "Libre Franklin", "Lora",
  "Manrope", "Maven Pro", "Muli", "Noto Serif", "Overpass", "PT Serif",
  "Public Sans", "Questrial", "Righteous", "Signika", "Slabo 27px", "Spartan",
  "Sora", "Syne", "Tajawal", "Zilla Slab"
]

const FontSelector = ({ setSelectedFont, selectedFont, setShowTextSelectTab }) => {
  useEffect(() => {
    const loadFont = async () => {
      if (typeof window !== "undefined") {
        const WebFont = (await import('webfontloader')).default;
        WebFont.load({
          google: {
            families,
          },
        });
      }
    };
    
    loadFont();
  }, []);

  const handleFontClick = (font) => {
    setSelectedFont(font); 
  };

  return (
    <div className="kds-fontselector-container">
      <div className='kds-fontselector-header'>
        <h3 className='kds-fontselector-title'>Typeface</h3>
        <div className="kds-fontselector-close" onClick={() => setShowTextSelectTab(false)}>
          <img src="https://res.cloudinary.com/dd9tagtiw/image/upload/v1749341803/Vector_hm0yzo.png" alt="Close" />
        </div>
      </div>
      <hr className="kds-fontselector-divider" />
      
      <div className="kds-fontselector-content">
        {families.map((font) => (
          <div key={font} className="kds-fontselector-item" onClick={() => handleFontClick(font)}>
            <p className="kds-fontselector-font" style={{ fontFamily: font }}>
              {font}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FontSelector;