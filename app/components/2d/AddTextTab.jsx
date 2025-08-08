import React from 'react';
import { use2D } from '../../context/2DContext';
import { use3D } from '@/app/context/3DContext';
import './AddTextTab.css';

const AddTextTab = ({ handleAddCustomText, update3DText }) => {
    const {
        customText, setCustomText,
        showAddModal, setShowAddModal
    } = use2D();

    const {
        threeDtext, setthreeDText, selectedProduct
    } = use3D();

    return (
        <div className='kds-container'>
            <div className='kds-header'>
                <div className='kds-header-left'>
                    <h3 className='kds-title'>Add text</h3>
                </div>
                <div className="kds-close-button" onClick={() => setShowAddModal(false)}>
                    <img src="https://res.cloudinary.com/dd9tagtiw/image/upload/v1749341803/Vector_hm0yzo.png" alt="Close" />
                </div>
            </div>
            {
                selectedProduct?.productType === "2D" && (
                    <>
                        <hr className="kds-divider" />
                        <div className='kds-content'>
                            <div className='kds-input-container'>
                                <textarea 
                                    value={customText}
                                    onChange={(e) => setCustomText(e.target.value)} 
                                    placeholder="Add Headline" 
                                    className="kds-text-input" 
                                />
                            </div>
                            <button 
                                onClick={handleAddCustomText} 
                                className={`kds-add-button ${customText.trim() !== "" ? "active" : "inactive"}`}
                            >
                                Add text
                            </button>
                        </div>
                    </>
                )
            }
            {
                selectedProduct?.productType === "3D" && (
                    <>
                        <hr className="kds-divider" />
                        <div className='kds-content'>
                            <div className='kds-input-container'>
                                <textarea
                                    placeholder="Enter text"
                                    value={threeDtext}
                                    onChange={(e) => setthreeDText(e.target.value)}
                                    className="kds-text-input"
                                />
                            </div>
                            <button 
                                onClick={update3DText} 
                                className={`kds-add-button ${threeDtext.trim() !== "" ? "active" : "inactive"}`}
                            >
                                Add text
                            </button>
                        </div>
                    </>
                )
            }





        </div>
    )
}

export default AddTextTab;