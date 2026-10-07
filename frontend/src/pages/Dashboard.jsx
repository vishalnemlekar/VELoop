import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/useAuth";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import DashboardNavbar from "../components/DashboardNavbar";

const formatCompactNumber = (value) => {
  const num = Number(value ?? 0);
  if (!Number.isFinite(num)) return "0";
  return num.toLocaleString("en-IN");
};

const formatStatus = (status) =>
  String(status || "PENDING")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [wallet, setWallet] = useState(null);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);

  useEffect(() => {
    const fetchWalletData = async () => {
      try {
        setLoading(true);
        setError("");

        const [walletResponse, summaryResponse, transactionsResponse, withdrawalsResponse] =
          await Promise.all([
            api.get("/wallet"),
            api.get("/wallet/summary"),
            api.get("/wallet/transactions?page=1&limit=6"),
            api.get("/withdrawals?page=1&limit=4"),
          ]);

        const walletData = walletResponse.data.data?.wallet || walletResponse.data.data || {};
        const summaryData = summaryResponse.data.data || {};
        const transactionsData = transactionsResponse.data.data || {};
        const withdrawalData = withdrawalsResponse.data.data || {};

        setWallet(walletData);
        setSummary(summaryData);
        setTransactions(
          Array.isArray(transactionsData.transactions) ? transactionsData.transactions : []
        );
        setWithdrawals(
          Array.isArray(withdrawalData)
            ? withdrawalData
            : Array.isArray(withdrawalData.withdrawals)
              ? withdrawalData.withdrawals
              : []
        );
      } catch (err) {
        setError(err.response?.data?.error?.message || "Unable to load wallet data.");
      } finally {
        setLoading(false);
      }
    };

    fetchWalletData();
  }, []);

  const ves = Number(summary?.ves ?? wallet?.ves ?? 0);
  const sves = Number(summary?.sves ?? wallet?.sves ?? 0);
  const spins = Number(summary?.spins ?? wallet?.spins ?? 0);
  const balance = Number(summary?.balance ?? wallet?.balance ?? wallet?.ves ?? 0);

  const todayEarnings = useMemo(() => {
    const result = transactions
      .filter((item) => item.direction === "CREDIT" || Number(item.amount) > 0)
      .reduce((sum, item) => sum + Number(item.amount || 0), 0);

    return Number.isFinite(result) ? result : 0;
  }, [transactions]);

  const totalEarned = useMemo(() => {
    const result = transactions
      .filter((item) => item.direction === "CREDIT" || Number(item.amount) > 0)
      .reduce((sum, item) => sum + Number(item.amount || 0), 0);

    return Number.isFinite(result) ? result : 0;
  }, [transactions]);

  const pendingRewards = useMemo(() => {
    const result = withdrawals
      .filter((item) => ["PENDING", "PROCESSING", "APPROVED"].includes(String(item.status || "").toUpperCase()))
      .reduce((sum, item) => sum + Number(item.amount || item.ves || 0), 0);

    return Number.isFinite(result) ? result : 0;
  }, [withdrawals]);

  const nextPayoutThreshold = Number(summary?.nextPayoutRequirement ?? summary?.minimumPayout ?? 0);
  const payoutProgress = nextPayoutThreshold > 0 ? Math.min((ves / nextPayoutThreshold) * 100, 100) : 0;

  const earningCards = [
    {
      title: "Consumer Survey",
      description: "Answer quick questions and unlock fast VE rewards.",
      time: "8 min",
      reward: "+250 VE",
      badge: "Surveys",
      tone: "bg-gradient-to-br from-cyan-300 to-sky-400 text-sky-950 ring-cyan-200",
    },
    {
      title: "Game Milestone",
      description: "Complete in-game goals and collect reward credits.",
      time: "12 min",
      reward: "+420 VE",
      badge: "Games",
      tone: "bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white ring-violet-300/40",
    },
    {
      title: "Video Watch",
      description: "Watch selected clips and stack short-form earnings.",
      time: "5 min",
      reward: "+180 VE",
      badge: "Videos",
      tone: "bg-gradient-to-br from-rose-400 to-orange-400 text-rose-950 ring-rose-200",
    },
  ];

  const missions = [
    { label: "Complete 1 survey", reward: "+50 VE", done: true },
    { label: "Watch 3 videos", reward: "+20 VE", done: true },
    { label: "Complete 1 offer", reward: "+100 VE", done: false },
  ];

  if (loading) {
    return (
      <div className="app-theme">
        <DashboardNavbar />
        <div className="mx-auto flex min-h-[60vh] max-w-7xl items-center justify-center px-4">
          <div className="rounded-2xl border border-neutral-200 bg-white px-6 py-5 text-sm font-medium text-neutral-500 shadow-sm">
            Loading dashboard...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app-theme">
        <DashboardNavbar />
        <div className="mx-auto flex min-h-[60vh] max-w-7xl items-center justify-center px-4">
          <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-5 text-sm text-red-700 shadow-sm">
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-theme">
      <DashboardNavbar />

      <main className="mx-auto max-w-7xl px-4 pb-28 pt-6 sm:px-6 lg:px-8">
        <section className="mb-6 flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-neutral-500">Good evening</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">{user?.name || "User"}</h1>
            <p className="mt-2 text-sm text-neutral-500">Keep earning to reach your next reward.</p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => navigate("/wallet")}
              className="rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm font-semibold text-neutral-800 transition hover:border-neutral-300 hover:bg-neutral-50"
            >
              Wallet
            </button>
            <button
              type="button"
              onClick={() => navigate("/withdraw")}
              className="rounded-xl bg-yellow-400 px-4 py-2.5 text-sm font-bold text-neutral-950 shadow-[0_4px_0_0_#d9a900] transition hover:-translate-y-0.5 hover:bg-yellow-300 active:translate-y-0.5 active:shadow-none"
            >
              Withdraw
            </button>
          </div>
        </section>

        <section className="grid gap-4 xl:grid-cols-[1.7fr_1fr]">
          <article className="relative overflow-hidden rounded-[28px] bg-neutral-950 p-6 text-white shadow-[0_20px_50px_rgba(17,24,39,0.08)] sm:p-7">
            <div className="absolute -right-20 -top-16 h-52 w-52 rounded-full bg-yellow-400/20 blur-3xl" />
            <div className="absolute -bottom-16 right-10 h-40 w-40 rounded-full bg-cyan-400/10 blur-3xl" />

            <div className="relative flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-neutral-400">Your balance</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.2em] text-neutral-500">VE balance</p>
                </div>
                <span className="rounded-full border border-yellow-400/20 bg-yellow-400/10 px-3 py-1 text-xs font-semibold text-yellow-300">
                  VE
                </span>
              </div>

              <div>
                <div className="flex items-end gap-2">
                  <span className="text-4xl font-bold tracking-tight sm:text-5xl">{formatCompactNumber(ves)}</span>
                  <span className="pb-2 text-sm font-semibold text-yellow-300">VE</span>
                </div>
                <p className="mt-3 text-sm text-neutral-400">≈ ₹{formatCompactNumber(balance)} available</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-center justify-between text-xs text-neutral-300">
                  <span>Progress to next payout</span>
                  <span>{Math.round(payoutProgress)}%</span>
                </div>
                <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-500"
                    style={{ width: `${payoutProgress}%` }}
                  />
                </div>
                <div className="mt-3 flex items-center justify-between text-xs text-neutral-400">
                  <span>{formatCompactNumber(ves)} VE</span>
                  <span>{nextPayoutThreshold ? `${formatCompactNumber(nextPayoutThreshold)} VE` : "No threshold"}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => navigate("/withdraw")}
                  className="rounded-xl bg-yellow-400 px-5 py-3 text-sm font-bold text-neutral-950 shadow-[0_4px_0_0_#d9a900] transition hover:-translate-y-0.5 hover:bg-yellow-300 active:translate-y-0.5 active:shadow-none"
                >
                  Withdraw
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/wallet")}
                  className="rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  Wallet
                </button>
              </div>
            </div>
          </article>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
            <div className="rounded-[24px] border border-neutral-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">Today</p>
              <div className="mt-4 flex items-end justify-between">
                <span className="text-3xl font-bold tracking-tight">+{formatCompactNumber(todayEarnings)}</span>
                <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-emerald-700">VE</span>
              </div>
              <p className="mt-3 text-sm text-neutral-500">Today's earnings</p>
            </div>

            <div className="rounded-[24px] border border-neutral-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">Total</p>
              <div className="mt-4 flex items-end justify-between">
                <span className="text-3xl font-bold tracking-tight">+{formatCompactNumber(totalEarned)}</span>
                <span className="rounded-full bg-cyan-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-cyan-700">All time</span>
              </div>
              <p className="mt-3 text-sm text-neutral-500">Total earned</p>
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-4 md:grid-cols-4">
          <div className="rounded-[24px] border border-neutral-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">Pending</p>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-2xl font-bold">{formatCompactNumber(pendingRewards)}</span>
              <span className="text-xs text-neutral-500">VE</span>
            </div>
          </div>

          <div className="rounded-[24px] border border-neutral-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">Streak</p>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-2xl font-bold">7</span>
              <span className="text-xs text-neutral-500">days</span>
            </div>
          </div>

          <div className="rounded-[24px] border border-neutral-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">SVE</p>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-2xl font-bold">{formatCompactNumber(sves)}</span>
              <span className="text-xs text-neutral-500">balance</span>
            </div>
          </div>

          <div className="rounded-[24px] border border-neutral-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">Spins</p>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-2xl font-bold">{formatCompactNumber(spins)}</span>
              <span className="text-xs text-neutral-500">available</span>
            </div>
          </div>
        </section>

        <section className="mt-10 rounded-[28px] border border-neutral-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">Earn more</p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight">Recommended opportunities</h2>
            </div>
            <div className="flex flex-wrap gap-2 text-xs font-medium text-neutral-600">
              {['All', 'Surveys', 'Games', 'Videos', 'Offers'].map((tab, index) => (
                <button
                  key={tab}
                  type="button"
                  className={`rounded-full px-3 py-1.5 ${index === 0 ? 'bg-neutral-900 text-white' : 'bg-neutral-100 text-neutral-700'}`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-4 xl:grid-cols-3">
            {earningCards.map((item) => (
              <article key={item.title} className="rounded-[24px] border border-white/10 bg-[#15113a]/70 p-5 transition hover:-translate-y-1 hover:border-violet-300/40 hover:shadow-[0_22px_42px_-24px_rgba(167,139,250,0.35)]">
                <div className="flex items-center justify-between">
                  <span className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ring-1 ${item.tone}`} aria-hidden="true">
                    ✦
                  </span>
                  <span className="rounded-full bg-white px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-neutral-600">
                    {item.badge}
                  </span>
                </div>

                <h3 className="mt-5 text-xl font-bold text-neutral-950">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-neutral-600">{item.description}</p>

                <div className="mt-5 flex items-center justify-between text-sm text-neutral-500">
                  <span className="inline-flex items-center gap-1.5">⏱ {item.time}</span>
                  <span className="text-base font-bold text-neutral-950">{item.reward}</span>
                </div>

                <button
                  type="button"
                  className="mt-5 w-full rounded-xl bg-yellow-300 px-4 py-3 text-sm font-extrabold text-neutral-950 shadow-[0_4px_0_0_#b8890b] transition hover:-translate-y-0.5 hover:bg-yellow-200 active:translate-y-0.5 active:shadow-none"
                >
                  Start
                </button>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-10 grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[28px] border border-neutral-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">Missions</p>
                <h2 className="mt-2 text-2xl font-bold tracking-tight">Today's missions</h2>
              </div>
              <span className="rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-semibold text-neutral-700">2 / 3</span>
            </div>

            <div className="space-y-3">
              {missions.map((mission) => (
                <div key={mission.label} className="flex items-center justify-between rounded-2xl bg-neutral-50 p-3.5">
                  <div className="flex items-center gap-3">
                    <span className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${mission.done ? 'bg-emerald-100 text-emerald-700' : 'bg-neutral-200 text-neutral-600'}`}>
                      {mission.done ? '✓' : '○'}
                    </span>
                    <p className="text-sm font-medium text-neutral-800">{mission.label}</p>
                  </div>
                  <span className="text-sm font-bold text-neutral-950">{mission.reward}</span>
                </div>
              ))}
            </div>

            <div className="mt-5">
              <div className="mb-2 flex items-center justify-between text-xs font-medium text-neutral-500">
                <span>Progress</span>
                <span>67%</span>
              </div>
              <div className="h-2.5 overflow-hidden rounded-full bg-neutral-200">
                <div className="h-full w-[67%] rounded-full bg-gradient-to-r from-emerald-400 to-emerald-500" />
              </div>
            </div>
          </div>

          <div className="rounded-[28px] border border-neutral-200 bg-white p-5 shadow-sm sm:p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">Daily streak</p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight">7 day streak</h2>

            <div className="mt-5 flex items-center justify-between rounded-2xl bg-yellow-50 px-4 py-3">
              <div className="flex gap-1 text-xl" aria-label="Current streak days">
                {Array.from({ length: 7 }).map((_, index) => (
                  <span key={index} className={index < 7 ? 'text-yellow-500' : 'text-neutral-300'}>🔥</span>
                ))}
              </div>
              <button type="button" className="rounded-lg bg-yellow-400 px-3 py-2 text-xs font-bold text-neutral-950">
                Claim +100 VE
              </button>
            </div>

            <div className="mt-6 rounded-2xl bg-neutral-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">Level</p>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-lg font-bold">Gold Member</span>
                <span className="text-sm font-semibold text-neutral-700">Lvl 12</span>
              </div>
              <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-neutral-200">
                <div className="h-full w-[72%] rounded-full bg-gradient-to-r from-yellow-300 to-yellow-500" />
              </div>
              <p className="mt-3 text-xs text-neutral-500">1,420 / 2,000 XP</p>
            </div>
          </div>
        </section>

        <section className="mt-10 grid gap-4 xl:grid-cols-[1.4fr_0.9fr]">
          <div className="rounded-[28px] border border-neutral-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">Activity</p>
                <h2 className="mt-2 text-2xl font-bold tracking-tight">Recent activity</h2>
              </div>
              <button type="button" className="text-sm font-semibold text-neutral-600 hover:text-neutral-950" onClick={() => navigate("/wallet")}>
                View all
              </button>
            </div>

            {transactions.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-neutral-300 bg-neutral-50 px-4 py-10 text-center text-sm text-neutral-500">
                No transactions yet. Start earning to see your activity here.
              </div>
            ) : (
              <div className="space-y-3">
                {transactions.map((transaction) => (
                  <div key={transaction.transactionId || transaction.id} className="flex items-center justify-between rounded-2xl border border-neutral-200 bg-neutral-50 p-3.5">
                    <div className="flex items-center gap-3">
                      <span className={`flex h-10 w-10 items-center justify-center rounded-xl text-lg ${transaction.direction === "CREDIT" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}>
                        {transaction.direction === "CREDIT" ? "+" : "-"}
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-neutral-900">{transaction.type || "Wallet activity"}</p>
                        <p className="text-xs text-neutral-500">
                          {transaction.createdAt ? new Date(transaction.createdAt).toLocaleString() : "Today"}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-bold ${transaction.direction === "CREDIT" ? "text-emerald-700" : "text-red-700"}`}>
                        {transaction.direction === "CREDIT" ? "+" : "-"}
                        {formatCompactNumber(transaction.amount)} {transaction.currency || "VE"}
                      </p>
                      <p className="text-[11px] uppercase tracking-[0.12em] text-neutral-500">{transaction.status || "SUCCESS"}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-[28px] border border-neutral-200 bg-white p-5 shadow-sm sm:p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">Rewards</p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight">Withdrawal status</h2>

            {withdrawals.length === 0 ? (
              <div className="mt-4 rounded-2xl border border-dashed border-neutral-300 bg-neutral-50 px-4 py-8 text-center text-sm text-neutral-500">
                No withdrawals yet.
              </div>
            ) : (
              <div className="mt-4 space-y-3">
                {withdrawals.map((item) => (
                  <div key={item.withdrawalId || item.id} className="rounded-2xl border border-neutral-200 bg-neutral-50 p-3.5">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-neutral-900">{item.method || "Payout"}</p>
                        <p className="text-[11px] text-neutral-500">{item.withdrawalId || "Request"}</p>
                      </div>
                      <span className={`rounded-full px-2 py-1 text-[10px] font-bold uppercase tracking-[0.12em] ${item.status === "REJECTED" ? "bg-red-100 text-red-700" : item.status === "PENDING" ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"}`}>
                        {formatStatus(item.status)}
                      </span>
                    </div>
                    <div className="mt-3 flex items-center justify-between text-sm">
                      <span className="text-neutral-500">Amount</span>
                      <span className="font-bold text-neutral-950">{formatCompactNumber(item.amount || item.ves || 0)} VE</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
