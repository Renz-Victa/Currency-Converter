import React, { useState, useEffect, useRef } from 'react';
import Footer from './Footer';
import TrendChart from './TrendChart';

const API_BASE = 'https://api.frankfurter.app';

const FALLBACK_CURRENCIES = {
  USD: 'US Dollar',
  EUR: 'Euro',
  GBP: 'British Pound',
  JPY: 'Japanese Yen',
  AUD: 'Australian Dollar',
  CAD: 'Canadian Dollar',
  CHF: 'Swiss Franc',
  CNY: 'Chinese Yuan',
  HKD: 'Hong Kong Dollar',
  SGD: 'Singapore Dollar',
  INR: 'Indian Rupee',
  MXN: 'Mexican Peso',
  BRL: 'Brazilian Real',
  KRW: 'South Korean Won',
  NZD: 'New Zealand Dollar',
};

const FEATURES = [
  { num: '01', text: 'Live rates from the European Central Bank, updated daily.' },
  { num: '02', text: 'Swap currencies instantly with a single click.' },
  { num: '03', text: '30+ global currencies always at your fingertips.' },
  { num: '04', text: 'Historical trend analysis across 7D, 1M, 3M and 1Y windows.' },
];

export default function CurrencyConverter() {
  const [currencies, setCurrencies] = useState(FALLBACK_CURRENCIES);
  const [amount, setAmount] = useState('');
  const [from, setFrom] = useState('USD');
  const [to, setTo] = useState('EUR');
  const [result, setResult] = useState(null);
  const [rate, setRate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const debounceRef = useRef(null);

  useEffect(() => {
    fetch(`${API_BASE}/currencies`)
      .then(res => { if (!res.ok) throw new Error(); return res.json(); })
      .then(data => {
        if (data && Object.keys(data).length > 0) setCurrencies(data);
      })
      .catch(() => { });
  }, []);

  useEffect(() => {
    const num = parseFloat(amount);
    if (!amount || isNaN(num) || num <= 0) {
      setResult(null); setRate(null); setError(null); return;
    }
    if (from === to) {
      setResult(num); setRate(1); setError(null); return;
    }
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setLoading(true); setError(null);
      try {
        const [convRes, rateRes] = await Promise.all([
          fetch(`${API_BASE}/latest?amount=${num}&from=${from}&to=${to}`),
          fetch(`${API_BASE}/latest?from=${from}&to=${to}`),
        ]);
        if (!convRes.ok || !rateRes.ok) throw new Error();
        const [convData, rateData] = await Promise.all([convRes.json(), rateRes.json()]);
        if (!convData.rates?.[to] || !rateData.rates?.[to]) throw new Error();
        setResult(convData.rates[to]);
        setRate(rateData.rates[to]);
        setLastUpdated(new Date());
      } catch {
        setError('Could not fetch rates. Check your connection.');
        setResult(null); setRate(null);
      } finally {
        setLoading(false);
      }
    }, 400);
    return () => clearTimeout(debounceRef.current);
  }, [amount, from, to]);

  const handleSwap = () => {
    setFrom(to); setTo(from);
    setResult(null); setRate(null); setError(null);
  };

  const fmt = (val) => Number(val).toLocaleString(undefined, {
    minimumFractionDigits: 2, maximumFractionDigits: 4,
  });

  const currencyList = Object.entries(currencies);

  return (
    <div className="app">

      {/* ── Navbar ── */}
      <nav className="navbar">
        <a href="#" className="logo">fx.</a>
        <div className="nav-links">
          <a href="#converter" className="nav-item">Convert</a>
          <a href="#trends" className="nav-item">Trends</a>
          <a href="#features" className="nav-item">Features</a>
          <a href="#footer" className="nav-item">Contact</a>
        </div>
        <a href="#converter" className="nav-cta">Get Started</a>
      </nav>

      {/* ── Hero ── */}
      <section className="hero">
        <div className="hero-eyebrow">Live Exchange Rates</div>
        <h1 className="hero-title">
          Convert<br />
          <em>any currency.</em>
        </h1>
        <p className="hero-sub">
          Accurate, real-time exchange rates sourced from the European Central Bank.
          Simple, fast, and free.
        </p>
        <a href="#converter" className="btn-primary">Start Converting</a>

        <div className="hero-ticker" aria-hidden="true">
          <div className="ticker-track">
            {['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'CNY', 'SGD', 'INR',
              'USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'CNY', 'SGD', 'INR'].map((c, i) => (
                <span key={i} className="ticker-item">{c}</span>
              ))}
          </div>
        </div>
      </section>

      {/* ── Converter card ── */}
      <section className="converter-section" id="converter">
        <div className="section-label">The Converter</div>
        <h2 className="section-title">Exchange rates,<br />right now.</h2>

        <div className="card">
          <div className="card-field">
            <label htmlFor="amount" className="field-label">Amount</label>
            <input
              id="amount"
              type="number"
              className="field-input"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              placeholder="0.00"
              min="0"
              step="any"
            />
          </div>

          <div className="card-row">
            <div className="card-field">
              <label htmlFor="from-currency" className="field-label">From</label>
              <select
                id="from-currency"
                className="field-select"
                value={from}
                onChange={e => setFrom(e.target.value)}
              >
                {currencyList.map(([code, name]) => (
                  <option key={code} value={code}>{code} — {name}</option>
                ))}
              </select>
            </div>

            <button className="swap-btn" onClick={handleSwap} aria-label="Swap currencies">
              ⇌
            </button>

            <div className="card-field">
              <label htmlFor="to-currency" className="field-label">To</label>
              <select
                id="to-currency"
                className="field-select"
                value={to}
                onChange={e => setTo(e.target.value)}
              >
                {currencyList.map(([code, name]) => (
                  <option key={code} value={code}>{code} — {name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="result-box">
            {loading && (
              <div className="result-loading">
                <span className="spinner" /> Fetching rates…
              </div>
            )}
            {!loading && error && (
              <p className="result-error" role="alert">{error}</p>
            )}
            {!loading && !error && result !== null && (
              <div className="result-content">
                <div className="result-equation">
                  <span className="result-lhs">
                    {parseFloat(amount).toLocaleString()} <span className="result-code">{from}</span>
                  </span>
                  <span className="result-eq">=</span>
                  <span className="result-rhs">
                    {fmt(result)} <span className="result-code result-code--accent">{to}</span>
                  </span>
                </div>
                {rate !== null && (
                  <p className="result-rate">
                    1 {from} = {Number(rate).toFixed(4)} {to}
                    {lastUpdated && (
                      <span className="result-time"> · {lastUpdated.toLocaleTimeString()}</span>
                    )}
                  </p>
                )}
              </div>
            )}
            {!loading && !error && result === null && (
              <p className="result-placeholder">Your conversion will appear here</p>
            )}
          </div>

          <p className="card-source">
            Powered by{' '}
            <a href="https://www.frankfurter.app" target="_blank" rel="noreferrer" className="card-link">
              Frankfurter API
            </a>{' '}
            — ECB reference rates
          </p>
        </div>
      </section>

      {/* ── Trend analysis ── */}
      <TrendChart from={from} to={to} />

      {/* ── Features strip ── */}
      <section className="features-section" id="features">
        <div className="section-label">Why fx.</div>
        <h2 className="section-title">Built for clarity.</h2>
        <div className="features-grid">
          {FEATURES.map(f => (
            <div key={f.num} className="feature-item">
              <span className="feature-num">{f.num}</span>
              <p className="feature-text">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
