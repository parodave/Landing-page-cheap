'use client';

import { StepProps } from './types';

export function ActivityStep({ data, onSectionChange }: StepProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <label htmlFor="audience" className="text-sm font-medium text-foreground">
          Audience cible
        </label>
        <textarea
          id="audience"
          value={data.activity.audience}
          onChange={(event) => onSectionChange('activity', 'audience', event.target.value)}
          className="min-h-24 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground"
          placeholder="Qui sont vos clients idéaux ?"
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="businessGoal" className="text-sm font-medium text-foreground">
          Objectif principal
        </label>
        <textarea
          id="businessGoal"
          value={data.activity.businessGoal}
          onChange={(event) => onSectionChange('activity', 'businessGoal', event.target.value)}
          className="min-h-24 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground"
          placeholder="Quel résultat attendez-vous du site ?"
        />
      </div>
    </div>
  );
}
