import type { ReactNode } from "react";
import { TopBar } from "@/components/layout/TopBar";
import { Header } from "@/components/layout/Header";
import { ShopFooter } from "@/components/shop/ShopFooter";
import { ShopGiftBanner } from "@/components/shop/ShopGiftBanner";
import { StandardFeatureStrip } from "@/components/shop/StandardFeatureStrip";
import { Breadcrumb } from "@/components/shop/Breadcrumb";

type ProductPageShellProps = {
  breadcrumbCategory: string;
  productName: string;
  children: ReactNode;
};

export function ProductPageShell({
  breadcrumbCategory,
  productName,
  children,
}: ProductPageShellProps) {
  return (
    <>
      <TopBar />
      <Header />
      <main>
        <div className="mx-auto max-w-[1440px] px-4 md:px-8 pt-5 pb-12 md:pb-16">
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Shop", href: "/shop" },
              { label: breadcrumbCategory },
              { label: productName },
            ]}
          />
          <div className="mt-6">{children}</div>
        </div>

        <div className="mx-auto max-w-[1440px] px-4 md:px-8 pb-14">
          <ShopGiftBanner />
        </div>

        <div className="mx-auto max-w-[1440px] px-4 md:px-8 pb-14">
          <StandardFeatureStrip />
        </div>
      </main>
      <ShopFooter />
    </>
  );
}
