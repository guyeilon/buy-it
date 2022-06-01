import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import {
	selectProductById,
	useAddNewProductMutation,
	useUpdateProductMutation,
} from '../../features/products/productsSlice';

import backgroundImg from '../../assets/product.webp';
import './Form.scss';

function Form({ onClose, currentId, setCurrentId }) {
	const [addProduct, { isLoading }] = useAddNewProductMutation();
	const [updateProduct, { isLoading: loading }] = useUpdateProductMutation();

	const [productData, setProductData] = useState({
		name: '',
		description: '',
		price: '',
		imageUrl: '',
	});

	const data = useSelector(state => selectProductById(state, currentId));

	const product = currentId ? data : null;
	console.log(productData);

	useEffect(() => {
		if (product) setProductData(product);
	}, [product]);

	const canAdd = Object.values(productData).every(Boolean) && !isLoading;
	const canEdit =
		[productData.name, productData.description, productData.price, productData.imageUrl].every(Boolean) && !loading;

	const clear = () => {
		onClose();
		setCurrentId(0);
		setProductData({
			name: '',
			description: '',
			price: '',
			imageUrl: '',
		});
	};

	const onSaveProductClicked = async () => {
		if (currentId === 0) {
			if (canAdd) {
				try {
					await addProduct(productData).unwrap();
					clear();
				} catch (err) {
					console.error('Failed to add the post', err);
				}
			}
		} else {
			if (canEdit) {
				try {
					console.log('hi');
					await updateProduct(productData).unwrap();
					clear();
				} catch (err) {
					console.error('Failed to update the post', err);
				}
			}
		}
	};

	return (
		<>
			<h3 className='app__modal-title'>{currentId ? 'Edit' : 'Add'} Product:</h3>
			<section className='app__product-card'>
				<div className='app__product-img'>
					<img
						src={
							currentId
								? productData.imageUrl
								: productData.imageUrl
								? productData.imageUrl
								: backgroundImg
						}
						alt=''
					/>
				</div>
				<form autoComplete='off' className=' app__product-form'>
					<div className='app__input'>
						<input
							className='app__input-field'
							type='text'
							id='ProductTitle'
							name='ProductTitle'
							value={productData.name}
							onChange={e => setProductData({ ...productData, name: e.target.value })}
							required
						/>
						<label className='app__input-label' htmlFor='productTitle'>
							Name:
						</label>
					</div>
					<div className='app__input'>
						<textarea
							className='app__input-field'
							id='ProductDescription'
							name='ProductDescription'
							value={productData.description}
							onChange={e => setProductData({ ...productData, description: e.target.value })}
							required
						/>
						<label className='app__input-label' htmlFor='ProductDescription'>
							Description:
						</label>
					</div>
					<div className='app__input'>
						<input
							type='number'
							className='app__input-field'
							id='ProductPrice'
							name='ProductPrice'
							value={productData.price}
							onChange={e => setProductData({ ...productData, price: e.target.value })}
							required
						/>
						<label className='app__input-label' htmlFor='ProductDescription'>
							Price:
						</label>
					</div>
					<div className='app__input'>
						<input
							className='app__input-field'
							id='ProductImage'
							name='ProductImage'
							value={productData.imageUrl}
							onChange={e => setProductData({ ...productData, imageUrl: e.target.value })}
							required
						/>
						<label className='app__input-label' htmlFor='ProductDescription'>
							Image Url:
						</label>
					</div>
					<div className='app__form-active'>
						<button
							className='app__form-save-button'
							type='button'
							onClick={onSaveProductClicked}
							disabled={currentId ? !canEdit : !canAdd}>
							Save
						</button>
					</div>
				</form>
			</section>
		</>
	);
}

export default Form;
