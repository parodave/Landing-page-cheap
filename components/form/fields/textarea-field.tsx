import { TextareaHTMLAttributes, useId } from 'react';

import { cn } from '@/lib/utils/cn';

type TextareaFieldProps = Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'name' | 'required'> & {
  label: string;
  name: string;
  required?: boolean;
  error?: string;
  hint?: string;
};

export function TextareaField({
  id,
  label,
  name,
  required,
  error,
  hint,
  className,
  rows = 5,
  'aria-describedby': ariaDescribedBy,
  ...props
}: TextareaFieldProps) {
  const generatedId = useId();
  const fieldId = id ?? `${name}-${generatedId}`;
  const hintId = hint ? `${fieldId}-hint` : undefined;
  const errorId = error ? `${fieldId}-error` : undefined;
  const describedBy = [hintId, errorId, ariaDescribedBy].filter(Boolean).join(' ') || undefined;

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1.5">
        <label htmlFor={fieldId} className="text-sm font-medium text-foreground">
          {label}
        </label>
        {required ? <span className="text-xs text-muted">*</span> : null}
      </div>

      <textarea
        id={fieldId}
        name={name}
        rows={rows}
        required={required}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy}
        className={cn(
          'w-full rounded-lg border bg-card/60 px-3.5 py-2.5 text-sm text-foreground shadow-soft transition placeholder:text-muted/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/25',
          error ? 'border-red-400/80 focus-visible:ring-red-300/50' : 'border-border',
          className
        )}
        {...props}
      />

      {hint ? (
        <p id={hintId} className="text-xs text-muted">
          {hint}
        </p>
      ) : null}

      {error ? (
        <p id={errorId} className="text-xs font-medium text-red-300">
          {error}
        </p>
      ) : null}
    </div>
  );
}
