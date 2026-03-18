import { InputHTMLAttributes, useId } from 'react';

import { cn } from '@/lib/utils/cn';

type CheckboxFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'name' | 'required'> & {
  label: string;
  name: string;
  required?: boolean;
  error?: string;
  hint?: string;
};

export function CheckboxField({
  id,
  label,
  name,
  required,
  error,
  hint,
  className,
  'aria-describedby': ariaDescribedBy,
  ...props
}: CheckboxFieldProps) {
  const generatedId = useId();
  const fieldId = id ?? `${name}-${generatedId}`;
  const hintId = hint ? `${fieldId}-hint` : undefined;
  const errorId = error ? `${fieldId}-error` : undefined;
  const describedBy = [hintId, errorId, ariaDescribedBy].filter(Boolean).join(' ') || undefined;

  return (
    <div className="space-y-2">
      <label
        htmlFor={fieldId}
        className={cn(
          'flex cursor-pointer items-start gap-3 rounded-lg border bg-card/60 p-3 text-sm shadow-soft transition sm:p-4',
          error ? 'border-red-400/80' : 'border-border',
          className
        )}
      >
        <input
          id={fieldId}
          type="checkbox"
          name={name}
          required={required}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy}
          className="mt-0.5 h-4 w-4 border-border bg-transparent text-foreground focus-visible:ring-2 focus-visible:ring-white/25"
          {...props}
        />
        <span className="space-y-0.5">
          <span className="block font-medium text-foreground">
            {label}
            {required ? <span className="ml-1 text-xs text-muted">*</span> : null}
          </span>
          {hint ? (
            <span id={hintId} className="block text-xs text-muted">
              {hint}
            </span>
          ) : null}
        </span>
      </label>

      {error ? (
        <p id={errorId} className="text-xs font-medium text-red-300">
          {error}
        </p>
      ) : null}
    </div>
  );
}
