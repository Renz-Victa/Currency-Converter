import React from 'react';

export default function Footer() {
    return (
        <footer className="footer" id="footer">
            <div className="footer-inner">
                <div className="footer-top">
                    <div className="footer-brand">
                        <span className="footer-logo">fx.</span>
                        <p className="footer-tagline">
                            Real-time currency conversions,<br />powered by ECB data.
                        </p>
                        <a href="#converter" className="btn-primary btn-sm">Start Converting</a>
                    </div>

                    <div className="footer-cola">
                        <div className="footer-col">
                            <p className="footer-heading">Navigate</p>
                            <ul className="footer-list">
                                <li><a href="#converter" className="footer-link">Convert</a></li>
                                <li><a href="#features" className="footer-link">Features</a></li>
                            </ul>
                        </div>
                        <div className="footer-col">
                            <p className="footer-heading">Resources</p>
                            <ul className="footer-list">
                                <li>
                                    <a href="https://www.frankfurter.app/docs" target="_blank" rel="noreferrer" className="footer-link">
                                        API Docs
                                    </a>
                                </li>
                                <li>
                                    <a href="https://www.ecb.europa.eu/stats/policy_and_exchange_rates/euro_reference_exchange_rates/html/index.en.html" target="_blank" rel="noreferrer" className="footer-link">
                                        ECB Rates
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div className="footer-col">
                            <p className="footer-heading">Legal</p>
                            <ul className="footer-list">
                                <li><a href="#" className="footer-link">Privacy Policy</a></li>
                                <li><a href="#" className="footer-link">Terms &amp; Conditions</a></li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="footer-button">
                    <p className="footer-copy">&copy; 2026 fx. All rights reserved</p>
                    <div className="footer-socials">
                        <a href="#" className="social-pill" aria-label="Twitter">X</a>
                        <a href="#" className="social-pill" aria-label="Github">Gh</a>
                        <a href="#" className="social-pill" aria-label="Discord">DC</a>

                    </div>
                </div>
            </div>
        </footer>
    );
}