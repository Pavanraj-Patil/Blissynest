import { TopBar } from "@/components/layout/TopBar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/home/Hero";
import { GiftingAssistant } from "@/components/home/GiftingAssistant";
import { WhoAreYouGifting } from "@/components/home/WhoAreYouGifting";
import { MadeForTheMoment } from "@/components/home/MadeForTheMoment";
import { BlissynestEdit } from "@/components/home/BlissynestEdit";
import { LovedByMany } from "@/components/home/LovedByMany";
import { CorporateBanner } from "@/components/home/CorporateBanner";
import { FeatureStrip } from "@/components/home/FeatureStrip";
import { CommunityStrip } from "@/components/home/CommunityStrip";

export default function Home() {
  return (
    <>
      <TopBar />
      <Header />
      <main>
        <Hero />
        <GiftingAssistant />
        <WhoAreYouGifting />
        <MadeForTheMoment />
        <BlissynestEdit />
        <LovedByMany />
        <CorporateBanner />
        <FeatureStrip />
        <CommunityStrip />
      </main>
      <Footer />
    </>
  );
}
