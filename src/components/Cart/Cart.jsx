import React, { useState } from 'react';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { clearCart, decreaseCart, getTotals, IncreaseCart, removeFromCart } from '../../features/cart/cartSlice';
import { useAddStatsToProductMutation } from '../../features/products/productsSlice';
import { selectAllSales, useAddNewSaleMutation, useUpdateSaleMutation } from '../../features/sale/salesSlice';

import './Cart.scss';
import { format } from 'date-fns';

function Cart({ setIsCheckedOut, isCheckedOut }) {
	const cart = useSelector(state => state.cart);
	const dispatch = useDispatch();
	const [addStats, { isLoading }] = useAddStatsToProductMutation();
	const [addSale] = useAddNewSaleMutation();
	const [updateSale] = useUpdateSaleMutation();

	const [saleData, setSaleData] = useState({
		totalSale: '',
	});

	const allSales = useSelector(selectAllSales);

	useEffect(() => {
		dispatch(getTotals());
	}, [cart, dispatch]);

	const handleDecreaseCart = cartItem => {
		dispatch(decreaseCart(cartItem));
	};
	const handleIncreaseCart = cartItem => {
		dispatch(IncreaseCart(cartItem));
	};
	const handleRemoveFromCart = cartItem => {
		dispatch(removeFromCart(cartItem));
	};
	const handleClearCart = () => {
		dispatch(clearCart());
	};

	useEffect(() => {
		setSaleData({ totalSale: cart.cartTotalAmount });
	}, [cart.cartTotalAmount]);

	const isDate = sale => {
		return sale.date === format(new Date(), 'MM/dd/yyyy');
	};

	const handleCheckedOut = async () => {
		setIsCheckedOut(true);
		dispatch(clearCart());
		addCartToProductStats(cart);

		if (allSales.length === 0 || !allSales.find(isDate)) {
			try {
				console.log(cart.cartTotalAmount);
				console.log(saleData);
				await addSale(saleData).unwrap();
			} catch (err) {
				console.error('Failed to add the sale', err);
			}
		} else {
			try {
				console.log(saleData.totalSale);
				const sumSalesPerDay = allSales.find(isDate).totalSale + saleData.totalSale;
				console.log(sumSalesPerDay);
				const saleIdToUpdate = allSales.find(isDate)._id;
				console.log(saleIdToUpdate);
				await updateSale({ saleId: saleIdToUpdate, totalSale: sumSalesPerDay }).unwrap();
			} catch (err) {
				console.error('Failed to update the sale', err);
			}
		}
	};

	const addCartToProductStats = cart => {
		const { cartItems } = cart;
		cartItems.map(cartItem => {
			const newOrder = cartItem.cartQuantity;
			const newUniqueOrder = newOrder ? 1 : 0;
			const statA = cartItem.stats.order + newOrder;
			const statB = cartItem.stats.uniqueOrder + newUniqueOrder;

			const stats = {
				order: statA,
				uniqueOrder: statB,
			};
			addStats({ productId: cartItem._id, stats });
		});
	};

	let content;
	if (cart.cartItems.length === 0 && !isCheckedOut) {
		content = (
			<div className='app__cart-empty'>
				<p>Your cart is currently empty</p>
			</div>
		);
	} else {
		content = (
			<>
				<div className='app__cart-titles'>
					<h3>Product</h3>
					<h3 className='grid-item-right'>Total</h3>
				</div>
				<div className='app__cart-items'>
					{cart.cartItems?.map(cartItem => (
						<div className='app__cart-item' key={cartItem._id}>
							<div className='app__cart-item-name'>
								<p>{cartItem.name}</p>
								<button onClick={() => handleRemoveFromCart(cartItem)}>Remove</button>
							</div>
							<div className='app__cart-item-quantity-wrapper'>
								<div className='app__cart-item-quantity'>
									<button onClick={() => handleDecreaseCart(cartItem)}>-</button>
									<div className='count'>{cartItem.cartQuantity}</div>
									<button onClick={() => handleIncreaseCart(cartItem)}>+</button>
								</div>
								<div className='app__cart-item-total-price grid-item-right'>
									${cartItem.price * cartItem.cartQuantity}
								</div>
							</div>
						</div>
					))}
				</div>
				<div className='app__cart-summary'>
					<div className='app__clear-cart'>
						<div></div>
						<button onClick={() => handleClearCart()}>Clear Cart</button>
					</div>
					<div className='app__cart-checkout'>
						<div className='subtotal'>
							<span>Subtotal</span>
							<span className='amount grid-item-right'>${cart.cartTotalAmount}</span>
						</div>
						<p>Taxes and shipping calculated at checkout</p>
						<button onClick={() => handleCheckedOut()}>Check out</button>
					</div>
				</div>
			</>
		);
		if (isCheckedOut) {
			content = (
				<div className='app__cart-empty'>
					<p>Congratulations! We will process your order immediately.</p>
				</div>
			);
		}
	}

	return (
		<div
			className='app__cart-container'
			onClick={e => {
				e.stopPropagation();
			}}>
			{content}
		</div>
	);
}

export default Cart;
