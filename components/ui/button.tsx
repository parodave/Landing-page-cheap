import Link from 'next/link';
import { cn } from '@/lib/utils/cn';
import { ButtonHTMLAttributes, ReactNode } from 'react';

type ButtonBaseProps = {
  children: ReactNode;
  variant?: 'primary' | 'ghost';
  className?: string;
};

type LinkButtonProps = ButtonBaseProps & {
  href: string;
};

type NativeButtonProps = ButtonBaseProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'children'> & {
    href?: undefined;
  };

type ButtonProps = LinkButtonProps | NativeButtonProps;

export function Button({ children, href, variant = 'primary', className, ...buttonProps }: ButtonProps) {
  const base =
    'inline-flex h-11 items-center justify-center rounded-md px-5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 disabled:cursor-not-allowed disabled:opacity-50';

  const styles = {
    primary: 'bg-white text-black hover:bg-zinc-200',
    ghost: 'border border-border bg-transparent text-foreground hover:bg-zinc-900'
  } as const;

  if (href) {
    return (
      <Link href={href} className={cn(base, styles[variant], className)}>
        {children}
      </Link>
    );
  }

  return (
    <button className={cn(base, styles[variant], className)} {...buttonProps}>
      {children}
    </button>
  );
}
