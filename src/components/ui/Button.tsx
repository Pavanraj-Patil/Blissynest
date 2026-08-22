import Link from "next/link";
import { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "outline" | "dark";

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-olive text-cream hover:bg-olive-dark border border-olive",
  outline:
    "bg-transparent text-charcoal border border-charcoal/70 hover:bg-charcoal hover:text-cream",
  dark: "bg-charcoal text-cream hover:bg-charcoal/90 border border-charcoal",
};

type CommonProps = {
  children: ReactNode;
  variant?: Variant;
  className?: string;
};

type ButtonAsButton = CommonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };

type ButtonAsLink = CommonProps & {
  href: string;
};

export function Button(props: ButtonAsButton | ButtonAsLink) {
  const { children, variant = "primary", className } = props;

  const classes = cn(
    "inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-xs font-semibold tracking-[0.12em] uppercase transition-colors duration-200",
    variantClasses[variant],
    className
  );

  if ("href" in props && props.href) {
    return (
      <Link href={props.href} className={classes}>
        {children}
      </Link>
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { variant: _variant, className: _className, href: _href, ...buttonProps } =
    props as ButtonAsButton;
  return (
    <button {...buttonProps} className={classes}>
      {children}
    </button>
  );
}
