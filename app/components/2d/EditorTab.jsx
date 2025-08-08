import React from 'react'
import './EditorTab.css'

const EditorTab = ({setShowEditorModal}) => {
    return (
        <div className='kds-editor-container'>
            <div className='kds-editor-header'>
                <div className='kds-editor-title-section'>
                    <img src="https://res.cloudinary.com/dd9tagtiw/image/upload/v1749341726/Frame_12_mbe4a0.png" alt="AI" />
                    <h3 className='kds-editor-title'>Improve with AI</h3>
                </div>
                <div onClick={()=> setShowEditorModal(false)} className="kds-editor-close">
                    <img src="https://res.cloudinary.com/dd9tagtiw/image/upload/v1749341803/Vector_hm0yzo.png" alt="Close" />
                </div>
            </div>
            <hr className="kds-editor-divider" />
            <div className='kds-editor-content'>
                <div className='kds-editor-form'>
                    <label htmlFor="description" className="kds-editor-label">Description*</label>
                    <div className='kds-editor-textarea-container'>
                        <textarea 
                            name='description' 
                            className='kds-editor-textarea' 
                            placeholder='Describe the design in a sentence' 
                        />
                        <div className='kds-editor-prompt-badge'>
                            <span className='kds-editor-prompt-text'>Prompt</span>
                            <img src="https://res.cloudinary.com/dd9tagtiw/image/upload/v1749343021/Frame_12_1_jktiv7.png" alt="AI" />
                        </div>
                    </div>
                    <div className='kds-editor-tags'>
                        <span className='kds-editor-tag kds-active'>Color</span>
                        <span className='kds-editor-tag kds-inactive'>Arts</span>
                    </div>
                    <button className='kds-editor-generate-btn'>Generate</button>
                </div>
            </div>
        </div>
    )
}

export default EditorTab