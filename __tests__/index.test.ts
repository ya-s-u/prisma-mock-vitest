import type { PrismaClient } from '@prisma/client';
import { Role } from '@prisma/client';
import { suite, test, expect } from 'vitest';
import { createPrismaClient } from '../src';

suite('PrismaClient', () => {
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

  test('findOne', async () => {
    const client = await createPrismaClient<PrismaClient>(baseData);

    const user = await client.user.findUnique({
      where: {
        id: 1,
      },
    });

    expect(user).toEqual(baseData.user[0]);
  });

  test('findOne by id', async () => {
    const client = await createPrismaClient<PrismaClient>(baseData);
    const user = await client.account.findUnique({
      where: {
        id: 2,
      },
    });
    expect(user).toEqual(baseData.account[1]);
  });

  test('findMany', async () => {
    const client = await createPrismaClient<PrismaClient>(baseData);
    const accounts = await client.account.findMany();
    expect(accounts).toEqual(baseData.account);
  });

  test('findFirst', async () => {
    const client = await createPrismaClient<PrismaClient>(baseData);
    const accounts = await client.account.findFirst();
    expect(accounts).toEqual(baseData.account[0]);
  });

  test('count', async () => {
    const client = await createPrismaClient<PrismaClient>(baseData);
    const accounts = await client.account.count();
    expect(accounts).toEqual(2);
  });

  test('create', async () => {
    const client = await createPrismaClient<PrismaClient>(baseData);

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

  test('create connect', async () => {
    const client = await createPrismaClient<PrismaClient>(baseData);

    await client.user.create({
      data: {
        name: 'New user',
        account: { connect: { id: 1 } },
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
        accountId: 1,
        clicks: null,
      },
    ]);
  });

  test('delete', async () => {
    const client = await createPrismaClient<PrismaClient>(baseData);

    await client.account.delete({
      where: {
        id: 2,
      },
    });

    const users = await client.account.findMany();

    expect(users).toEqual([baseData.account[0]]);
  });

  test('update', async () => {
    const client = await createPrismaClient<PrismaClient>(baseData);

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
    const client = await createPrismaClient<PrismaClient>(baseData);

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
    const client = await createPrismaClient<PrismaClient>(baseData);

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

  test('connect implicit', async () => {
    const client = await createPrismaClient<PrismaClient>({});

    const account = await client.account.create({
      data: {
        id: 1,
        name: 'New account',
      },
    });

    const user = await client.user.create({
      data: {
        name: 'New user',
        guestOf: { connect: { id: 1 } },
      },
    });

    const users = await client.user.findMany({
      include: {
        guestOf: true,
      },
    });

    expect(users).toEqual([
      {
        ...user,
        guestOf: [account],
      },
    ]);
  });

  test('autoincoment', async () => {
    const client = await createPrismaClient<PrismaClient>({});

    const user = await client.user.create({
      data: {
        name: 'New user',
      },
    });

    expect(user.id).toEqual(1);

    await client.user.delete({
      where: {
        id: user.id,
      },
    });

    const user2 = await client.user.create({
      data: {
        name: 'New user 2',
      },
    });

    expect(user2.id).toEqual(2);
  });

  test('autoincoment: alternative id name', async () => {
    const client = await createPrismaClient<PrismaClient>({ user: baseData.user });

    const element = await client.element.create({
      data: {
        value: 'New element',
        user: {
          connect: {
            id: 1,
          },
        },
      },
    });
    expect(element.e_id).toEqual(1);

    const element2 = await client.element.create({
      data: {
        value: 'New element 2',
        user: {
          connect: {
            id: 1,
          },
        },
      },
    });
    expect(element2.e_id).toEqual(2);
  });

  suite('Connect or Create', () => {
    test('Connect to already existing user', async () => {
      const client = await createPrismaClient<PrismaClient>({
        user: [
          {
            id: 1,
            name: 'Old user',
          },
        ],
      });

      await expect(client.element.count()).resolves.toEqual(0);
      await expect(client.user.count()).resolves.toEqual(1);

      const element = await client.element.create({
        data: {
          value: 'New element',
          user: {
            connectOrCreate: {
              where: {
                id: 1,
              },
              create: {
                name: 'New user',
              },
            },
          },
        },
        select: {
          e_id: true,
          userId: true,
          value: true,
          user: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      expect(element.e_id).toEqual(1);
      expect(element.value).toEqual('New element');

      expect(element.userId).toEqual(1);
      expect(element.user.id).toEqual(1);
      expect(element.user.name).toEqual('Old user');

      await expect(client.element.count()).resolves.toEqual(1);
      await expect(client.user.count()).resolves.toEqual(1);
    });

    test('Create a new user when no user exists', async () => {
      const client = await createPrismaClient<PrismaClient>();

      const element = await client.element.create({
        data: {
          value: 'New element',
          user: {
            connectOrCreate: {
              where: {
                id: 1,
              },
              create: {
                name: 'New user',
              },
            },
          },
        },
        select: {
          e_id: true,
          userId: true,
          value: true,
          user: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      expect(element.e_id).toEqual(1);
      expect(element.value).toEqual('New element');

      expect(element.userId).toEqual(1);
      expect(element.user.id).toEqual(1);
      expect(element.user.name).toEqual('New user');

      await expect(client.element.count()).resolves.toEqual(1);
      await expect(client.user.count()).resolves.toEqual(1);
    });

    test('Create a new user when no user exists and connect multiple times', async () => {
      const client = await createPrismaClient<PrismaClient>();

      const element = await client.element.create({
        data: {
          value: 'New element',
          user: {
            connectOrCreate: {
              where: {
                id: 1,
              },
              create: {
                name: 'New user',
              },
            },
          },
        },
        select: {
          e_id: true,
          userId: true,
          value: true,
          user: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      expect(element.e_id).toEqual(1);
      expect(element.value).toEqual('New element');

      expect(element.userId).toEqual(1);
      expect(element.user.id).toEqual(1);
      expect(element.user.name).toEqual('New user');

      await expect(client.element.count()).resolves.toEqual(1);
      await expect(client.user.count()).resolves.toEqual(1);

      const altElement = await client.element.create({
        data: {
          value: 'Alt element',
          user: {
            connectOrCreate: {
              where: {
                id: element.userId,
              },
              create: {
                name: 'Alt user',
              },
            },
          },
        },
        select: {
          e_id: true,
          userId: true,
          value: true,
          user: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      expect(altElement.e_id).toEqual(2);
      expect(altElement.value).toEqual('Alt element');

      expect(altElement.userId).toEqual(element.userId);
      expect(altElement.user.id).toEqual(element.userId);
      expect(altElement.user.name).toEqual(element.user.name);

      await expect(client.element.count()).resolves.toEqual(2);
      await expect(client.user.count()).resolves.toEqual(1);
    });
  });
});
