import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectProductById } from '../../features/products/productsSlice';
import './ProductCard.scss';
import { addToCart } from '../../features/cart/cartSlice';

function ProductCard({ productId, setIsCheckedOut }) {
	const dispatch = useDispatch();
	const product = useSelector(state => selectProductById(state, productId));
	const handleAddToCart = product => {
		setIsCheckedOut(false);
		dispatch(addToCart(product));
	};

	return (
		<div className='app__product-Card'>
			<h3>{product.name.substring(0, 16)}</h3>
			<div className='app__img-container'>
				<img src={product.imageUrl} alt={product.name}></img>
			</div>
			<div className='app__product-desc'>
				<span>{product.description.substring(0, 40)}...</span>
				<span className='price'>${product.price}</span>
			</div>
			<button onClick={() => handleAddToCart(product)}>Add To Cart</button>
		</div>
	);
}

export default ProductCard;
