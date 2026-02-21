import React, { useState, useMemo } from 'react';

export const Footer = () => {
    return (
        <footer>
            <div className="footer-section">
                <ul className="first-row">
                    <li><a href="#">Dashboard</a></li>
                    <li><a href="#">Services</a></li>
                </ul>
                <ul className="second-row">
                    <li><a href="#">Watch Videos</a></li>
                    <li><a href="#">Discord</a></li>
                </ul>
                <ul className="third-row">
                    <li><a href="#">Privacy Policy</a></li>
                    <li><a href="#">Terms & Conditions</a></li>
                </ul>
            </div>
            <p className="copyright">@ 2026 Dashboard | All Rights Reserved</p>
            <div className="footer-icons">
                <a href="#">🎮</a>
                <a href="#">🐦</a>
                <a href="#">💻</a>
                <a href="#">🏀</a>
            </div>
        </footer>
    )
};