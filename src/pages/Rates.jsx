import { useState } from "react";
import Dropdown from "../components/Dropdown.jsx";
import Field from "../components/Field.jsx";
import { ErrorBox, Spinner } from "../components/Feedback.jsx";
import useDebounce from "../hooks/useDebounce.js";
import useFetch from "../hooks/useFetch.js";
import useStats from "../hooks/useStats.js";

// Third-party REST API (free, no key): live exchange rates with INR as the base
const API_URL = "https://open.er-api.com/v6/latest/INR";
const CURRENCIES = ["USD", "EUR", "GBP", "AED", "JPY", "AUD", "CAD", "SGD"];
const OPTIONS = CURRENCIES.map((code) => ({ value: code, label: code }));

const money = (value, currency) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency, maximumFractionDigits: 2 }).format(value);

export default function Rates() {
  const { data, loading, error, retry } = useFetch(API_URL);
  const { balance } = useStats();

  const [amount, setAmount] = useState("1000");
  const debouncedAmount = useDebounce(amount, 400);
  const [target, setTarget] = useState("USD");

  const apiFailed = error || (data && data.result !== "success");
  const rates = data?.rates;
  const numeric = Number(debouncedAmount);
  const converted = rates && rates[target] && numeric > 0 ? numeric * rates[target] : null;

  return (
    <section className="content-card">
      <div className="section-heading">
        <div>
          <h2>Currency rates</h2>
          <p>Live rates from the Open Exchange Rates API.</p>
        </div>
        {data?.time_last_update_utc && (
          <span className="muted-text rates-updated">Updated {data.time_last_update_utc.slice(0, 16)}</span>
        )}
      </div>

      {loading && <Spinner label="Fetching live rates…" />}

      {!loading && apiFailed && (
        <ErrorBox message={error || "The rates service returned an unexpected answer."} onRetry={retry} />
      )}

      {!loading && !apiFailed && rates && (
        <>
          <div className="rates-converter">
            <Field label="Amount in ₹" id="rate-amount" type="number" min="0" inputMode="decimal"
              value={amount} onChange={(e) => setAmount(e.target.value)} />
            <div className="field">
              <label>Convert to</label>
              <Dropdown label="Target currency" options={OPTIONS} value={target} onChange={setTarget} />
            </div>
            <div className="rates-result" aria-live="polite">
              {converted === null ? "Enter an amount above zero." : money(converted, target)}
            </div>
          </div>

          <h3 className="analytics-subheading">Your balance in other currencies</h3>
          <div className="rates-grid">
            {CURRENCIES.filter((code) => rates[code]).map((code) => (
              <div key={code} className="rate-tile">
                <span>1 ₹ = {rates[code].toFixed(4)} {code}</span>
                <strong>{money(balance * rates[code], code)}</strong>
              </div>
            ))}
          </div>
        </>
      )}
    </section>
  );
}
