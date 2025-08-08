import React, { useState } from 'react'
import TextureControlsPanel from '../3d/TextureControlsPanel';
import TextureUploader from '../3d/TextureUploader';
import { use3D } from '@/app/context/3DContext';
import './EditTab.css';

const EditTab = ({ handleAddDesignToCanvas, editor, setShowImageEditModal, setHasUploadedImage }) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);

    const { selectedProduct } = use3D();

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {

            if (file.size > 5 * 1024 * 1024) {
                alert('File size must be less than 5MB');
                return;
            }
            setSelectedFile(file);
        } else {
            alert('Please select a valid image file (JPG, PNG, SVG)');
        }
    };

    const handleUploadDesign = async () => {
        if (!selectedFile || !editor?.canvas) return;

        setIsUploading(true);

        try {
            const reader = new FileReader();
            reader.onload = (e) => {
                const imageUrl = e.target.result;

                if (handleAddDesignToCanvas) {
                    handleAddDesignToCanvas(imageUrl, "center", 0, 0);

                    setTimeout(() => {
                        if (setHasUploadedImage) {
                            setHasUploadedImage(true);
                        }
                        if (setShowImageEditModal) {
                            setShowImageEditModal(true);
                        }
                    }, 500);
                }

                setSelectedFile(null);
            };

            reader.readAsDataURL(selectedFile);
        } catch (error) {
            console.error("Design upload failed:", error);
            alert("Failed to upload design. Please try again.");
        } finally {
            setIsUploading(false);
        }
    };



    return (
        <div className="kds-edit-container">
            <div className='kds-edit-header'>
                <div className='kds-edit-title-section'>
                    <h3 className='kds-edit-title'>Edit</h3>
                </div>
                <div className='kds-edit-close'>
                    <img src="https://res.cloudinary.com/dd9tagtiw/image/upload/v1749341803/Vector_hm0yzo.png" alt="Close" />
                </div>
            </div>
            <hr className="kds-edit-divider" />

            {
                selectedProduct?.productType === '2D' && (
                    <div className='kds-edit-body'>
                        <div className='kds-edit-form'>
                            <h3 className='kds-edit-subtitle'>Original vector artwork best, if you have?</h3>

                            <label className="kds-upload-label">
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="kds-hidden"
                                    onChange={handleFileSelect}
                                />
                                <div className="kds-upload-helper">
                                    <div className="kds-upload-cta">
                                        {selectedFile ? "Image Uploaded" : "Choose a file"}
                                    </div>
                                    <p className='kds-upload-note'>
                                        We support JPG, PNG, EAPS<br />
                                        An max 5 MB
                                    </p>
                                </div>
                            </label>

                            <button
                                onClick={handleUploadDesign}
                                disabled={!selectedFile || isUploading || !editor?.canvas}
                                className="kds-upload-button"
                            >
                                {isUploading ? 'Uploading...' : 'Upload'}
                            </button>
                        </div>
                    </div>
                )
            }



            {
                selectedProduct?.productType === '3D' && (
                    <>
                        <hr className="kds-edit-divider" />
                        <TextureUploader />
                        <TextureControlsPanel />
                    </>
                )
            }

        </div>
    )
}

export default EditTab