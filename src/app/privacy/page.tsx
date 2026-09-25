import type { Metadata } from "next";
import { LegalDocument, type LegalSection } from "@/components/legal/LegalDocument";
import { getBusinessDetails } from "@/lib/content-service";

export const metadata: Metadata = {
  title: "Privacy Policy | Blissynest",
  description: "What personal information Blissynest collects, why, who it is shared with, and the choices you have.",
};

export default async function PrivacyPage() {
  const business = await getBusinessDetails();
  const name = business.legalName || "Blissynest";

  const sections: LegalSection[] = [
    {
      heading: "Information we collect",
      blocks: [
        { type: "p", text: "We only collect what we need to take, deliver and support your order:" },
        {
          type: "ul",
          items: [
            "Account details — your name, email address, phone number and a password (stored only as a one-way hash, never in readable form). If you sign in with Google we receive your name and email from Google.",
            "Order details — delivery addresses, items ordered, order value, payment method chosen, and any gift note or personalisation you enter.",
            "Photos you upload for personalised products, which we use only to make that order.",
            "Messages you send us through the contact, corporate quote or newsletter forms.",
            "Basic technical data such as your browser type and IP address, used to keep the site secure and to limit abuse.",
          ],
        },
        { type: "p", text: "We do not see or store your card, UPI or bank details. Online payments are handled entirely by our payment provider (Razorpay)." },
      ],
    },
    {
      heading: "How we use your information",
      blocks: [
        {
          type: "ul",
          items: [
            "To process, pack, ship and deliver your orders, and to tell you about their progress.",
            "To create and secure your account, and to help you if you forget your password.",
            "To answer your questions and handle returns, refunds and complaints.",
            "To send you our newsletter, only if you subscribed to it — you can unsubscribe at any time.",
            "To prevent fraud and misuse, and to meet our legal and tax obligations.",
          ],
        },
      ],
    },
    {
      heading: "Who we share it with",
      blocks: [
        { type: "p", text: "We do not sell your personal information. We share it only with the services that help us run the store, and only what each of them needs:" },
        {
          type: "ul",
          items: [
            "Payment provider (Razorpay) — to take online payments.",
            "Delivery partners (such as Shiprocket and the couriers it works with) — your name, address and phone number so your parcel can reach you.",
            "Email service — to send order and account emails.",
            "Hosting and image services (including Cloudflare) — to run the website and serve product images.",
            "Authorities, where the law requires it.",
          ],
        },
      ],
    },
    {
      heading: "Cookies and similar storage",
      blocks: [
        { type: "p", text: "We use a small number of essential cookies and browser storage to keep you signed in and to remember your cart and wishlist on your device. We do not use advertising or tracking cookies. If we add analytics in future, we will update this page." },
      ],
    },
    {
      heading: "How long we keep it",
      blocks: [
        { type: "p", text: "We keep order records for as long as tax and accounting law requires, and account details for as long as your account is open. Photos uploaded for personalised orders are kept only as long as needed to fulfil the order and handle any issue with it. You can ask us to delete your account at any time." },
      ],
    },
    {
      heading: "Your rights",
      blocks: [
        { type: "p", text: "Under India's Digital Personal Data Protection Act, 2023 you may ask us to:" },
        {
          type: "ul",
          items: [
            "show you the personal data we hold about you,",
            "correct anything that is wrong or out of date,",
            "delete your data (unless we must keep some of it by law), and",
            "withdraw consent you previously gave, for example to marketing emails.",
          ],
        },
        { type: "p", text: "Write to us using the contact details below and we will respond within a reasonable time. You can also update your name, phone number and addresses yourself from your account page." },
      ],
    },
    {
      heading: "Security",
      blocks: [
        { type: "p", text: "Passwords are stored hashed, connections to the site are encrypted, and access to customer data inside our team is limited to those who need it. No system is perfectly secure, so please use a strong, unique password and keep it private." },
      ],
    },
    {
      heading: "Children",
      blocks: [
        { type: "p", text: "Our store is meant for adults. We do not knowingly collect personal information from anyone under 18 without a parent or guardian's involvement." },
      ],
    },
    {
      heading: "Changes to this policy",
      blocks: [
        { type: "p", text: "If we change how we handle your information we will update this page and the date at the top. Material changes will also be flagged on the site." },
      ],
    },
  ];

  return (
    <LegalDocument
      title="Privacy Policy"
      intro={`This policy explains what personal information ${name} collects when you browse or shop with us, why we collect it, who we share it with, and the choices you have.`}
      sections={sections}
      business={business}
    />
  );
}
