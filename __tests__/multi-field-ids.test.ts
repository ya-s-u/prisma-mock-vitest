import { suite, test, expect } from 'vitest';
import { createPrismaClient } from '../src';

suite('@@id()', () => {
  const baseData = {
    user: [
      {
        id: 1,
        name: 'sadfsdf',
      },
    ],
    userAnswers: [
      {
        userId: 1,
        answerId: 2,
      },
    ],
    answers: [
      {
        id: 1,
        title: 'Answer',
      },
      {
        id: 2,
        title: 'Answer',
      },
      {
        id: 3,
        title: 'Answer',
      },
    ],
  };

  test('findOne', async () => {
    const client = await createPrismaClient(baseData);

    const user = await client.userAnswers.findUnique({
      where: {
        userId_answerId: {
          userId: 1,
          answerId: 2,
        },
      },
    });

    expect(user).toEqual(expect.objectContaining(baseData.userAnswers[0]));
  });

  test('findOne NOT found', async () => {
    const client = await createPrismaClient(baseData);

    const user = await client.userAnswers.findUnique({
      where: {
        userId_answerId: {
          userId: 2,
          answerId: 2,
        },
      },
    });

    expect(user).toEqual(null);
  });

  test('create', async () => {
    const client = await createPrismaClient(baseData);

    await client.userAnswers.create({
      data: {
        user: { connect: { id: 1 } },
        answer: { connect: { id: 1 } },
      },
    });

    const user = await client.userAnswers.findUnique({
      where: {
        userId_answerId: {
          userId: 1,
          answerId: 1,
        },
      },
    });

    expect(user).toBeDefined();
    expect(user?.userId).toEqual(1);
    expect(user?.answerId).toEqual(1);
  });

  // TODO: Delete
  test.todo('delete');

  // TODO: Update
  test.todo('update');

  test('upsert insert', async () => {
    const client = await createPrismaClient(baseData);

    const newItem1 = await client.userAnswers.upsert({
      create: {
        value: 'created',
        user: {
          connect: {
            id: 1,
          },
        },
        answer: {
          connect: {
            id: 1,
          },
        },
      },
      update: {
        value: 'updated',
      },
      where: {
        userId_answerId: {
          userId: 1,
          answerId: 1,
        },
      },
    });

    expect(newItem1.answerId).toEqual(1);
    expect(newItem1.value).toEqual('created');

    const newItem3 = await client.userAnswers.upsert({
      create: {
        value: 'created',
        user: {
          connect: {
            id: 1,
          },
        },
        answer: {
          connect: {
            id: 3,
          },
        },
      },
      update: {
        value: 'updated',
      },
      where: {
        userId_answerId: {
          userId: 1,
          answerId: 3,
        },
      },
    });

    expect(newItem3.value).toEqual('created');

    // const userAnswers = await client.userAnswers.findMany({}) //?
    // expect(userAnswers.length).toEqual(2)
    //

    // const found = await client.userAnswers.findUnique({
    //   where: {
    //     userId_answerId: {
    //       userId: 1,
    //       answerId: 1
    //     },
    //   },
    // })
    // expect(found.userId).toEqual(1)
  });

  test('upsert update', async () => {});

  test('updateMany', async () => {
    const client = await createPrismaClient(baseData);

    await client.userAnswers.create({
      data: {
        user: {
          connect: {
            id: 1,
          },
        },
        answer: {
          connect: {
            id: 1,
          },
        },
      },
    });

    await client.userAnswers.updateMany({
      data: {
        answerId: 2,
      },
    });

    const items = await client.userAnswers.findMany();

    expect(items.length).toEqual(2);
    expect(items[0]?.answerId).toEqual(2);
    expect(items[1]?.answerId).toEqual(2);
  });

  // TODO: Connect
  test.todo('connect');

  // TODO: Should throw on duplicate
  test.todo('should throw when there is a duplicate');
});
