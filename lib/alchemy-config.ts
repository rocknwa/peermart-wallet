import { AlchemyAccountsUIConfig, createConfig } from "@account-kit/react";
import { sepolia, alchemy } from "@account-kit/infra";
import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient();

// ─── REPLACE with your real Alchemy API key from https://dashboard.alchemy.com ───
const ALCHEMY_API_KEY = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY ?? "demo";

const uiConfig: AlchemyAccountsUIConfig = {
  illustrationStyle: "outline",
  auth: {
    sections: [
      // Row 1 – Email magic link (most common for mobile)
      [{ type: "email" }],
      // Row 2 – Social logins
      [
        { type: "social", authProviderId: "google", mode: "popup" },
        { type: "social", authProviderId: "facebook", mode: "popup" },
      ],
      // Row 3 – External wallet (MetaMask, WalletConnect, etc.)
      [{ type: "external_wallets" }],
    ],
    addPasskeyOnSignup: true,
  },
};

export const config = createConfig(
  {
    transport: alchemy({ apiKey: ALCHEMY_API_KEY }),
    chain: sepolia,
    ssr: true,
    enablePopupOauth: false,
    policyId: process.env.NEXT_PUBLIC_ALCHEMY_POLICY_ID,  // ← add this
  },
  uiConfig
);
