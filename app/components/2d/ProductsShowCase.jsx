import React from 'react'
import { useRouter } from "next/navigation";
import './ProductsShowCase.css';

const ProductsShowCase = ({ products }) => {

    const router = useRouter();
    return (
        <>
            <div className="kds-header">
                <div className="kds-header-container">
                    <div className="kds-logo-section">
                        <div className="kds-logo-wrapper">
                            <img src="https://res.cloudinary.com/dd9tagtiw/image/upload/v1749337982/Customizer_w0ruf6.png" alt="" />
                            <button
                                className="kds-menu-button"
                                aria-label="Toggle Sidebar"
                            >
                                <svg className="kds-menu-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>
                        </div>
                    </div>
                    <img src="https://res.cloudinary.com/dd9tagtiw/image/upload/v1749338383/Buttons_klifkp.png" alt="" />
                </div>
            </div>

            <div className="kds-main-container">
                <div className="kds-content-wrapper">
                    <div className="kds-products-grid">
                        {products.map((product) => (
                            <div
                                key={product.id}
                                className="kds-product-card"
                                onClick={() => router.push(`/customizer/${product.id}`)}
                            >
                                <img src={product.image} alt={product.description} className="kds-product-image" />
                                <div className="kds-product-info">
                                    <p className="kds-product-title kds-reset">{product.description}</p>
                                    <p className="kds-product-detail kds-reset">Size: {product.size}</p>
                                    <p className="kds-product-detail kds-reset">Color: {product.color}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}

export default ProductsShowCase