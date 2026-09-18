import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";

const CURRENCIES = [
  "VE",
  "SVE",
  "GEM",
  "TOKEN",
  "SPIN",
];

export default function AdminWallet() {
  const [form, setForm] = useState({
    userId: "",
    currency: "VE",
    amount: "",
    description: "",
  });

  const [operation, setOperation] = useState("credit");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setMessage("");
    setError("");

    if (!form.userId.trim()) {
      setError("User ID is required.");
      return;
    }

    const amount = Number(form.amount);

    if (!Number.isInteger(amount) || amount <= 0) {
      setError("Amount must be a positive integer.");
      return;
    }

    if (!form.description.trim()) {
      setError("Description is required.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post(
        `/admin/wallet/${operation}`,
        {
          userId: form.userId.trim(),
          currency: form.currency,
          amount,
          description: form.description.trim(),
        }
      );

      setMessage(
        `Wallet ${operation} completed successfully.`
      );

      console.log("Admin wallet operation:", response.data);

      setForm((current) => ({
        ...current,
        userId: "",
        amount: "",
        description: "",
      }));
    } catch (err) {
      setError(
        err.response?.data?.error?.message ||
          `Unable to ${operation} wallet.`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <p className="page-eyebrow">ADMIN</p>
          <h1>Wallet Operations</h1>
          <p>
            Perform authorized wallet credits and debits.
          </p>
        </div>

        <Link to="/admin">
          Back to Dashboard
        </Link>
      </div>

      <div className="admin-operation-layout">
        <section className="admin-operation-card">
          <div className="operation-toggle">
            <button
              type="button"
              className={
                operation === "credit" ? "active" : ""
              }
              onClick={() => {
                setOperation("credit");
                setMessage("");
                setError("");
              }}
            >
              Credit Wallet
            </button>

            <button
              type="button"
              className={
                operation === "debit" ? "active" : ""
              }
              onClick={() => {
                setOperation("debit");
                setMessage("");
                setError("");
              }}
            >
              Debit Wallet
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="userId">
                User ID
              </label>

              <input
                id="userId"
                name="userId"
                type="text"
                value={form.userId}
                onChange={handleChange}
                placeholder="Enter user ID"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="currency">
                Currency
              </label>

              <select
                id="currency"
                name="currency"
                value={form.currency}
                onChange={handleChange}
              >
                {CURRENCIES.map((currency) => (
                  <option
                    key={currency}
                    value={currency}
                  >
                    {currency}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="amount">
                Amount
              </label>

              <input
                id="amount"
                name="amount"
                type="number"
                min="1"
                step="1"
                value={form.amount}
                onChange={handleChange}
                placeholder="Enter amount"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">
                Description
              </label>

              <textarea
                id="description"
                name="description"
                rows="4"
                value={form.description}
                onChange={handleChange}
                placeholder="Reason for this wallet operation"
                required
              />
            </div>

            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            {message && (
              <div className="success-message">
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="admin-submit-button"
            >
              {loading
                ? "Processing..."
                : operation === "credit"
                  ? "Credit Wallet"
                  : "Debit Wallet"}
            </button>
          </form>
        </section>

        <section className="admin-info-card">
          <h2>Wallet Operation Rules</h2>

          <ul>
            <li>
              Only authenticated administrators can perform
              wallet operations.
            </li>

            <li>
              Every operation creates a wallet ledger
              transaction.
            </li>

            <li>
              The backend validates the target user,
              currency and amount.
            </li>

            <li>
              The frontend does not directly modify wallet
              balances.
            </li>

            <li>
              A description is recorded for auditability.
            </li>
          </ul>

          <div className="operation-warning">
            <strong>Administrative action</strong>
            <p>
              Wallet credits and debits affect real wallet
              balances. Verify the user ID and amount before
              submitting.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}