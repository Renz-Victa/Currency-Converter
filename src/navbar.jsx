import React, { useState, useMemo } from 'react';

export const navbar = () => {
    return (
        <nav className="navbar">
            <ul>
                <li className="nav-item">
                    <a href="#">Dashboard</a>
                </li>
            </ul>
        </nav>
    )
};

export default navbar;