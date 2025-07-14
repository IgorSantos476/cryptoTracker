import { Outlet, Link } from 'react-router-dom';
import Logo from '../../img/logo.svg';
import './header.css';

export function Header() {
    return(
        <>
            <nav>
                <span>
                    <Link to='/'>
                        <img src={Logo} alt="Logo-Coin" />
                    </Link>
                </span>
            </nav>

            <Outlet/>
        </>
    )
}