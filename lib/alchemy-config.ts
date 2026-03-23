import { createConfig, cookieStorage, configForExternalWallets } from "@account-kit/react";
import { alchemy, sepolia } from "@account-kit/infra";
import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient();

export const externalWalletsConfig = configForExternalWallets({
  wallets: ["wallet_connect", "metamask", "coinbase wallet"],
  chainType: ["evm"],
  walletConnectProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,
});

export const config = createConfig(
  {
    transport: alchemy({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY! }),
    chain: sepolia,
    ssr: true,
    storage: cookieStorage,
    connectors: externalWalletsConfig.connectors,
  },
  {
    auth: {
      sections: [
        // WalletConnect + MetaMask row — no dashboard config needed
        [{ type: "external_wallets", ...externalWalletsConfig.uiConfig }],
      ],
      addPasskeyOnSignup: false,
    },
  }
);
