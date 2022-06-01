import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import ProductsList from './components/ProductsList/ProductsList';
import Stats from './components/Stats/Stats';
import Storefront from './components/Storefront/Storefront';

function App() {
	return (
		<Routes>
			<Route path='/' element={<Layout />}>
				<Route path='Admin' element={<ProductsList />} />
				<Route path='/' element={<Storefront />} />
				<Route path='Stats' element={<Stats />} />
			</Route>
		</Routes>
	);
}

export default App;
