import { db } from "@/lib/db";
import type { LeadStatus } from "@/generated/prisma/client";

export async function getCorporateLeadsForAdmin(params: {
  status?: LeadStatus;
  page: number;
  pageSize: number;
}) {
  const { status, page, pageSize } = params;
  const where = status ? { status } : {};

  const [leads, total] = await Promise.all([
    db.corporateLead.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    db.corporateLead.count({ where }),
  ]);

  return { leads, total };
}

export async function setCorporateLeadStatus(id: string, status: LeadStatus) {
  const lead = await db.corporateLead.findUnique({ where: { id } });
  if (!lead) return { error: "Lead not found.", status: 404 } as const;

  await db.corporateLead.update({ where: { id }, data: { status } });
  return { success: true } as const;
}

export async function getContactMessagesForAdmin(params: { page: number; pageSize: number }) {
  const { page, pageSize } = params;

  const [messages, total] = await Promise.all([
    db.contactMessage.findMany({
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    db.contactMessage.count(),
  ]);

  return { messages, total };
}

export async function getNewsletterSubscribersForAdmin(params: { page: number; pageSize: number }) {
  const { page, pageSize } = params;

  const [subscribers, total] = await Promise.all([
    db.newsletterSubscriber.findMany({
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    db.newsletterSubscriber.count(),
  ]);

  return { subscribers, total };
}
