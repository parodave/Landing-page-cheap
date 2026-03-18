import { promises as fs } from 'node:fs';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import type { CreateOrderInput, OrderRecord } from '@/lib/types/order';

const ORDERS_FILE_PATH = path.join(process.cwd(), 'data', 'orders.json');

async function ensureOrdersFileExists() {
  try {
    await fs.access(ORDERS_FILE_PATH);
  } catch {
    await fs.mkdir(path.dirname(ORDERS_FILE_PATH), { recursive: true });
    await fs.writeFile(ORDERS_FILE_PATH, '[]\n', 'utf8');
  }
}

async function readOrders(): Promise<OrderRecord[]> {
  await ensureOrdersFileExists();

  const fileContent = await fs.readFile(ORDERS_FILE_PATH, 'utf8');

  try {
    const parsed = JSON.parse(fileContent);
    return Array.isArray(parsed) ? (parsed as OrderRecord[]) : [];
  } catch {
    console.warn('[orders] Invalid JSON in data/orders.json, resetting in-memory read to empty array.');
    return [];
  }
}

async function writeOrders(orders: OrderRecord[]) {
  await fs.writeFile(ORDERS_FILE_PATH, `${JSON.stringify(orders, null, 2)}\n`, 'utf8');
}

export async function getOrderByStripeSessionId(stripeSessionId: string): Promise<OrderRecord | null> {
  const orders = await readOrders();
  return orders.find((order) => order.stripeSessionId === stripeSessionId) ?? null;
}

export async function saveOrder(input: CreateOrderInput): Promise<{ order: OrderRecord; created: boolean }> {
  const orders = await readOrders();
  const existingOrder = orders.find((order) => order.stripeSessionId === input.stripeSessionId);

  if (existingOrder) {
    return { order: existingOrder, created: false };
  }

  const order: OrderRecord = {
    id: randomUUID(),
    createdAt: input.createdAt ?? new Date().toISOString(),
    ...input
  };

  orders.push(order);
  await writeOrders(orders);

  return { order, created: true };
}

export const ordersRepository = {
  getOrderByStripeSessionId,
  saveOrder
};
