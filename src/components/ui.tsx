import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { clsx } from "clsx";

type ButtonTone = "primary" | "secondary" | "ghost";

const buttonBase =
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-5 text-sm font-bold transition active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50";

const buttonTone: Record<ButtonTone, string> = {
  primary: "bg-brand-primary text-white shadow-soft hover:bg-brand-hover",
  secondary:
    "border border-brand-line bg-white text-brand-text shadow-sm hover:border-brand-primary",
  ghost: "text-brand-text hover:bg-white/70",
};

export function ButtonLink({
  className,
  tone = "primary",
  ...props
}: ComponentPropsWithoutRef<typeof Link> & { tone?: ButtonTone }) {
  return (
    <Link className={clsx(buttonBase, buttonTone[tone], className)} {...props} />
  );
}

export function Button({
  className,
  tone = "primary",
  ...props
}: ComponentPropsWithoutRef<"button"> & { tone?: ButtonTone }) {
  return (
    <button
      className={clsx(buttonBase, buttonTone[tone], className)}
      type={props.type ?? "button"}
      {...props}
    />
  );
}

export function PageSection({
  title,
  description,
  action,
  children,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="space-y-4">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-brand-text">{title}</h2>
          {description ? (
            <p className="mt-1 text-sm leading-6 text-stone-600">{description}</p>
          ) : null}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

export function Card({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const hasCustomBackground = /\bbg-/.test(className ?? "");

  return (
    <div
      className={clsx(
        "rounded-lg border border-brand-line p-4 shadow-sm",
        !hasCustomBackground && "bg-white",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function FieldLabel({ children }: { children: ReactNode }) {
  return <label className="text-sm font-semibold text-brand-text">{children}</label>;
}

export const inputClassName =
  "min-h-12 w-full rounded-lg border border-brand-line bg-white px-3 text-base text-brand-text outline-none transition placeholder:text-stone-400 focus:border-brand-primary focus:ring-4 focus:ring-brand-mint";
