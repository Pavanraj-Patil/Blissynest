import type { Metadata } from "next";
import { PersonalisedPageClient } from "./PersonalisedPageClient";

export const metadata: Metadata = {
  title: "Personalised Gifts | Blissynest",
  description:
    "Thoughtful gifts made uniquely theirs — engraved, monogrammed, and made to remember.",
};

export default function PersonalisedPage() {
  return <PersonalisedPageClient />;
}
