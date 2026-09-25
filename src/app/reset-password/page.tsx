import type { Metadata } from "next";
import { Suspense } from "react";
import { TopBar } from "@/components/layout/TopBar";
import { ResetPasswordClient } from "./ResetPasswordClient";

export const metadata: Metadata = {
  title: "Choose a New Password | Blissynest",
  robots: { index: false },
};

export default function ResetPasswordPage() {
  return (
    <>
      <TopBar />
      <Suspense fallback={null}>
        <ResetPasswordClient />
      </Suspense>
    </>
  );
}
