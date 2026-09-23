import { Analytics as VercelAnalytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { AnalyticsEvents } from "@/components/AnalyticsEvents";

export function Analytics() {
  return (
    <>
      <VercelAnalytics />
      <SpeedInsights />
      <AnalyticsEvents />
    </>
  );
}
