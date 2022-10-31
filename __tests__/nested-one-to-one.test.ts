import type { PrismaClient } from '@prisma/client';
import { suite, test, expect } from 'vitest';
import { createPrismaClient } from '../src';

suite('Nested One-To-One', () => {
  suite('Create', () => {
    test('create', async () => {
      const client = await createPrismaClient<PrismaClient>({});

      const user = await client.user.create({
        data: {
          role: 'USER',
          account: {
            create: {},
          },
        },
        include: {
          account: true,
        },
      });

      expect(user).toEqual({
        id: 1,
        accountId: 1,
        role: 'USER',
        deleted: false,
        clicks: null,
        name: null,
        account: {
          id: 1,
          name: null,
          date: null,
        },
      });
    });
  });

  suite('Update', () => {
    test('update', async () => {
      const client = await createPrismaClient<PrismaClient>({
        account: [{ id: 1, name: 'A' }],
        stripe: [
          {
            id: 2,
            accountId: 1,
          },
        ],
      });

      const answer = await client.stripe.update({
        data: {
          account: {
            update: {
              name: 'B',
            },
          },
        },
        where: {
          id: 2,
        },
        include: {
          account: true,
        },
      });

      expect(answer).toEqual({
        id: 2,
        accountId: 1,
        account: {
          id: 1,
          name: 'B',
        },
      });
    });
  });

  suite('Disconnect', () => {
    test('disconnect', async () => {
      const client = await createPrismaClient<PrismaClient>({
        account: [{ id: 1, name: 'A' }],
        stripe: [
          {
            id: 2,
            accountId: 1,
          },
        ],
      });

      const answer = await client.stripe.update({
        data: {
          account: {
            disconnect: true,
          },
        },
        where: {
          id: 2,
        },
        include: {
          account: true,
        },
      });

      expect(answer.account).toEqual(null);
    });

    test('disconnect other direction', async () => {
      const client = await createPrismaClient<PrismaClient>({
        account: [{ id: 1, name: 'A' }],
        stripe: [
          {
            id: 2,
            accountId: 1,
          },
        ],
      });

      const answer = await client.account.update({
        data: {
          stripe: {
            disconnect: true,
          },
        },
        where: {
          id: 1,
        },
        include: {
          stripe: true,
        },
      });

      expect(answer.stripe).toEqual(null);
    });
  });

  suite('Delete', () => {
    test('Delete', async () => {
      const client = await createPrismaClient<PrismaClient>({
        account: [{ id: 1, name: 'A' }],
        stripe: [
          {
            id: 2,
            accountId: 1,
          },
        ],
      });

      const answer = await client.stripe.update({
        data: {
          account: {
            delete: true,
          },
        },
        where: {
          id: 2,
        },
        include: {
          account: true,
        },
      });

      expect(answer.account).toEqual(null);

      const accounts = await client.account.findMany();
      expect(accounts).toEqual([]);
    });
  });

  suite('Select', () => {
    test('select', async () => {
      const client = await createPrismaClient<PrismaClient>({
        account: [
          { id: 1, name: 'A' },
          { id: 2, name: 'B' },
        ],
        stripe: [
          {
            id: 1,
            accountId: 1,
            active: false,
          },
          {
            id: 2,
            accountId: 2,
            active: true,
          },
        ],
      });

      const accounts = await client.account.findMany({
        where: {
          stripe: { active: true },
        },
      });

      expect(accounts).toHaveLength(1);
    });
  });
});
