import React from 'react';
import ReactDOM from 'react-dom/client';
import './App.scss';
import './index.css';
import App from './App';
import { store } from './app/store';
import { Provider } from 'react-redux';
import { extendedApiSlice } from './features/products/productsSlice';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { salesApiSlice } from './features/sale/salesSlice';

store.dispatch(extendedApiSlice.endpoints.getProducts.initiate());
store.dispatch(salesApiSlice.endpoints.getSales.initiate());

ReactDOM.createRoot(document.getElementById('root')).render(
	<React.StrictMode>
		<Provider store={store}>
			<Router>
				<Routes>
					<Route path='/*' element={<App />} />
				</Routes>
			</Router>
		</Provider>
	</React.StrictMode>
);
