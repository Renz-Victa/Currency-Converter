import React, { useState, useMemo } from 'react';
import Footer from './Footer';
import Navbar from './navbar';

export default function CurrencyConverter() {
  const rates = {
    USD: 1,
    EUR: 0.9,
    GBP: 0.8,
    JPY: 140
  };

  const [amount, setAmount] = useState(1);
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("EUR");

  const baseValue = useMemo(() => {
    return amount * rates[from];
  }, [amount, from]);

  const converted = baseValue / rates[to];

  return (
    <>
      <nav className="navbar">
        <ul>
          <li className="nav-item">
            <button aria-expanded="false">Dashboard</button>
          </li>
          <li className="nav-item">
            <button aria-expanded="false">Widgets</button>
          </li>
          <li className="nav-item">
            <button aria-expanded="false">Apps</button>
            <ul className="sub-menu" aria-label="Apps">
              <li><a href="#"></a></li>
              <li><a href="#"></a></li>
              <li><a href="#"></a></li>
            </ul>
          </li>
        </ul>
      </nav>

      <h1>CurrencyConverter</h1>
      <form>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
        />

        <select value={from} onChange={(e) => setFrom(e.target.value)}>
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
          <option value="GBP">GBP</option>
          <option value="JPY">JPY</option>
        </select>

        <select value={to} onChange={(e) => setTo(e.target.value)}>
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
          <option value="GBP">GBP</option>
          <option value="JPY">JPY</option>
        </select>

        <p>
          {converted.toFixed(2)} {to}
        </p>
      </form>
      <Footer />
    </>
  );
}
