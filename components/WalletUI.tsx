"use client";

import {
  useAuthModal,
  useLogout,
  useSignerStatus,
  useUser,
} from "@account-kit/react";
import { useAccount, useBalance } from "wagmi";
import { formatEther } from "viem";

function shortAddr(addr: string) {
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

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

export function WalletUI() {
  const { openAuthModal } = useAuthModal();
  const { logout } = useLogout();
  const signerStatus = useSignerStatus();
  const user = useUser();

  const { address, isConnected } = useAccount();
  const { data: balanceData } = useBalance({ address });

  const isLoading = signerStatus.isInitializing;
  const displayAddr = address ?? (user?.address as `0x${string}` | undefined);
  const balanceETH = balanceData
    ? `${parseFloat(formatEther(balanceData.value)).toFixed(4)} ${balanceData.symbol}`
    : "—";

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

  if (!user && !isConnected) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-6 bg-[#0a0a0a] overflow-hidden relative">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-indigo-700/20 blur-3xl" />
          <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-violet-700/20 blur-3xl" />
        </div>

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
          Sign in with Google, Apple, email, or your existing wallet.
        </p>

        <div className="fade-up delay-3 flex flex-wrap justify-center gap-2 mb-10">
          {["⚡ Gasless txns", "🔐 Social login", "📱 Mobile-first", "🔗 WalletConnect"].map((f) => (
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

  return (
    <main className="min-h-screen bg-[#0a0a0a] px-4 py-8 max-w-md mx-auto">
      <div className="fade-up flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-sm font-bold">
            {displayAddr ? displayAddr[2].toUpperCase() : "?"}
          </div>
          <div>
            <p className="text-sm font-medium font-mono">
              {displayAddr ? shortAddr(displayAddr) : "Connected"}
            </p>
            <span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
              Sepolia
            </span>
          </div>
        </div>
        <button
          onClick={() => logout()}
          className="text-xs text-white/40 hover:text-white/80 transition-colors px-3 py-1.5 rounded-lg border border-white/10 hover:border-white/20"
        >
          Disconnect
        </button>
      </div>

      <div className="fade-up delay-1 rounded-3xl bg-gradient-to-br from-indigo-600/40 to-violet-700/40 border border-indigo-500/20 p-5 mb-6 shadow-xl shadow-indigo-900/20">
        <p className="text-xs text-indigo-300/60 uppercase tracking-widest mb-1">
          Wallet Address
        </p>
        <p className="font-mono text-sm break-all leading-relaxed">
          {displayAddr ?? "—"}
        </p>
        {displayAddr && (
          <button
            onClick={() => navigator.clipboard.writeText(displayAddr)}
            className="mt-3 text-xs text-indigo-300/60 hover:text-indigo-300 transition-colors"
          >
            Copy address ↗
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 mb-8">
        <StatCard label="Balance" value={balanceETH} delay="delay-2" />
        <StatCard label="Network" value="Sepolia" delay="delay-2" />
        <StatCard
          label="Auth"
          value={user?.email ? "Email / Social" : "External Wallet"}
          delay="delay-3"
        />
        <StatCard label="Status" value="Connected ✓" delay="delay-3" />
      </div>

      {displayAddr && (
        <a
          href={`https://sepolia.etherscan.io/address/${displayAddr}`}
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
