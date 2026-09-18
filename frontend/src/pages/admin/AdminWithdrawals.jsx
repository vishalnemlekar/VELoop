import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";

const STATUSES = [
  "ALL",
  "PENDING",
  "PROCESSING",
  "APPROVED",
  "REJECTED",
  "CANCELLED",
];

const formatDate = (date) => {
  if (!date) return "-";

  return new Date(date).toLocaleString();
};

const StatusBadge = ({ status }) => (
  <span className={`status-badge status-${status.toLowerCase()}`}>
    {status}
  </span>
);

export default function AdminWithdrawals() {
  const [withdrawals, setWithdrawals] = useState([]);
  const [status, setStatus] = useState("PENDING");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });

  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const [error, setError] = useState("");

  const loadWithdrawals = async () => {
    try {
      setLoading(true);
      setError("");

      const params = {
        page: pagination.page,
        limit: pagination.limit,
      };

      if (status !== "ALL") {
        params.status = status;
      }

      const response = await api.get("/admin/withdrawals", {
        params,
      });

      const result = response.data?.data;

      setWithdrawals(result?.withdrawals || []);
      setPagination(
        result?.pagination || {
          page: 1,
          limit: 20,
          total: 0,
          totalPages: 0,
        }
      );
    } catch (err) {
      setError(
        err.response?.data?.error?.message ||
          "Unable to load withdrawals."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWithdrawals();
  }, [status, pagination.page]);

  const changeStatus = async (withdrawalId, action, body = {}) => {
    try {
      setProcessingId(withdrawalId);
      setError("");

      await api.post(
        `/admin/withdrawals/${withdrawalId}/${action}`,
        body
      );

      await loadWithdrawals();
    } catch (err) {
      setError(
        err.response?.data?.error?.message ||
          `Unable to ${action} withdrawal.`
      );
    } finally {
      setProcessingId(null);
    }
  };

  const handleApprove = async (withdrawalId) => {
    const reviewNote = window.prompt(
      "Review note (optional):"
    );

    await changeStatus(
      withdrawalId,
      "approve",
      reviewNote?.trim()
        ? { reviewNote: reviewNote.trim() }
        : {}
    );
  };

  const handleReject = async (withdrawalId) => {
    const rejectionReason = window.prompt(
      "Enter rejection reason:"
    );

    if (!rejectionReason?.trim()) {
      return;
    }

    const reviewNote = window.prompt(
      "Review note (optional):"
    );

    await changeStatus(
      withdrawalId,
      "reject",
      {
        rejectionReason: rejectionReason.trim(),
        ...(reviewNote?.trim()
          ? { reviewNote: reviewNote.trim() }
          : {}),
      }
    );
  };

  const handleCancel = async (withdrawalId) => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this withdrawal?"
    );

    if (!confirmed) {
      return;
    }

    const reviewNote = window.prompt(
      "Review note (optional):"
    );

    await changeStatus(
      withdrawalId,
      "cancel",
      reviewNote?.trim()
        ? { reviewNote: reviewNote.trim() }
        : {}
    );
  };

  const handleStatusChange = (nextStatus) => {
    setStatus(nextStatus);
    setPagination((current) => ({
      ...current,
      page: 1,
    }));
  };

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <p className="page-eyebrow">ADMIN</p>
          <h1>Withdrawal Management</h1>
          <p>
            Review and process user withdrawal requests.
          </p>
        </div>

        <Link to="/admin">
          Back to Dashboard
        </Link>
      </div>

      <div className="admin-status-tabs">
        {STATUSES.map((item) => (
          <button
            key={item}
            type="button"
            className={status === item ? "active" : ""}
            onClick={() => handleStatusChange(item)}
          >
            {item}
          </button>
        ))}
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <div className="admin-table-container">
        {loading ? (
          <div className="admin-empty-state">
            Loading withdrawals...
          </div>
        ) : withdrawals.length === 0 ? (
          <div className="admin-empty-state">
            No withdrawals found.
          </div>
        ) : (
          <>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Withdrawal ID</th>
                  <th>User ID</th>
                  <th>Method</th>
                  <th>VE Amount</th>
                  <th>Payout</th>
                  <th>Status</th>
                  <th>Requested</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {withdrawals.map((withdrawal) => {
                  const isProcessing =
                    processingId === withdrawal.withdrawalId;

                  return (
                    <tr key={withdrawal.withdrawalId}>
                      <td>
                        <strong>
                          {withdrawal.withdrawalId}
                        </strong>
                      </td>

                      <td>
                        {withdrawal.userId}
                      </td>

                      <td>
                        {withdrawal.method}
                      </td>

                      <td>
                        {Number(
                          withdrawal.currencyAmount || 0
                        ).toLocaleString()}{" "}
                        {withdrawal.currency}
                      </td>

                      <td>
                        {withdrawal.payoutAmount}{" "}
                        {withdrawal.payoutCurrency}
                      </td>

                      <td>
                        <StatusBadge
                          status={withdrawal.status}
                        />
                      </td>

                      <td>
                        {formatDate(
                          withdrawal.requestedAt ||
                            withdrawal.createdAt
                        )}
                      </td>

                      <td>
                        <div className="admin-action-buttons">
                          {withdrawal.status === "PENDING" && (
                            <>
                              <button
                                type="button"
                                disabled={isProcessing}
                                onClick={() =>
                                  handleApprove(
                                    withdrawal.withdrawalId
                                  )
                                }
                              >
                                {isProcessing
                                  ? "Processing..."
                                  : "Approve"}
                              </button>

                              <button
                                type="button"
                                disabled={isProcessing}
                                onClick={() =>
                                  handleReject(
                                    withdrawal.withdrawalId
                                  )
                                }
                              >
                                Reject
                              </button>

                              <button
                                type="button"
                                disabled={isProcessing}
                                onClick={() =>
                                  handleCancel(
                                    withdrawal.withdrawalId
                                  )
                                }
                              >
                                Cancel
                              </button>
                            </>
                          )}

                          {withdrawal.status === "PROCESSING" && (
                            <>
                              <button
                                type="button"
                                disabled={isProcessing}
                                onClick={() =>
                                  handleApprove(
                                    withdrawal.withdrawalId
                                  )
                                }
                              >
                                Approve
                              </button>

                              <button
                                type="button"
                                disabled={isProcessing}
                                onClick={() =>
                                  handleReject(
                                    withdrawal.withdrawalId
                                  )
                                }
                              >
                                Reject
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            <div className="admin-pagination">
              <button
                type="button"
                disabled={
                  pagination.page <= 1 || loading
                }
                onClick={() =>
                  setPagination((current) => ({
                    ...current,
                    page: current.page - 1,
                  }))
                }
              >
                Previous
              </button>

              <span>
                Page {pagination.page} of{" "}
                {Math.max(pagination.totalPages, 1)}
              </span>

              <button
                type="button"
                disabled={
                  pagination.page >=
                    pagination.totalPages ||
                  loading
                }
                onClick={() =>
                  setPagination((current) => ({
                    ...current,
                    page: current.page + 1,
                  }))
                }
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}