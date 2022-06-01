import React from 'react';
import Modal from '../Modal/Modal';
import './Product.scss';

import { selectProductById, useDeleteProductMutation } from '../../features/products/productsSlice';
import { useSelector } from 'react-redux';

function Product({ productId, setIsOpen, isOpen, setCurrentId, currentId }) {
	const [deleteProduct] = useDeleteProductMutation();
	// console.log(productId);

	const product = useSelector(state => selectProductById(state, productId));
	// console.log(product);

	const handleEditClick = () => {
		setCurrentId(productId);
		setIsOpen(true);
	};
	const hardCodedProductsIds = [
		'629732ce515248c90cd96e30',
		'629625f5121c0f07b951de80',
		'62962512121c0f07b951de7d',
		'629623a2121c0f07b951de7a',
		'6296223a121c0f07b951de69',
		'62961ddd121c0f07b951de65',
		'62961d27121c0f07b951de62',
		'62961b5d121c0f07b951de5f',
		'62961a6b121c0f07b951de5c',
		'629616f3121c0f07b951de56',
		'6296169a121c0f07b951de53',
		'629615c8121c0f07b951de50',
		'629531aca4c785b97009b7dc',
		'62953166a4c785b97009b7d9',
		'6295312aa4c785b97009b7d6',
	];

	const handleDeleteClick = async () => {
		const result = hardCodedProductsIds.find(id => id === productId);
		if (result) {
			console.log('can not delete hard coded product!');
			return;
		}

		try {
			await deleteProduct({ id: productId }).unwrap();
		} catch (err) {
			console.error('Failed to delete the product', err);
		}
	};
	return (
		<div className='app__product-item'>
			<div className='app__product-details '>
				<div className='app__img-wrapper'>
					<img src={product.imageUrl} alt={product.name} className='app__product-image' />
				</div>
				<div className='app__product-dec-container'>
					<h3>{product.name}</h3>
					<p>{product.description}</p>
				</div>
			</div>
			<h3 className='app__product-price'>${product.price}</h3>
			<div className='app__product-edit'>
				<button className='button__edit-product' onClick={handleEditClick}>
					Edit
				</button>
				<button className='button__delete-product' onClick={handleDeleteClick}>
					Delete
				</button>
			</div>
			{isOpen && (
				<Modal
					open={setIsOpen}
					onClose={() => setIsOpen(false)}
					currentId={currentId}
					setCurrentId={setCurrentId}
				/>
			)}
		</div>
	);
}

export default Product;
