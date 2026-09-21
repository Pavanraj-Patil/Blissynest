import { TopBar } from "@/components/layout/TopBar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/home/Hero";
import { GiftingAssistant } from "@/components/home/GiftingAssistant";
import { SeasonalBanner } from "@/components/home/SeasonalBanner";
import { WhoAreYouGifting } from "@/components/home/WhoAreYouGifting";
import { MadeForTheMoment } from "@/components/home/MadeForTheMoment";
import { BlissynestEdit } from "@/components/home/BlissynestEdit";
import { LovedByMany } from "@/components/home/LovedByMany";
import { CorporateBanner } from "@/components/home/CorporateBanner";
import { FeatureStrip } from "@/components/home/FeatureStrip";
import { CommunityStrip } from "@/components/home/CommunityStrip";
import { getSectionVisibility } from "@/lib/content-service";

export default async function Home() {
  // Each block below can be switched off from Admin → Site Content. The
  // seasonal banner isn't in that list — it's managed (and has its own
  // active/inactive switches) under Admin → Banners.
  const show = await getSectionVisibility("home");

  return (
    <>
      <TopBar />
      <Header />
      <main>
        {show.hero && <Hero />}
        {show["gifting-assistant"] && <GiftingAssistant />}
        <SeasonalBanner />
        {show["who-are-you-gifting"] && <WhoAreYouGifting />}
        {show["made-for-the-moment"] && <MadeForTheMoment />}
        {show["blissynest-edit"] && <BlissynestEdit />}
        {show["loved-by-many"] && <LovedByMany />}
        {show["corporate-banner"] && <CorporateBanner />}
        {show["feature-strip"] && <FeatureStrip />}
        {show["community-strip"] && <CommunityStrip />}
      </main>
      <Footer />
    </>
  );
}
