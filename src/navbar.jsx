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
                </li>
            </ul>
        </nav>
    )
};

export default navbar;