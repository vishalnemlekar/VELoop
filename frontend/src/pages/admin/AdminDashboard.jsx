import { useEffect, useState } from "react";
import api from "../../services/api";
const STATUS_CARDS = [
  { status: "PENDING", label: "Pending Withdrawals" },
  { status: "PROCESSING", label: "Processing" },
  { status: "APPROVED", label: "Approved" },
  { status: "REJECTED", label: "Rejected" },
  { status: "CANCELLED", label: "Cancelled" },
];

export default function AdminDashboard() {
  const [counts, setCounts] = useState({
    PENDING: 0,
    PROCESSING: 0,
    APPROVED: 0,
    REJECTED: 0,
    CANCELLED: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true);
        setError("");

        const results = await Promise.all(
          STATUS_CARDS.map(async ({ status }) => {
            const response = await api.get("/admin/withdrawals", {
              params: {
                status,
                page: 1,
                limit: 1,
              },
            });

            return {
              status,
              count:
                response.data?.pagination?.total ??
                response.data?.total ??
                0,
            };
          })
        );

        const nextCounts = { ...counts };

        results.forEach(({ status, count }) => {
          nextCounts[status] = count;
        });

        setCounts(nextCounts);
      } catch (err) {
        setError(
          err.response?.data?.error?.message ||
            "Unable to load admin dashboard."
        );
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  return (
    <div className="admin-dashboard">
      <div className="admin-dashboard-header">
        <div>
          <p className="page-eyebrow">ADMIN</p>
          <h1>Admin Dashboard</h1>
          <p>Manage withdrawals, wallet operations and reconciliation.</p>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <section className="admin-stats-grid">
        {STATUS_CARDS.map(({ status, label }) => (
          <div className="admin-stat-card" key={status}>
            <span>{label}</span>

            <strong>
              {loading ? "—" : counts[status]}
            </strong>

            <small>{status}</small>
          </div>
        ))}
      </section>

      <section className="admin-actions">
        <div className="admin-action-card">
          <h2>Withdrawal Management</h2>
          <p>
            Review pending withdrawals and manage their status.
          </p>

          <a href="/admin/withdrawals">
            Manage Withdrawals
          </a>
        </div>

        <div className="admin-action-card">
          <h2>Wallet Operations</h2>
          <p>
            Perform authorized wallet credits and debits.
          </p>

          <a href="/admin/wallet">
            Wallet Operations
          </a>
        </div>

        <div className="admin-action-card">
          <h2>Reconciliation</h2>
          <p>
            Compare wallet balances against the transaction ledger.
          </p>

          <a href="/admin/reconciliation">
            Open Reconciliation
          </a>
        </div>
      </section>
    </div>
  );
}