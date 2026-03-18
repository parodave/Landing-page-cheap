import { ChangeEvent, InputHTMLAttributes, useId } from 'react';

import { cn } from '@/lib/utils/cn';

type FileFieldProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'type' | 'name' | 'required' | 'multiple' | 'accept' | 'onChange'
> & {
  label: string;
  name: string;
  required?: boolean;
  error?: string;
  hint?: string;
  multiple?: boolean;
  accept?: string;
  maxFiles?: number;
  files: File[];
  onFilesChange: (files: File[]) => void;
};

export function FileField({
  id,
  label,
  name,
  required,
  error,
  hint,
  multiple = false,
  accept,
  maxFiles,
  files,
  onFilesChange,
  className,
  'aria-describedby': ariaDescribedBy,
  ...props
}: FileFieldProps) {
  const generatedId = useId();
  const fieldId = id ?? `${name}-${generatedId}`;
  const hintId = hint ? `${fieldId}-hint` : undefined;
  const errorId = error ? `${fieldId}-error` : undefined;
  const describedBy = [hintId, errorId, ariaDescribedBy].filter(Boolean).join(' ') || undefined;
  const effectiveMaxFiles = maxFiles && maxFiles > 0 ? maxFiles : undefined;

  const formatBytes = (bytes: number) => {
    if (bytes < 1024) {
      return `${bytes} B`;
    }

    const kiloBytes = bytes / 1024;
    if (kiloBytes < 1024) {
      return `${kiloBytes.toFixed(1)} KB`;
    }

    return `${(kiloBytes / 1024).toFixed(1)} MB`;
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files ?? []);
    if (selectedFiles.length === 0) {
      return;
    }

    if (!multiple) {
      onFilesChange(selectedFiles.slice(0, 1));
      event.currentTarget.value = '';
      return;
    }

    const mergedFiles = [...files, ...selectedFiles];
    const nextFiles = effectiveMaxFiles ? mergedFiles.slice(0, effectiveMaxFiles) : mergedFiles;
    onFilesChange(nextFiles);
    event.currentTarget.value = '';
  };

  const handleRemoveFile = (indexToRemove: number) => {
    onFilesChange(files.filter((_, index) => index !== indexToRemove));
  };

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
        multiple={multiple}
        accept={accept}
        required={required}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy}
        onChange={handleChange}
        className={cn(
          'w-full rounded-lg border border-dashed bg-card/60 px-3 py-2 text-sm text-foreground shadow-soft file:mr-4 file:rounded-md file:border file:border-border file:bg-background file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-foreground hover:file:bg-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/25',
          error ? 'border-red-400/80 focus-visible:ring-red-300/50' : 'border-border',
          className
        )}
        {...props}
      />

      {files.length > 0 ? (
        <ul className="space-y-2 rounded-md border border-border bg-background/60 p-2.5">
          {files.map((file, index) => (
            <li key={`${file.name}-${file.size}-${index}`} className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate text-sm text-foreground">{file.name}</p>
                <p className="text-xs text-muted">{formatBytes(file.size)}</p>
              </div>
              <button
                type="button"
                onClick={() => handleRemoveFile(index)}
                className="shrink-0 rounded-md border border-border bg-card px-2 py-1 text-xs text-foreground transition hover:bg-background"
              >
                Supprimer
              </button>
            </li>
          ))}
        </ul>
      ) : null}

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
