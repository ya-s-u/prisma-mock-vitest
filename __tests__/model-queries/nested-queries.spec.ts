import { Role } from '@prisma/client';
import { suite, test, expect } from 'vitest';
import { createPrismaClient } from '../../src';

suite('Model Queries > Nested', () => {
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

  suite('Connect', () => {
    test('Create and Connect', async () => {
      const client = await createPrismaClient(baseData);

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

    test('Connect Implicit', async () => {
      const client = await createPrismaClient({});

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
  });

  suite('Connect or Create', () => {
    test('Connect to already existing user', async () => {
      const client = await createPrismaClient({
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
      const client = await createPrismaClient();

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
      const client = await createPrismaClient();

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
