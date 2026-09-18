import { useEffect, useState } from "react";
import { useAuth } from "../context/useAuth";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [wallet, setWallet] = useState(null);
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [transactions, setTransactions] = useState([]);
    const [transactionLoading, setTransactionLoading] = useState(true);
    const [transactionPage, setTransactionPage] = useState(1);
const [transactionLimit, setTransactionLimit] = useState(10);
const [transactionPagination, setTransactionPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
});
    const [withdrawals, setWithdrawals] = useState([]);
const [withdrawalLoading, setWithdrawalLoading] = useState(true);

    useEffect(() => {
        const fetchWalletData = async () => {
            try {
                setLoading(true);
                setError("");

               const [
  walletResponse,
  summaryResponse,
  transactionsResponse,
  withdrawalsResponse,
] = await Promise.all([
  api.get("/wallet"),
  api.get("/wallet/summary"),
  api.get(
    `/wallet/transactions?page=${transactionPage}&limit=${transactionLimit}`
),
  api.get("/withdrawals"),
]);

              const transactionData = transactionsResponse.data.data;

setTransactions(transactionData.transactions || []);

setTransactionPagination(
    transactionData.pagination || {
        page: transactionPage,
        limit: transactionLimit,
        total: 0,
        totalPages: 0,
    }
);
                const withdrawalData = withdrawalsResponse.data.data;

setWithdrawals(
  Array.isArray(withdrawalData)
    ? withdrawalData
    : withdrawalData.withdrawals || []
);
            } catch (err) {
                setError(
                    err.response?.data?.error?.message ||
                    "Unable to load wallet data."
                );
            } finally {
                setLoading(false);
                setTransactionLoading(false);
                setWithdrawalLoading(false);
            }
        };

        fetchWalletData();
    }, [transactionPage, transactionLimit]);

    if (loading) {
        return <div className="dashboard-page">Loading wallet...</div>;
    }

    if (error) {
        return (
            <div className="dashboard-page">
                <p className="error-message">{error}</p>
            </div>
        );
    }

    return (
        <div className="dashboard-page">
            <header className="dashboard-header">
                <header className="app-header">
  <div className="app-brand">
    <h1>VELoop Rewards</h1>
    <span>Wallet</span>
  </div>

  <nav className="app-nav">
    <button onClick={() => navigate("/dashboard")}>
      Dashboard
    </button>

    <button onClick={() => navigate("/withdraw")}>
      Withdraw
    </button>

    <button onClick={logout} className="logout-button">
      Logout
    </button>
  </nav>
</header>
                <div>
                    <h1>VELoop Rewards</h1>
                    <p>Welcome, {user?.name}</p>
                </div>
            </header>

            <main>
                <section>
                    <h2>Your Wallet</h2>
                    <button onClick={() => navigate("/withdraw")}>
                        Withdraw Rewards
                    </button>

                    <div className="wallet-grid">
                        <div className="wallet-card">
                            <span>VEs</span>
                            <strong>{summary?.ves ?? wallet?.ves ?? 0}</strong>
                        </div>

                        <div className="wallet-card">
                            <span>SVEs</span>
                            <strong>{summary?.sves ?? wallet?.sves ?? 0}</strong>
                        </div>

                        <div className="wallet-card">
                            <span>Gems</span>
                            <strong>{summary?.gems ?? wallet?.gems ?? 0}</strong>
                        </div>

                        <div className="wallet-card">
                            <span>Tokens</span>
                            <strong>{summary?.tokens ?? wallet?.tokens ?? 0}</strong>
                        </div>

                        <div className="wallet-card">
                            <span>Spins</span>
                            <strong>{summary?.spins ?? wallet?.spins ?? 0}</strong>
                        </div>
                    </div>
                </section>
                <section className="transactions-section">
                    <div className="section-header">
                        <h2>Transaction History</h2>
                    </div>

                    {transactionLoading ? (
                        <p>Loading transactions...</p>
                    ) : transactions.length === 0 ? (
                        <div className="empty-state">
                            <p>No transactions yet.</p>
                        </div>
                    ) : (
                        <div className="transactions-table-wrapper">
                            <table className="transactions-table">
                                <thead>
                                    <tr>
                                        <th>Type</th>
                                        <th>Currency</th>
                                        <th>Amount</th>
                                        <th>Balance</th>
                                        <th>Status</th>
                                        <th>Date</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {transactions.map((transaction) => (
                                        <tr key={transaction.transactionId}>
                                            <td>{transaction.type}</td>

                                            <td>{transaction.currency}</td>

                                            <td
                                                className={
                                                    transaction.direction === "CREDIT"
                                                        ? "credit"
                                                        : "debit"
                                                }
                                            >
                                                {transaction.direction === "CREDIT" ? "+" : "-"}
                                                {transaction.amount}
                                            </td>

                                            <td>{transaction.balanceAfter}</td>

                                            <td>
                                                <span className={`status ${transaction.status?.toLowerCase()}`}>
                                                    {transaction.status}
                                                </span>
                                            </td>

                                            <td>
                                                {new Date(transaction.createdAt).toLocaleString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div className="transaction-pagination">

    <div className="pagination-info">
        Showing page {transactionPagination.page} of{" "}
        {transactionPagination.totalPages || 1}
    </div>

    <div className="pagination-controls">

        <button
            onClick={() =>
                setTransactionPage((page) => Math.max(page - 1, 1))
            }
            disabled={transactionPage === 1}
        >
            Previous
        </button>

        <span>
            {transactionPage} / {transactionPagination.totalPages || 1}
        </span>

        <button
            onClick={() =>
                setTransactionPage((page) =>
                    Math.min(
                        page + 1,
                        transactionPagination.totalPages
                    )
                )
            }
            disabled={
                transactionPage >= transactionPagination.totalPages
            }
        >
            Next
        </button>

    </div>

    <div className="pagination-limit">
        <label>Rows:</label>

        <select
            value={transactionLimit}
            onChange={(e) => {
                setTransactionLimit(Number(e.target.value));
                setTransactionPage(1);
            }}
        >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
        </select>
    </div>

</div>
                        </div>
                    )}
                </section>
                <section className="withdrawals-section">
  <div className="section-header">
    <h2>Withdrawal History</h2>
  </div>

  {withdrawalLoading ? (
    <p>Loading withdrawals...</p>
  ) : withdrawals.length === 0 ? (
    <div className="empty-state">
      <p>No withdrawal requests yet.</p>
    </div>
  ) : (
    <div className="withdrawals-table-wrapper">
      <table className="withdrawals-table">
        <thead>
          <tr>
            <th>Withdrawal ID</th>
            <th>Method</th>
            <th>Required</th>
            <th>Payout</th>
            <th>Status</th>
            <th>Date</th>
          </tr>
        </thead>

        <tbody>
          {withdrawals.map((withdrawal) => (
            <tr key={withdrawal.withdrawalId}>
              <td>{withdrawal.withdrawalId}</td>

              <td>{withdrawal.method}</td>

              <td>
                {withdrawal.currencyAmount} {withdrawal.currency}
              </td>

              <td>
                {withdrawal.payoutAmount} {withdrawal.payoutCurrency}
              </td>

              <td>
                <span
                  className={`withdrawal-status ${withdrawal.status?.toLowerCase()}`}
                >
                  {withdrawal.status}
                </span>
              </td>

              <td>
                {new Date(
                  withdrawal.requestedAt || withdrawal.createdAt
                ).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )}
</section>
            </main>
        </div>
    );
};

export default Dashboard;