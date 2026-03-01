import React, { useState, useMemo } from 'react';

export const navbar = () => {
    return (
        <nav className="navbar">
            <ul>
                <li className="nav-item">
                    <a href="#">Dashboard</a>
                </li>
                <li className="nav-item">
                    <a href="#">Wdigets</a>
                </li>
                <li className="nav-item">
                    <button aria-expanded="false">Apps</button>
                    <ul className="sub-menu" aria-label="Apps">
                        <li><a href="#"></a></li>
                    </ul>
                </li>
            </ul>
        </nav>
    )
};

export default navbar;