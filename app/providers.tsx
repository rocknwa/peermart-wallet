"use client";

import { AlchemyAccountProvider } from "@account-kit/react";
import { QueryClientProvider } from "@tanstack/react-query";
import { config, queryClient } from "@/lib/alchemy-config";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <AlchemyAccountProvider config={config} queryClient={queryClient}>
        {children}
      </AlchemyAccountProvider>
    </QueryClientProvider>
  );
}
