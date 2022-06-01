import { NavLink } from 'react-router-dom';

import './Navbar.scss';

const NavBar = () => {
	return (
		<nav className='app__navbar'>
			<div className='app__navbar-logo'>buy-it.</div>

			<ul className='app__navbar-links'>
				{['Admin', 'Home', 'Stats'].map(item => (
					<li className='app__flex p-text' key={`link-${item}`}>
						<div />
						<NavLink
							to={item === 'Home' ? '/' : `/${item}`}
							className={({ isActive }) => (isActive ? 'active' : 'inactive')}>
							{item}
						</NavLink>
					</li>
				))}
			</ul>
		</nav>
	);
};

export default NavBar;
