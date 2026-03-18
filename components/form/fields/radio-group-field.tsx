import { InputHTMLAttributes, useId } from 'react';

import { cn } from '@/lib/utils/cn';

type RadioOption = {
  label: string;
  value: string;
  hint?: string;
  disabled?: boolean;
};

type RadioItemProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'type' | 'name' | 'required' | 'value' | 'children'
>;

type RadioGroupFieldProps = RadioItemProps & {
  label: string;
  name: string;
  required?: boolean;
  error?: string;
  hint?: string;
  options: RadioOption[];
};

export function RadioGroupField({
  id,
  label,
  name,
  required,
  error,
  hint,
  options,
  className,
  'aria-describedby': ariaDescribedBy,
  ...props
}: RadioGroupFieldProps) {
  const generatedId = useId();
  const groupId = id ?? `${name}-${generatedId}`;
  const hintId = hint ? `${groupId}-hint` : undefined;
  const errorId = error ? `${groupId}-error` : undefined;
  const describedBy = [hintId, errorId, ariaDescribedBy].filter(Boolean).join(' ') || undefined;

  return (
    <fieldset
      id={groupId}
      aria-invalid={Boolean(error)}
      aria-describedby={describedBy}
      className={cn(
        'space-y-3 rounded-lg border border-border bg-card/50 p-3 sm:p-4',
        error ? 'border-red-400/80' : '',
        className
      )}
    >
      <legend className="px-1 text-sm font-medium text-foreground">
        {label}
        {required ? <span className="ml-1 text-xs text-muted">*</span> : null}
      </legend>

      <div className="space-y-2">
        {options.map((option, index) => {
          const optionId = `${groupId}-option-${index}`;

          return (
            <label
              key={option.value}
              htmlFor={optionId}
              className="flex cursor-pointer items-start gap-3 rounded-md border border-border/80 bg-background/50 p-3"
            >
              <input
                id={optionId}
                type="radio"
                name={name}
                value={option.value}
                required={required && index === 0}
                disabled={option.disabled}
                className="mt-0.5 h-4 w-4 border-border bg-transparent text-foreground focus-visible:ring-2 focus-visible:ring-white/25"
                {...props}
              />
              <span className="space-y-0.5">
                <span className="block text-sm text-foreground">{option.label}</span>
                {option.hint ? <span className="block text-xs text-muted">{option.hint}</span> : null}
              </span>
            </label>
          );
        })}
      </div>

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
    </fieldset>
  );
}
