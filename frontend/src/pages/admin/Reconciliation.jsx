import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";

const CURRENCIES = ["VE", "SVE", "GEM", "TOKEN", "SPIN"];

export default function Reconciliation() {
  const [userId, setUserId] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setResult(null);

    const trimmedUserId = userId.trim();

    if (!trimmedUserId) {
      setError("User ID is required.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.get(
        `/admin/reconciliation/${trimmedUserId}`
      );

      setResult(response.data?.data || null);
    } catch (err) {
      setError(
        err.response?.data?.error?.message ||
          "Unable to reconcile wallet."
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
          <h1>Wallet Reconciliation</h1>
          <p>
            Compare wallet balances against the transaction
            ledger.
          </p>
        </div>

        <Link to="/admin">Back to Dashboard</Link>
      </div>

      <section className="admin-operation-card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="reconciliation-user-id">
              User ID
            </label>

            <input
              id="reconciliation-user-id"
              type="text"
              value={userId}
              onChange={(event) => setUserId(event.target.value)}
              placeholder="Enter user ID"
              required
            />
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <button type="submit" disabled={loading}>
            {loading
              ? "Reconciling..."
              : "Run Reconciliation"}
          </button>
        </form>
      </section>

      {result && (
        <section className="reconciliation-results">
          <div className="reconciliation-header">
            <div>
              <h2>Reconciliation Result</h2>

              <p>
                User ID: <strong>{result.userId}</strong>
              </p>

              <p>
                Wallet ID: <strong>{result.walletId}</strong>
              </p>
            </div>

            <div
              className={`reconciliation-status ${
                result.reconciled
                  ? "reconciled"
                  : "mismatch"
              }`}
            >
              {result.reconciled
                ? "RECONCILED"
                : "MISMATCH"}
            </div>
          </div>

          <div className="reconciliation-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Currency</th>
                  <th>Wallet Balance</th>
                  <th>Ledger Credits</th>
                  <th>Ledger Debits</th>
                  <th>Ledger Balance</th>
                  <th>Difference</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {CURRENCIES.map((currency) => {
                  const data =
                    result.currencies?.[currency];

                  if (!data) {
                    return (
                      <tr key={currency}>
                        <td>{currency}</td>
                        <td colSpan="6">
                          No reconciliation data
                        </td>
                      </tr>
                    );
                  }

                  return (
                    <tr key={currency}>
                      <td>
                        <strong>{currency}</strong>
                      </td>

                      <td>
                        {Number(
                          data.walletBalance
                        ).toLocaleString()}
                      </td>

                      <td>
                        {Number(
                          data.ledgerCredits
                        ).toLocaleString()}
                      </td>

                      <td>
                        {Number(
                          data.ledgerDebits
                        ).toLocaleString()}
                      </td>

                      <td>
                        {Number(
                          data.ledgerBalance
                        ).toLocaleString()}
                      </td>

                      <td>
                        {Number(
                          data.difference
                        ).toLocaleString()}
                      </td>

                      <td>
                        <span
                          className={`status-badge status-${
                            data.status.toLowerCase()
                          }`}
                        >
                          {data.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}