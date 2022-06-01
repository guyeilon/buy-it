import React, { useState } from 'react';

import './ProductsList.scss';

import { selectProductsIds, useGetProductsQuery } from '../../features/products/productsSlice';

import Product from '../Product/Product';
import Modal from '../Modal/Modal';
import { useSelector } from 'react-redux';

const ProductsList = () => {
	const [currentId, setCurrentId] = useState(0);
	const [isOpen, setIsOpen] = useState(false);
	const { data: products, isLoading, isSuccess, isError, error } = useGetProductsQuery();
	console.log(products);

	const orderProductsIds = useSelector(selectProductsIds);
	// console.log(orderProductsIds);

	const titles = (
		<div>
			<div className='app__products-titles'>
				<h3 className='product-title'>Product</h3>
				<h3 className='price'>Price</h3>
				<h3 className='edit'>Edit</h3>
			</div>
		</div>
	);

	let content;
	if (isLoading) {
		content = <p>Loading...</p>;
	} else if (isSuccess) {
		content = orderProductsIds.map(productId => (
			<Product
				productId={productId}
				key={productId}
				open={isOpen}
				setIsOpen={setIsOpen}
				onClose={() => setIsOpen(false)}
				currentId={currentId}
				setCurrentId={setCurrentId}
			/>
		));
	} else if (isError) {
		content = <p>{error}</p>;
	}

	const handleCloseModal = () => {
		setIsOpen(false);
		setCurrentId(0);
	};

	return (
		<main className='app__products-container'>
			<div className='app__table-container'>
				<div className='app__add-product'>
					<button onClick={() => setIsOpen(true)}>Add</button>
				</div>
				{titles}
				{content}
				{isOpen && (
					<Modal
						open={setIsOpen}
						onClose={handleCloseModal}
						currentId={currentId}
						setCurrentId={setCurrentId}
					/>
				)}
			</div>
		</main>
	);
};

export default ProductsList;
