"use client"

import React from 'react'
import './RightSmallPreview.css'

const RightSmallPreview = ({currentProduct}) => {

    return (
        <div className='kds-rsp-container'>
            <div className='kds-rsp-item'>
                <div className='kds-rsp-card'>
                    <img className='kds-rsp-image' src={currentProduct?.image || '/placeholder-image.jpg'} alt="front" />
                </div>
                <p className='kds-rsp-caption'>Front</p>
            </div>

            <div className='kds-rsp-item'>
                <div className='kds-rsp-card'>
                    <img className='kds-rsp-image' src={currentProduct?.image || '/placeholder-image.jpg'} alt="front" />
                </div>
                <p className='kds-rsp-caption'>Back</p>
            </div>
        </div>
    )
}

export default RightSmallPreview