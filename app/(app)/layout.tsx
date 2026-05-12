import { AppShell } from "@/components/layout/app-shell";
import { CheckoutProvider } from "@/components/checkout/checkout-context";
import { DailyStepsCloudBootstrap } from "@/components/daily/daily-steps-cloud-bootstrap";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppShell>
      <CheckoutProvider>
        <DailyStepsCloudBootstrap />
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6 lg:p-10">
          {children}
        </main>
      </CheckoutProvider>
    </AppShell>
  );
}
