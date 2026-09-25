import type { Metadata } from "next";
import { TopBar } from "@/components/layout/TopBar";
import { ForgotPasswordClient } from "./ForgotPasswordClient";

export const metadata: Metadata = {
  title: "Forgot Password | Blissynest",
  description: "Get a link to choose a new Blissynest password.",
  robots: { index: false },
};

export default function ForgotPasswordPage() {
  return (
    <>
      <TopBar />
      <ForgotPasswordClient />
    </>
  );
}
