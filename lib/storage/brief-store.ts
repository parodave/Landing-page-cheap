import { promises as fs } from 'node:fs';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import type { BriefRecord, CreateBriefInput, UpdateBriefInput } from '@/lib/types/brief';

const BRIEFS_FILE_PATH = path.join(process.cwd(), 'data', 'briefs.json');

export type BriefStore = {
  createBrief: (input: CreateBriefInput) => Promise<BriefRecord>;
  updateBrief: (id: string, updates: UpdateBriefInput) => Promise<BriefRecord | null>;
  getBriefById: (id: string) => Promise<BriefRecord | null>;
  getBriefByStripeSessionId: (stripeSessionId: string) => Promise<BriefRecord | null>;
  getAllBriefs: () => Promise<BriefRecord[]>;
};

async function ensureBriefsFileExists() {
  try {
    await fs.access(BRIEFS_FILE_PATH);
  } catch {
    await fs.mkdir(path.dirname(BRIEFS_FILE_PATH), { recursive: true });
    await fs.writeFile(BRIEFS_FILE_PATH, '[]\n', 'utf8');
  }
}

async function readBriefs(): Promise<BriefRecord[]> {
  await ensureBriefsFileExists();

  const fileContent = await fs.readFile(BRIEFS_FILE_PATH, 'utf8');

  try {
    const parsed = JSON.parse(fileContent);
    return Array.isArray(parsed) ? (parsed as BriefRecord[]) : [];
  } catch {
    console.warn('[brief-store] Invalid JSON in data/briefs.json, resetting in-memory read to empty array.');
    return [];
  }
}

async function writeBriefs(briefs: BriefRecord[]) {
  await fs.writeFile(BRIEFS_FILE_PATH, `${JSON.stringify(briefs, null, 2)}\n`, 'utf8');
}

function mergeBrief(existingBrief: BriefRecord, updates: UpdateBriefInput): BriefRecord {
  return {
    ...existingBrief,
    ...updates,
    customer: updates.customer ? { ...existingBrief.customer, ...updates.customer } : existingBrief.customer,
    business: updates.business ? { ...existingBrief.business, ...updates.business } : existingBrief.business,
    offer: updates.offer ? { ...existingBrief.offer, ...updates.offer } : existingBrief.offer,
    design: updates.design ? { ...existingBrief.design, ...updates.design } : existingBrief.design,
    content: updates.content ? { ...existingBrief.content, ...updates.content } : existingBrief.content,
    contact: updates.contact ? { ...existingBrief.contact, ...updates.contact } : existingBrief.contact,
    assets: updates.assets ? { ...existingBrief.assets, ...updates.assets } : existingBrief.assets,
    payment: updates.payment ? { ...existingBrief.payment, ...updates.payment } : existingBrief.payment,
    updatedAt: new Date().toISOString()
  };
}

export function createLocalBriefStore(): BriefStore {
  return {
    async createBrief(input) {
      const briefs = await readBriefs();

      const now = new Date().toISOString();
      const brief: BriefRecord = {
        id: randomUUID(),
        createdAt: now,
        updatedAt: now,
        ...input
      };

      briefs.push(brief);
      await writeBriefs(briefs);

      return brief;
    },

    async updateBrief(id, updates) {
      const briefs = await readBriefs();
      const briefIndex = briefs.findIndex((brief) => brief.id === id);

      if (briefIndex < 0) {
        return null;
      }

      const updatedBrief = mergeBrief(briefs[briefIndex], updates);
      briefs[briefIndex] = updatedBrief;
      await writeBriefs(briefs);

      return updatedBrief;
    },

    async getBriefById(id) {
      const briefs = await readBriefs();
      return briefs.find((brief) => brief.id === id) ?? null;
    },

    async getBriefByStripeSessionId(stripeSessionId) {
      const briefs = await readBriefs();
      return briefs.find((brief) => brief.payment.stripeSessionId === stripeSessionId) ?? null;
    },

    async getAllBriefs() {
      return readBriefs();
    }
  };
}
