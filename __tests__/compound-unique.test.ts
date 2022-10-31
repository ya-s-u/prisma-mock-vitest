import type { PrismaClient } from '@prisma/client';
import { suite, test, expect } from 'vitest';
import { createPrismaClient } from '../src';

suite('@@unique()', () => {
  test('upsert insert', async () => {
    const client = await createPrismaClient<PrismaClient>({
      user: [
        {
          id: 1,
        },
      ],
    });

    const newItem1 = await client.element.upsert({
      create: {
        value: 'new',
        user: {
          connect: {
            id: 1,
          },
        },
      },
      update: {},
      where: {
        userId_value: {
          userId: 1,
          value: 'new',
        },
      },
    });

    expect(newItem1.userId).toEqual(1);
    expect(newItem1.value).toEqual('new');

    // @ts-expect-error - We only want to test the update function of upsert.
    const newItem2 = await client.element.upsert({
      update: {
        value: 'updated',
      },
      where: {
        userId_value: {
          userId: 1,
          value: 'new',
        },
      },
    });

    expect(newItem2.userId).toEqual(1);
    expect(newItem2.value).toEqual('updated');
  });
});
