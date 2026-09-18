import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/useAuth";

const Withdraw = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [wallet, setWallet] = useState(null);
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [payoutDetails, setPayoutDetails] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");

        const [walletResponse, optionsResponse] = await Promise.all([
          api.get("/wallet"),
          api.get("/withdrawals/payout-options"),
        ]);

        setWallet(walletResponse.data.data.wallet);
        setOptions(optionsResponse.data.data || []);
      } catch (err) {
        setError(
          err.response?.data?.error?.message ||
            "Unable to load withdrawal information."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!selectedOption) {
      setError("Please select a payout option.");
      return;
    }

    if (!payoutDetails.trim()) {
      setError("Please enter your payout details.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");
      setSuccess("");

      const response = await api.post(
        "/withdrawals",
        {
          optionId: selectedOption.optionId,
          payoutDetails: {
            upiId: payoutDetails.trim(),
          },
        },
        {
          headers: {
            "Idempotency-Key": crypto.randomUUID(),
          },
        }
      );

      const withdrawal =
        response.data.data.withdrawal;

      setSuccess(
        `Withdrawal ${withdrawal.withdrawalId} created successfully.`
      );

      setPayoutDetails("");
      setSelectedOption(null);
    } catch (err) {
      setError(
        err.response?.data?.error?.message ||
          "Unable to create withdrawal."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="withdraw-page">
        <div className="loading-state">
          Loading withdrawal options...
        </div>
      </div>
    );
  }

  return (
    <div className="withdraw-page">
      <header className="app-header">
        <div className="app-brand">
          <h1>VELoop Rewards</h1>
          <span>Wallet</span>
        </div>

        <nav className="app-nav">
          <button onClick={() => navigate("/dashboard")}>
            Dashboard
          </button>

          <button
            className="active-nav"
            onClick={() => navigate("/withdraw")}
          >
            Withdraw
          </button>

          <button
            onClick={() => {
              logout();
              navigate("/login");
            }}
            className="logout-button"
          >
            Logout
          </button>
        </nav>
      </header>

      <main className="withdraw-container">
        <section className="withdraw-hero">
          <div>
            <p className="eyebrow">VELoop Wallet</p>
            <h1>Withdraw Rewards</h1>
            <p>
              Convert your VE rewards into an available payout.
            </p>
          </div>

          <div className="user-info">
            <span>Welcome</span>
            <strong>{user?.name || "User"}</strong>
          </div>
        </section>

        {wallet && (
          <section className="withdraw-balance">
            <div>
              <span>Available VE</span>
              <strong>
                {Number(wallet.ves || 0).toLocaleString()}
              </strong>
              <small>VE Rewards</small>
            </div>

            <button onClick={() => navigate("/dashboard")}>
              View Wallet
            </button>
          </section>
        )}

        {error && (
          <div className="alert error-message">
            {error}
          </div>
        )}

        {success && (
          <div className="alert success-message">
            {success}
          </div>
        )}

        <section className="withdraw-section">
          <div className="section-header">
            <div>
              <h2>Select Payout</h2>
              <p>
                Choose one of the payout options configured by VELoop.
              </p>
            </div>
          </div>

          <div className="payout-grid">
            {options.map((option) => (
              <button
                type="button"
                key={option.optionId}
                className={`payout-card ${
                  selectedOption?.optionId === option.optionId
                    ? "selected"
                    : ""
                }`}
                onClick={() => {
                  setSelectedOption(option);
                  setError("");
                  setSuccess("");
                }}
              >
                <div className="payout-card-top">
                  <strong>{option.name}</strong>

                  {selectedOption?.optionId === option.optionId && (
                    <span className="selected-badge">
                      Selected
                    </span>
                  )}
                </div>

                <div className="payout-receive">
                  {option.payoutAmount}{" "}
                  {option.payoutCurrency}
                </div>

                <span>
                  Requires{" "}
                  <strong>
                    {Number(option.requiredAmount).toLocaleString()}{" "}
                    {option.currency}
                  </strong>
                </span>
              </button>
            ))}
          </div>
        </section>

        {selectedOption && (
          <section className="withdraw-form-section">
            <div className="form-heading">
              <div>
                <p className="eyebrow">Payout Details</p>
                <h2>Enter your details</h2>
              </div>

              <div className="selected-payout">
                <span>You'll receive</span>
                <strong>
                  {selectedOption.payoutAmount}{" "}
                  {selectedOption.payoutCurrency}
                </strong>
              </div>
            </div>

            <div className="requirement-box">
              <span>Withdrawal cost</span>
              <strong>
                {Number(
                  selectedOption.requiredAmount
                ).toLocaleString()}{" "}
                {selectedOption.currency}
              </strong>
            </div>

            <form onSubmit={handleSubmit}>
              <label htmlFor="payoutDetails">
                {selectedOption.method === "UPI"
                  ? "UPI ID"
                  : "Payout Details"}
              </label>

              <input
                id="payoutDetails"
                type="text"
                value={payoutDetails}
                onChange={(event) =>
                  setPayoutDetails(event.target.value)
                }
                placeholder={
                  selectedOption.method === "UPI"
                    ? "example@upi"
                    : "Enter payout details"
                }
                required
              />

              <p className="form-hint">
                Make sure your payout details are correct.
                Incorrect details may result in rejection.
              </p>

              <button
                type="submit"
                className="withdraw-submit"
                disabled={submitting}
              >
                {submitting
                  ? "Processing..."
                  : `Request ${selectedOption.payoutAmount} ${selectedOption.payoutCurrency}`}
              </button>
            </form>
          </section>
        )}

        <section className="withdraw-note">
          <strong>How withdrawal works</strong>
          <p>
            Your VE balance is deducted when the withdrawal
            request is created. The request remains pending until
            it is reviewed and processed.
          </p>
        </section>
      </main>
    </div>
  );
};

export default Withdraw;