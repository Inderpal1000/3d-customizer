import React from 'react';
import './EmojiList.css';

const EmojiList = ({ emojis,addEmojiTextToCanvas }) => {
    return (
        <div className="kds-emoji-grid">
            {emojis.map((emoji, index) => (
                <span onClick={()=> addEmojiTextToCanvas(emoji)} key={index} className="kds-emoji-cell">
                    {emoji}
                </span>
            ))}
        </div>
    );
};

export default EmojiList;
