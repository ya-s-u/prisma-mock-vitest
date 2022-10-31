import { suite, test, expect } from 'vitest';
import { createPrismaClient } from '../../src';

suite('Model Queries > Select', () => {
  const baseData = {
    user: [
      {
        id: 1,
        name: 'sadfsdf',
        accountId: 1,
      },
    ],
    account: [
      {
        id: 1,
        name: 'B',
      },
      {
        id: 2,
        name: 'A',
      },
    ],
    stripe: [
      {
        id: 1,
        accountId: 1,
      },
    ],
  };

  test('findOne to', async () => {
    const client = await createPrismaClient(baseData);

    const user = await client.user.findUnique({
      where: {
        id: 1,
      },
      select: {
        id: true,
        account: true,
      },
    });

    expect(user).toEqual({
      id: baseData.user[0]?.id ?? 1,
      account: baseData.account[0],
    });
  });

  test('orderBy', async () => {
    const client = await createPrismaClient(baseData);

    const accounts = await client.account.findMany({
      orderBy: {
        name: 'asc',
      },
    });

    expect(accounts).toEqual([
      expect.objectContaining({
        id: 2,
        name: 'A',
      }),
      expect.objectContaining({
        id: 1,
        name: 'B',
      }),
    ]);
  });

  test('nested orderBy', async () => {
    const client = await createPrismaClient({
      account: [
        {
          id: 1,
          name: 'B',
        },
        {
          id: 2,
          name: 'A',
        },
      ],
      stripe: [
        {
          id: 1,
          accountId: 2,
        },
        {
          id: 2,
          accountId: 1,
        },
      ],
    });

    const accounts = await client.account.findMany({
      orderBy: {
        stripe: {
          id: 'asc',
        },
      },
    });

    expect(accounts).toEqual([
      expect.objectContaining({
        id: 2,
        name: 'A',
      }),
      expect.objectContaining({
        id: 1,
        name: 'B',
      }),
    ]);
  });
});
