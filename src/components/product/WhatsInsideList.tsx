import { getIcon } from "./icon-map";

type WhatsInsideListProps = {
  items: { icon: string; name: string; subtitle: string; qty: string }[];
};

export function WhatsInsideList({ items }: WhatsInsideListProps) {
  return (
    <ul className="space-y-3">
      {items.map((item) => {
        const Icon = getIcon(item.icon);
        return (
          <li key={item.name} className="flex items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cream-dark text-terracotta">
              <Icon size={18} strokeWidth={1.5} />
            </span>
            <span className="flex-1 min-w-0">
              <span className="block text-sm font-medium text-charcoal">
                {item.name}
              </span>
              <span className="block text-xs text-ink-muted">{item.subtitle}</span>
            </span>
            <span className="text-xs font-medium text-charcoal-light shrink-0">
              {item.qty}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
