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

  test('Falsy value in select object returns undefined for value', async () => {
    const client = await createPrismaClient(baseData);

    const userWithName = await client.user.findUnique({
      where: {
        id: 1,
      },
      select: {
        id: true,
        name: true,
      },
    });

    expect(userWithName?.id).toEqual(baseData.user[0]?.id ?? 1);
    expect(userWithName?.name).toEqual(baseData.user[0]?.name ?? 'B');

    const userWithoutName = await client.user.findUnique({
      where: {
        id: 1,
      },
      select: {
        id: true,
        name: false,
      },
    });

    expect(userWithoutName?.id).toEqual(userWithName?.id);
    expect((userWithoutName as { name?: string } | null)?.name).toBeUndefined();
  });

  test('Nested falsy value in select object returns undefined for value', async () => {
    const client = await createPrismaClient(baseData);

    const userWithAccountName = await client.user.findUnique({
      where: {
        id: 1,
      },
      select: {
        id: true,
        name: true,
        accountId: true,
        account: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    expect(userWithAccountName?.id).toEqual(baseData.user[0]?.id ?? 1);
    expect(userWithAccountName?.name).toEqual(baseData.user[0]?.name ?? 'sadfsdf');
    expect(userWithAccountName?.accountId).toEqual(baseData.user[0]?.accountId ?? 1);

    expect(userWithAccountName?.account).toBeDefined();
    expect(userWithAccountName?.account?.id).toEqual(userWithAccountName?.accountId);
    expect(userWithAccountName?.account?.name).toEqual(baseData.account[0]?.name ?? 'B');

    const userWithoutAccountName = await client.user.findUnique({
      where: {
        id: 1,
      },
      select: {
        id: true,
        name: true,
        accountId: true,
        account: {
          select: {
            id: true,
            name: false,
          },
        },
      },
    });

    expect(userWithoutAccountName?.id).toEqual(userWithAccountName?.id);
    expect(userWithoutAccountName?.name).toEqual(userWithAccountName?.name);

    expect(userWithoutAccountName?.account).toBeDefined();
    expect(userWithoutAccountName?.account?.id).toEqual(userWithoutAccountName?.accountId);
    expect((userWithoutAccountName?.account as { name?: string | null })?.name).toBeUndefined();
  });
});
