"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import type { SalesPoint, StatusCount } from "@/lib/admin/dashboard-service";

const statusLabels: Record<string, string> = {
  PLACED: "Placed",
  CONFIRMED: "Confirmed",
  PACKED: "Packed",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
};

const statusColors: Record<string, string> = {
  PLACED: "#cfb587",
  CONFIRMED: "#c1693d",
  PACKED: "#e3a37e",
  SHIPPED: "#4a5738",
  DELIVERED: "#64754a",
  CANCELLED: "#a85830",
};

function CurrencyTooltip({ active, payload, label }: { active?: boolean; payload?: { value: number; name: string }[]; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-charcoal/10 bg-white px-3 py-2 shadow-lg text-xs">
      <p className="font-medium text-charcoal">{label}</p>
      {payload.map((p) => (
        <p key={p.name} className="text-ink-muted">
          {p.name === "revenue" ? "Revenue" : "Orders"}: {p.name === "revenue" ? `₹${p.value.toLocaleString("en-IN")}` : p.value}
        </p>
      ))}
    </div>
  );
}

export function SalesOverviewChart({ data }: { data: SalesPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#2a262115" vertical={false} />
        <XAxis
          dataKey="label"
          tick={{ fontSize: 11, fill: "#7a7267" }}
          axisLine={{ stroke: "#2a262120" }}
          tickLine={false}
        />
        <YAxis tick={{ fontSize: 11, fill: "#7a7267" }} axisLine={false} tickLine={false} width={50} />
        <Tooltip content={<CurrencyTooltip />} />
        <Line type="monotone" dataKey="revenue" name="revenue" stroke="#4a5738" strokeWidth={2} dot={false} />
        <Line type="monotone" dataKey="orders" name="orders" stroke="#c1693d" strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function OrdersByStatusChart({ data }: { data: StatusCount[] }) {
  const total = data.reduce((sum, d) => sum + d.count, 0);

  if (total === 0) {
    return (
      <div className="flex h-52 items-center justify-center text-sm text-ink-muted">
        No orders in this period yet.
      </div>
    );
  }

  return (
    <div className="flex items-center gap-6">
      <ResponsiveContainer width={160} height={160}>
        <PieChart>
          <Pie
            data={data}
            dataKey="count"
            nameKey="status"
            innerRadius={48}
            outerRadius={72}
            paddingAngle={2}
            strokeWidth={0}
          >
            {data.map((d) => (
              <Cell key={d.status} fill={statusColors[d.status] ?? "#7a7267"} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="flex-1 space-y-1.5">
        {data.map((d) => (
          <div key={d.status} className="flex items-center gap-2 text-xs">
            <span
              className="h-2.5 w-2.5 shrink-0 rounded-full"
              style={{ backgroundColor: statusColors[d.status] ?? "#7a7267" }}
            />
            <span className="text-charcoal-light">{statusLabels[d.status] ?? d.status}</span>
            <span className="ml-auto font-medium text-charcoal">
              {d.count} ({Math.round((d.count / total) * 100)}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
