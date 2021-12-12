import React from 'react';
import './header.css';
import {Link} from 'react-router-dom';

function Header(props) {
    return (
        <nav className="header">
            <Link to="/" className="logo">{props.heading}</Link>
            <div className="header-right">
                <Link to="shopping-cart">Košík</Link>
                <Link to="/">Produkty</Link>
                <Link to="/admin">Admin</Link>
                {/* <a className="active" href="#products">Produkty</a>
                <a href="#cart">Košík</a> */}
            </div>
        </nav>
    );
}

export default Header;