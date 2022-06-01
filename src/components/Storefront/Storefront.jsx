import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getTotals } from '../../features/cart/cartSlice';
import { selectProductsIds, useGetProductsQuery } from '../../features/products/productsSlice';

import Cart from '../Cart/Cart';
import ProductCard from '../ProductCard/ProductCard';

import './Storefront.scss';

function Storefront() {
	const { data: products, isLoading, isSuccess, isError, error } = useGetProductsQuery();
	const orderProductsIds = useSelector(selectProductsIds);

	const { cartTotalQuantity } = useSelector(state => state.cart);
	const cart = useSelector(state => state.cart);

	const dispatch = useDispatch();

	const [isCheckedOut, setIsCheckedOut] = useState(false);
	const [open, setOpen] = useState(false);

	useEffect(() => {
		dispatch(getTotals());
	}, [cart, dispatch]);

	let content;
	if (isLoading) {
		content = <p>Loading...</p>;
	} else if (isSuccess) {
		content = orderProductsIds.map(productId => (
			<ProductCard setIsCheckedOut={setIsCheckedOut} productId={productId} key={productId} />
		));
	} else if (isError) {
		content = <p>{error}</p>;
	}
	return (
		<div className='app__storefront-container'>
			<div className='app__cart-button'>
				<button onClick={() => setOpen(!open)}>
					<h4>Shopping Cart</h4>
					<div className='app__shopping-bag'>
						<svg
							xmlns='http://www.w3.org/2000/svg'
							width='35'
							height='35'
							fill='currentColor'
							className='bi bi-handbag-fill'
							viewBox='0 0 16 16'>
							<path d='M8 1a2 2 0 0 0-2 2v2H5V3a3 3 0 1 1 6 0v2h-1V3a2 2 0 0 0-2-2zM5 5H3.36a1.5 1.5 0 0 0-1.483 1.277L.85 13.13A2.5 2.5 0 0 0 3.322 16h9.355a2.5 2.5 0 0 0 2.473-2.87l-1.028-6.853A1.5 1.5 0 0 0 12.64 5H11v1.5a.5.5 0 0 1-1 0V5H6v1.5a.5.5 0 0 1-1 0V5z' />
						</svg>
						<span className='app__bag-quantity'>
							<span>{cartTotalQuantity}</span>
						</span>
					</div>
				</button>
			</div>
			<div className='app__storefront '>
				{open && (
					<Cart
						isCheckedOut={isCheckedOut}
						setIsCheckedOut={setIsCheckedOut}
						onClose={() => setOpen(!open)}
					/>
				)}
				{content}
			</div>
		</div>
	);
}

export default Storefront;
