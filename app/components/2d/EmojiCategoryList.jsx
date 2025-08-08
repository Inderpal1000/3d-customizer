import React from 'react';
import './EmojiCategoryList.css';

const EmojiCategoryList = ({ categories, onCategoryClick, addEmojiTextToCanvas }) => {
    return (
        <>
            <div className='kds-emoji-list-container'>
                <div className="kds-emoji-search-wrapper">
                    <input type="search" id="default-search" className="kds-emoji-search-input" placeholder="Search Emoji" />
                    <div className="kds-emoji-search-icon">
                        <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                        </svg>
                    </div>
                </div>
            </div>
            <div className="kds-emoji-categories">
                {categories.map((category, index) => {
                    if (category.category === "Emoji" && category.emojis?.length > 0) {
                        return (
                            <div key={index}>
                                <h3 className="kds-emoji-category-title">Emoji</h3>
                                <div className="kds-emoji-grid">
                                    {category.emojis.map((emoji, i) => (
                                        <span
                                            key={i}
                                            onClick={() => addEmojiTextToCanvas(emoji)}
                                            className="kds-emoji-item"
                                        >
                                            {emoji}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        );
                    } else {
                        return (
                            <h3
                                key={index}
                                onClick={() => onCategoryClick(category)}
                                className="kds-emoji-category-link"
                            >
                                {category.category}
                            </h3>
                        );
                    }
                })}

            </div>
        </>
    );
};

export default EmojiCategoryList;
