import { suite, test, expect } from 'vitest';
import { createPrismaClient } from '../src';

suite('Queries with Include', () => {
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
        name: 'sadfsdf',
      },
      {
        id: 2,
        name: 'adsfasdf2',
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
      include: {
        account: true,
      },
    });

    expect(user).toEqual({
      ...baseData.user[0],
      account: baseData.account[0],
    });
  });

  test('findOne from', async () => {
    const client = await createPrismaClient(baseData);

    const stripe = await client.stripe.findUnique({
      where: {
        id: 1,
      },
      include: {
        account: true,
      },
    });

    expect(stripe).toEqual({
      ...baseData.stripe[0],
      account: baseData.account[0],
    });
  });

  test('findOne deep', async () => {
    const client = await createPrismaClient(baseData);

    const user = await client.user.findUnique({
      where: {
        id: 1,
      },
      include: {
        account: {
          include: {
            stripe: true,
          },
        },
      },
    });

    expect(user).toEqual({
      ...baseData.user[0],
      account: {
        ...baseData.account[0],
        stripe: baseData.stripe[0],
      },
    });
  });

  test('findMany deep', async () => {
    const client = await createPrismaClient(baseData);

    const users = await client.user.findMany({
      where: {
        id: 1,
      },
      include: {
        account: {
          include: {
            stripe: true,
          },
        },
      },
    });

    expect(users[0]).toEqual({
      ...baseData.user[0],
      account: {
        ...baseData.account[0],
        stripe: baseData.stripe[0],
      },
    });
  });

  test('findMany one to many', async () => {
    const client = await createPrismaClient(baseData);

    const users = await client.account.findMany({
      where: {
        id: 1,
      },
      include: {
        users: true,
      },
    });

    expect(users[0]).toEqual({
      ...baseData.account[0],
      users: [baseData.user[0]],
    });
  });
});
