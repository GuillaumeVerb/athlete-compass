"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type CloudHealth = {
  stripeCheckout: boolean;
};

type CheckoutStatus = "loading" | "ready";

type CheckoutContextValue = {
  status: CheckoutStatus;
  stripeCheckout: boolean;
  refresh: () => void;
};

const CheckoutContext = createContext<CheckoutContextValue | null>(null);

export function CheckoutProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<CheckoutStatus>("loading");
  const [stripeCheckout, setStripeCheckout] = useState(false);

  const load = useCallback(() => {
    queueMicrotask(() => {
      setStatus("loading");
      fetch("/api/health/cloud")
        .then((r) => r.json() as Promise<CloudHealth>)
        .then((data) => {
          setStripeCheckout(!!data.stripeCheckout);
          setStatus("ready");
        })
        .catch(() => {
          setStripeCheckout(false);
          setStatus("ready");
        });
    });
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const value = useMemo(
    () => ({
      status,
      stripeCheckout,
      refresh: load,
    }),
    [status, stripeCheckout, load],
  );

  return (
    <CheckoutContext.Provider value={value}>{children}</CheckoutContext.Provider>
  );
}

export function useCheckoutAvailability(): CheckoutContextValue {
  const ctx = useContext(CheckoutContext);
  if (!ctx) {
    throw new Error(
      "useCheckoutAvailability doit être utilisé sous <CheckoutProvider>",
    );
  }
  return ctx;
}
