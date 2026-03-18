import { InputHTMLAttributes, useId } from 'react';

import { cn } from '@/lib/utils/cn';

type FileFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'name' | 'required'> & {
  label: string;
  name: string;
  required?: boolean;
  error?: string;
  hint?: string;
};

export function FileField({
  id,
  label,
  name,
  required,
  error,
  hint,
  className,
  'aria-describedby': ariaDescribedBy,
  ...props
}: FileFieldProps) {
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

      <input
        id={fieldId}
        type="file"
        name={name}
        required={required}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy}
        className={cn(
          'w-full rounded-lg border border-dashed bg-card/60 px-3 py-2 text-sm text-foreground shadow-soft file:mr-4 file:rounded-md file:border file:border-border file:bg-background file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-foreground hover:file:bg-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/25',
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
