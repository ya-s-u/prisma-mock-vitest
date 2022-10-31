import type { PrismaClient } from '@prisma/client';
import { suite, test, expect } from 'vitest';
import { createPrismaClient } from '../src';

suite('Referential Actions', () => {
  suite('onDelete', () => {
    test('SetNull', async () => {
      const client = await createPrismaClient<PrismaClient>({
        user: [{ id: 1, name: 'sadfsdf', accountId: 1 }],
        account: [{ id: 1, name: 'A' }],
      });

      await client.account.delete({
        where: { id: 1 },
      });

      const user = await client.user.findUnique({
        where: { id: 1 },
      });

      expect(user?.accountId ?? null).toEqual(null);
    });

    test('Cascade', async () => {
      const client = await createPrismaClient<PrismaClient>({
        stripe: [{ id: 1, accountId: 1 }],
        account: [{ id: 1, name: 'A' }],
      });

      await client.account.delete({
        where: { id: 1 },
      });

      const stripe = await client.stripe.findUnique({
        where: { id: 1 },
      });

      expect(stripe).toEqual(null);
    });
  });
});
