import { Role } from '@prisma/client';
import { suite, test, expect } from 'vitest';
import { createPrismaClient } from '../../src';

suite('Model Queries > Basic', () => {
  const baseData = {
    user: [
      {
        id: 1,
        name: 'sadfsdf',
        accountId: 1,
        role: Role.ADMIN,
      },
    ],
    account: [
      {
        id: 1,
        name: 'sadfsdf',
        date: null,
      },
      {
        id: 2,
        name: 'adsfasdf2',
        date: null,
      },
    ],
  };

  test('findUnique - user', async () => {
    const client = await createPrismaClient(baseData);

    const user = await client.user.findUnique({
      where: {
        id: 1,
      },
    });

    expect(user).toEqual(baseData.user[0]);
  });

  test('findUnique - account', async () => {
    const client = await createPrismaClient(baseData);
    const user = await client.account.findUnique({
      where: {
        id: 2,
      },
    });
    expect(user).toEqual(baseData.account[1]);
  });

  test('findMany', async () => {
    const client = await createPrismaClient(baseData);
    const accounts = await client.account.findMany();
    expect(accounts).toEqual(baseData.account);
  });

  test('findFirst', async () => {
    const client = await createPrismaClient(baseData);
    const accounts = await client.account.findFirst();
    expect(accounts).toEqual(baseData.account[0]);
  });

  test('count', async () => {
    const client = await createPrismaClient(baseData);
    const accounts = await client.account.count();
    expect(accounts).toEqual(2);
  });

  test('create', async () => {
    const client = await createPrismaClient(baseData);

    await client.user.create({
      data: {
        name: 'New user',
      },
    });

    const users = await client.user.findMany();

    expect(users).toEqual([
      ...baseData.user,
      {
        id: 2,
        name: 'New user',
        role: 'ADMIN',
        deleted: false,
        clicks: null,
        accountId: null,
      },
    ]);
  });

  test('delete', async () => {
    const client = await createPrismaClient(baseData);

    await client.account.delete({
      where: {
        id: 2,
      },
    });

    const users = await client.account.findMany();

    expect(users).toEqual([baseData.account[0]]);
  });

  test('update', async () => {
    const client = await createPrismaClient(baseData);

    await client.account.update({
      where: {
        id: 2,
      },
      data: {
        name: 'New name',
      },
    });

    const users = await client.account.findMany();

    expect(users).toEqual([
      baseData.account[0],
      {
        id: 2,
        name: 'New name',
        date: null,
      },
    ]);
  });

  test('upsert update', async () => {
    const client = await createPrismaClient(baseData);

    // @ts-expect-error - We only want to test the update function of upsert.
    await client.account.upsert({
      where: {
        id: 2,
      },
      update: {
        name: 'New name',
      },
    });

    const users = await client.account.findMany();

    expect(users).toEqual([
      baseData.account[0],
      {
        id: 2,
        name: 'New name',
        date: null,
      },
    ]);
  });

  test('upsert create', async () => {
    const client = await createPrismaClient(baseData);

    await client.account.upsert({
      where: {
        id: 3,
      },
      create: {
        id: 3,
        name: 'New name',
      },
      update: {},
    });

    const users = await client.account.findMany();

    expect(users).toEqual([
      ...baseData.account,
      {
        id: 3,
        name: 'New name',
        date: null,
      },
    ]);
  });
});
