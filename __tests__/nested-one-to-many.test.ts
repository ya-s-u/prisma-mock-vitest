import { suite, test, expect } from 'vitest';
import { createPrismaClient } from '../src';

suite('Nested One-To-Many', () => {
  suite('Create', () => {
    test('create', async () => {
      const client = await createPrismaClient({});

      const account = await client.account.create({
        data: {
          users: {
            create: {
              role: 'USER',
            },
          },
        },
        include: {
          users: true,
        },
      });

      const users = await client.user.findMany();
      expect(users.length).toEqual(1);

      expect(account).toEqual({
        id: 1,
        name: null,
        date: null,
        users: [
          {
            id: 1,
            accountId: 1,
            role: 'USER',
            deleted: false,
            clicks: null,
            name: null,
          },
        ],
      });
    });

    test('create (array)', async () => {
      const client = await createPrismaClient({});

      const account = await client.account.create({
        data: {
          users: {
            create: [
              {
                role: 'USER',
              },
              {
                role: 'ADMIN',
              },
            ],
          },
        },
        include: {
          users: true,
        },
      });

      expect(account).toEqual({
        id: 1,
        name: null,
        date: null,
        users: [
          {
            id: 1,
            role: 'USER',
            accountId: 1,
            deleted: false,
            clicks: null,
            name: null,
          },
          {
            id: 2,
            role: 'ADMIN',
            accountId: 1,
            deleted: false,
            clicks: null,
            name: null,
          },
        ],
      });
    });

    test('createMany', async () => {
      const client = await createPrismaClient({
        answers: [],
        userAnswers: [],
        user: [{ id: 1, role: 'USER' }],
      });

      const answer = await client.answers.create({
        data: {
          title: 'Title',
          users: {
            createMany: {
              data: [{ userId: 1 }],
            },
          },
        },
        include: {
          users: true,
        },
      });

      expect(answer).toEqual({
        title: 'Title',
        id: 1,
        users: [
          {
            answerId: 1,
            userId: 1,
            value: null,
            // userId_answerId: { answerId: 2, userId: 1 },
          },
        ],
      });
    });
  });

  suite('Update', () => {
    test('createMany', async () => {
      const client = await createPrismaClient({
        answers: [{ id: 1, title: 'Title' }],
        userAnswers: [],
        user: [{ id: 1, role: 'USER' }],
      });

      const answer = await client.answers.update({
        data: {
          users: {
            createMany: {
              data: [{ userId: 1 }],
            },
          },
        },
        where: { id: 1 },
        include: {
          users: true,
        },
      });

      expect(answer).toEqual({
        title: 'Title',
        id: 1,
        users: [
          {
            answerId: 1,
            userId: 1,
            value: null,
            // TODO:
            // userId_answerId: { answerId: 1, userId: 1 },
          },
        ],
      });
    });

    test('updateMany', async () => {
      const client = await createPrismaClient({
        account: [{ id: 1 }],
        stripe: [
          {
            customerId: '1',
            accountId: 1,
          },
        ],
        user: [{ id: 2, role: 'ADMIN', accountId: 1 }],
      });

      const answer = await client.account.update({
        data: {
          users: {
            updateMany: [
              {
                data: {
                  role: 'USER',
                },
                where: {
                  accountId: 1,
                },
              },
            ],
          },
        },
        where: {
          id: 1,
        },
        include: {
          users: true,
        },
      });

      expect(answer).toEqual({
        id: 1,
        users: [
          {
            id: 2,
            accountId: 1,
            role: 'USER',
          },
        ],
      });
    });

    test('update', async () => {
      const client = await createPrismaClient({
        account: [{ id: 1 }],
        stripe: [
          {
            customerId: '1',
            accountId: 1,
          },
        ],
        user: [{ id: 2, role: 'ADMIN', accountId: 1 }],
      });

      const answer = await client.account.update({
        data: {
          users: {
            update: [
              {
                data: {
                  role: 'USER',
                },
                where: {
                  id: 2,
                },
              },
            ],
          },
        },
        where: {
          id: 1,
        },
        include: {
          users: true,
        },
      });

      expect(answer).toEqual({
        id: 1,
        users: [
          {
            id: 2,
            accountId: 1,
            role: 'USER',
          },
        ],
      });
    });

    suite('Delete', () => {
      test('deleteMany array', async () => {
        const client = await createPrismaClient({
          account: [{ id: 1, name: 'A' }],
          user: [
            {
              id: 2,
              accountId: 1,
            },
            {
              id: 3,
              accountId: 1,
            },
          ],
        });

        await client.account.update({
          data: {
            users: {
              update: [{ where: { id: 1 }, data: { name: 'Piet' } }],
              deleteMany: [{ id: 2 }],
            },
          },
          where: {
            id: 1,
          },
          include: {
            users: true,
          },
        });

        const account = await client.account.findUnique({
          where: {
            id: 1,
          },
          include: {
            users: true,
          },
        });

        expect(account?.users.length).toEqual(1);
      });

      test('deleteMany object', async () => {
        const client = await createPrismaClient({
          account: [{ id: 1, name: 'A' }],
          user: [
            {
              id: 2,
              accountId: 1,
            },
            {
              id: 3,
              accountId: 1,
            },
          ],
        });

        await client.account.update({
          data: {
            users: {
              deleteMany: { id: 2 },
            },
          },
          where: {
            id: 1,
          },
          include: {
            users: true,
          },
        });

        const account = await client.account.findUnique({
          where: {
            id: 1,
          },
          include: {
            users: true,
          },
        });

        expect(account?.users.length).toEqual(1);
      });

      test('delete array', async () => {
        const client = await createPrismaClient({
          account: [{ id: 1, name: 'A' }],
          user: [
            {
              id: 2,
              accountId: 1,
            },
            {
              id: 3,
              accountId: 1,
            },
          ],
        });

        await client.account.update({
          data: {
            users: {
              update: [{ where: { id: 1 }, data: { name: 'Piet' } }],
              delete: [{ id: 2 }],
            },
          },
          where: {
            id: 1,
          },
          include: {
            users: true,
          },
        });

        const account = await client.account.findUnique({
          where: {
            id: 1,
          },
          include: {
            users: true,
          },
        });

        expect(account?.users.length).toEqual(1);
      });

      test('delete object', async () => {
        const client = await createPrismaClient({
          account: [{ id: 1, name: 'A' }],
          user: [
            {
              id: 2,
              accountId: 1,
            },
            {
              id: 3,
              accountId: 1,
            },
          ],
        });

        await client.account.update({
          data: {
            users: {
              delete: { id: 2 },
            },
          },
          where: {
            id: 1,
          },
          include: {
            users: true,
          },
        });

        const account = await client.account.findUnique({
          where: {
            id: 1,
          },
          include: {
            users: true,
          },
        });

        expect(account?.users.length).toEqual(1);
      });
    });
  });

  suite('Select', async () => {
    test('select', async () => {
      const client = await createPrismaClient({
        account: [
          { id: 1, name: 'A' },
          { id: 2, name: 'B' },
        ],
        user: [{ id: 1, role: 'USER', accountId: 1, deleted: true }],
      });

      const accounts = await client.account.findMany({
        where: {
          users: {
            every: {
              deleted: true,
            },
          },
        },
      });

      expect(accounts).toHaveLength(1);
    });
  });
});
