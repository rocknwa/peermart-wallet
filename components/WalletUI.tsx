"use client";

import {
  useAuthModal,
  useLogout,
  useSignerStatus,
  useUser,
  useSmartAccountClient,
  useSendUserOperation,
} from "@account-kit/react";
import { useState, useEffect } from "react";
import { encodeFunctionData, parseEther, formatEther } from "viem";

/* ─── tiny helper ─── */
function shortAddr(addr: string) {
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

/* ─── stat card ─── */
function StatCard({
  label,
  value,
  delay,
}: {
  label: string;
  value: string;
  delay: string;
}) {
  return (
    <div
      className={`fade-up ${delay} rounded-2xl bg-white/5 border border-white/10 p-4 flex flex-col gap-1`}
    >
      <span className="text-xs text-white/40 uppercase tracking-widest">
        {label}
      </span>
      <span className="text-lg font-semibold truncate">{value}</span>
    </div>
  );
}

/* ─── network badge ─── */
function NetworkBadge({ name }: { name: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
      <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
      {name}
    </span>
  );
}

/* ─── MAIN ─── */
export function WalletUI() {
  const { openAuthModal } = useAuthModal();
  const { logout } = useLogout();
  const signerStatus = useSignerStatus();
  const user = useUser();

  // Smart account client on Sepolia
  const { client } = useSmartAccountClient({ type: "MultiOwnerModularAccount" });

  // Send ETH form state
  const [toAddr, setToAddr] = useState("");
  const [amount, setAmount] = useState("");
  const [txHash, setTxHash] = useState<string | null>(null);
  const [sendError, setSendError] = useState<string | null>(null);

  const { sendUserOperation, isSendingUserOperation } = useSendUserOperation({
    client,
    waitForTxn: true,
    onSuccess: ({ hash }) => {
      setTxHash(hash);
      setToAddr("");
      setAmount("");
    },
    onError: (err) => {
      setSendError(err.message ?? "Transaction failed");
    },
  });

  const handleSend = () => {
    setSendError(null);
    setTxHash(null);
    if (!toAddr || !amount) return;
    sendUserOperation({
      uo: {
        target: toAddr as `0x${string}`,
        data: "0x",
        value: parseEther(amount),
      },
    });
  };

  const isLoading = signerStatus.isInitializing;
  const isConnected = !!user;

  /* ─── LOADING STATE ─── */
  if (isLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
          <span className="text-white/40 text-sm">Connecting…</span>
        </div>
      </main>
    );
  }

  /* ─── LANDING (NOT CONNECTED) ─── */
  if (!isConnected) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-6 bg-[#0a0a0a] overflow-hidden relative">
        {/* Background blobs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-indigo-700/20 blur-3xl" />
          <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-violet-700/20 blur-3xl" />
        </div>

        {/* Logo */}
        <div className="fade-up relative mb-8 flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-2xl shadow-indigo-500/30">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <h1 className="fade-up delay-1 text-3xl font-bold tracking-tight text-center mb-2">
          SocialWallet
        </h1>
        <p className="fade-up delay-2 text-white/50 text-center text-sm mb-10 max-w-xs leading-relaxed">
          Sign in with Google, email, or your existing wallet. No seed phrase
          needed.
        </p>

        {/* Feature pills */}
        <div className="fade-up delay-3 flex flex-wrap justify-center gap-2 mb-10">
          {[
            "⚡ Gasless txns",
            "🔐 Social login",
            "📱 Mobile-first",
            "🔗 WalletConnect",
          ].map((f) => (
            <span
              key={f}
              className="text-xs px-3 py-1.5 rounded-full border border-white/10 bg-white/5 text-white/60"
            >
              {f}
            </span>
          ))}
        </div>

        <button
          onClick={openAuthModal}
          className="fade-up delay-4 glow-btn w-full max-w-xs py-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-600 font-semibold text-base shadow-xl hover:opacity-90 active:scale-95 transition-all"
        >
          Get Started
        </button>

        <p className="fade-up delay-4 mt-6 text-xs text-white/25 text-center">
          Powered by Alchemy Account Kit · ERC-4337
        </p>
      </main>
    );
  }

  /* ─── DASHBOARD (CONNECTED) ─── */
  const addr = client?.account?.address;

  return (
    <main className="min-h-screen bg-[#0a0a0a] px-4 py-8 max-w-md mx-auto">
      {/* Header */}
      <div className="fade-up flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-sm font-bold">
            {(user.email ?? user.address ?? "?")[0].toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-medium truncate max-w-[160px]">
              {user.email ?? shortAddr(user.address ?? "")}
            </p>
            <NetworkBadge name="Sepolia" />
          </div>
        </div>
        <button
          onClick={() => logout()}
          className="text-xs text-white/40 hover:text-white/80 transition-colors px-3 py-1.5 rounded-lg border border-white/10 hover:border-white/20"
        >
          Logout
        </button>
      </div>

      {/* Smart account address card */}
      <div className="fade-up delay-1 rounded-3xl bg-gradient-to-br from-indigo-600/40 to-violet-700/40 border border-indigo-500/20 p-5 mb-6 shadow-xl shadow-indigo-900/20">
        <p className="text-xs text-indigo-300/60 uppercase tracking-widest mb-1">
          Smart Account
        </p>
        <p className="font-mono text-sm break-all leading-relaxed">
          {addr ?? "Loading…"}
        </p>
        {addr && (
          <button
            onClick={() => navigator.clipboard.writeText(addr)}
            className="mt-3 text-xs text-indigo-300/60 hover:text-indigo-300 transition-colors"
          >
            Copy address ↗
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 mb-8">
        <StatCard label="Network" value="Sepolia" delay="delay-2" />
        <StatCard label="Account Type" value="ERC-4337" delay="delay-2" />
        <StatCard
          label="Auth Method"
          value={user.email ? "Email / Social" : "EOA Wallet"}
          delay="delay-3"
        />
        <StatCard label="Passkey" value="Enabled" delay="delay-3" />
      </div>

      {/* Send ETH */}
      <div className="fade-up delay-3 rounded-2xl bg-white/5 border border-white/10 p-5 mb-6">
        <h2 className="text-sm font-semibold mb-4 text-white/80">
          Send ETH (Sepolia)
        </h2>

        <input
          type="text"
          placeholder="To address (0x…)"
          value={toAddr}
          onChange={(e) => setToAddr(e.target.value)}
          className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm mb-3 outline-none focus:border-indigo-500/60 placeholder-white/20 font-mono"
        />
        <input
          type="number"
          placeholder="Amount in ETH"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm mb-4 outline-none focus:border-indigo-500/60 placeholder-white/20"
        />

        <button
          onClick={handleSend}
          disabled={isSendingUserOperation || !toAddr || !amount}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 font-semibold text-sm disabled:opacity-40 active:scale-95 transition-all"
        >
          {isSendingUserOperation ? "Sending…" : "Send"}
        </button>

        {/* Feedback */}
        {txHash && (
          <a
            href={`https://sepolia.etherscan.io/tx/${txHash}`}
            target="_blank"
            rel="noreferrer"
            className="block mt-3 text-xs text-green-400 break-all hover:underline"
          >
            ✅ Tx sent! View on Etherscan ↗
          </a>
        )}
        {sendError && (
          <p className="mt-3 text-xs text-red-400 break-all">{sendError}</p>
        )}
      </div>

      {/* Etherscan link */}
      {addr && (
        <a
          href={`https://sepolia.etherscan.io/address/${addr}`}
          target="_blank"
          rel="noreferrer"
          className="fade-up delay-4 block text-center text-xs text-white/30 hover:text-white/60 transition-colors"
        >
          View on Sepolia Etherscan ↗
        </a>
      )}
    </main>
  );
}
