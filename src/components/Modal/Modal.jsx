import React from 'react';
import Form from '../Form/Form';

import './Modal.scss';

function Modal({ onClose, currentId, setCurrentId }) {
	return (
		<div className='app__modal-background' onClick={onClose}>
			<div
				className='app__modal-container'
				onClick={e => {
					e.stopPropagation();
				}}>
				<div className='app__modal-close' onClick={onClose}>
					X
				</div>
				<Form onClose={onClose} currentId={currentId} setCurrentId={setCurrentId} />
			</div>
		</div>
	);
}

export default Modal;
