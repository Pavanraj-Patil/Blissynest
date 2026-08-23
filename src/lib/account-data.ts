import { bestsellers } from "@/lib/mock-data";
import { seedAddresses, type Address } from "@/lib/checkout-data";

export type AccountUser = {
  name: string;
  email: string;
  phone: string;
  memberSince: string;
};

export const accountUser: AccountUser = {
  name: "Meera Kapoor",
  email: "meera.kapoor@gmail.com",
  phone: "+91 98765 43210",
  memberSince: "March 2024",
};

export type OrderStatus = "Delivered" | "Shipped" | "Processing";

export type AccountOrderItem = {
  name: string;
  image: string;
  qty: number;
};

export type AccountOrder = {
  orderNumber: string;
  date: string;
  status: OrderStatus;
  items: AccountOrderItem[];
  total: number;
};

const [selfCareBox, warmHugs, gratitudeHamper, luxuryRose, calmCozy] = bestsellers;

export const accountOrders: AccountOrder[] = [
  {
    orderNumber: "BLS20260214512",
    date: "14 February 2026",
    status: "Delivered",
    items: [{ name: luxuryRose.name, image: luxuryRose.image, qty: 1 }],
    total: luxuryRose.price,
  },
  {
    orderNumber: "BLS20260130087",
    date: "30 January 2026",
    status: "Delivered",
    items: [
      { name: gratitudeHamper.name, image: gratitudeHamper.image, qty: 1 },
      { name: warmHugs.name, image: warmHugs.image, qty: 1 },
    ],
    total: gratitudeHamper.price + warmHugs.price,
  },
  {
    orderNumber: "BLS20251218934",
    date: "18 December 2025",
    status: "Shipped",
    items: [{ name: calmCozy.name, image: calmCozy.image, qty: 2 }],
    total: calmCozy.price * 2,
  },
  {
    orderNumber: "BLS20251105221",
    date: "5 November 2025",
    status: "Delivered",
    items: [{ name: selfCareBox.name, image: selfCareBox.image, qty: 1 }],
    total: selfCareBox.price,
  },
];

export const accountAddresses: Address[] = [
  ...seedAddresses,
  {
    id: "addr-2",
    label: "Work",
    name: "Meera Kapoor",
    line1: "4th Floor, Cerebrum IT Park, Kalyani Nagar",
    city: "Pune",
    state: "Maharashtra",
    pincode: "411006",
    phone: "+91 98765 43210",
  },
];
