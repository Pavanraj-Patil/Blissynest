import { db } from "@/lib/db";
import type { Banner } from "@/generated/prisma/client";
import type { BannerInput } from "@/lib/validations/banner";

export async function getActiveBanners(): Promise<Banner[]> {
  return db.banner.findMany({ where: { active: true }, orderBy: { sortOrder: "asc" } });
}

export async function getAllBannersForAdmin(): Promise<Banner[]> {
  return db.banner.findMany({ orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }] });
}

export async function createBanner(input: BannerInput): Promise<Banner> {
  return db.banner.create({ data: input });
}

export async function updateBanner(id: string, input: BannerInput): Promise<Banner | null> {
  const result = await db.banner.updateMany({ where: { id }, data: input });
  if (result.count === 0) return null;
  return db.banner.findUnique({ where: { id } });
}

export async function setBannerActive(id: string, active: boolean): Promise<void> {
  await db.banner.updateMany({ where: { id }, data: { active } });
}

export async function deleteBanner(id: string): Promise<void> {
  await db.banner.deleteMany({ where: { id } });
}
