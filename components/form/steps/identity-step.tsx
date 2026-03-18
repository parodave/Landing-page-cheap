'use client';

import { FileField } from '@/components/form/fields/file-field';
import { StepProps } from './types';

export function IdentityStep({ data, files, onSectionChange, onFilesChange }: StepProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <label htmlFor="brandName" className="text-sm font-medium text-foreground">
          Nom de marque
        </label>
        <input
          id="brandName"
          value={data.identity.brandName}
          onChange={(event) => onSectionChange('identity', 'brandName', event.target.value)}
          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground"
          placeholder="Ex. Atelier Nova"
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="legalName" className="text-sm font-medium text-foreground">
          Raison sociale
        </label>
        <input
          id="legalName"
          value={data.identity.legalName}
          onChange={(event) => onSectionChange('identity', 'legalName', event.target.value)}
          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground"
          placeholder="Ex. Nova Studio LLC"
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="industry" className="text-sm font-medium text-foreground">
          Secteur d&apos;activité
        </label>
        <input
          id="industry"
          value={data.identity.industry}
          onChange={(event) => onSectionChange('identity', 'industry', event.target.value)}
          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground"
          placeholder="Ex. Service local, e-commerce, coaching"
        />
      </div>

      <FileField
        label="Logo"
        name="logo"
        hint="PNG, JPG ou SVG. 1 fichier maximum."
        accept="image/*"
        maxFiles={1}
        files={files.logo}
        onFilesChange={(nextFiles) => onFilesChange('logo', nextFiles)}
      />
    </div>
  );
}
