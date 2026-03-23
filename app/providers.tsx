"use client";

import { AlchemyAccountProvider, type AlchemyAccountsProviderProps } from "@account-kit/react";
import { QueryClientProvider } from "@tanstack/react-query";
import { config, queryClient } from "@/lib/alchemy-config";
import type { PropsWithChildren } from "react";

export function Providers(
  props: PropsWithChildren<{ initialState?: AlchemyAccountsProviderProps["initialState"] }>
) {
  return (
    <QueryClientProvider client={queryClient}>
      <AlchemyAccountProvider
        config={config}
        queryClient={queryClient}
        initialState={props.initialState}
      >
        {props.children}
      </AlchemyAccountProvider>
    </QueryClientProvider>
  );
}
