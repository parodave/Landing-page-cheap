import { SelectHTMLAttributes, useId } from 'react';

import { cn } from '@/lib/utils/cn';

type SelectOption = {
  label: string;
  value: string;
};

type SelectFieldProps = Omit<SelectHTMLAttributes<HTMLSelectElement>, 'name' | 'required'> & {
  label: string;
  name: string;
  required?: boolean;
  error?: string;
  hint?: string;
  options: SelectOption[];
  placeholder?: string;
};

export function SelectField({
  id,
  label,
  name,
  required,
  error,
  hint,
  options,
  placeholder,
  className,
  'aria-describedby': ariaDescribedBy,
  ...props
}: SelectFieldProps) {
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

      <select
        id={fieldId}
        name={name}
        required={required}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy}
        className={cn(
          'w-full rounded-lg border bg-card/60 px-3.5 py-2.5 text-sm text-foreground shadow-soft transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/25',
          error ? 'border-red-400/80 focus-visible:ring-red-300/50' : 'border-border',
          className
        )}
        {...props}
      >
        {placeholder ? (
          <option value="" disabled={required}>
            {placeholder}
          </option>
        ) : null}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

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
