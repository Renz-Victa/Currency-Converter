import React, { useState, useMemo } from 'react';

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
  );
}
