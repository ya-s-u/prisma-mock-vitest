# Prisma Mock - Vitest

[![npm version](https://badge.fury.io/js/prisma-mock-vitest.svg)](http://badge.fury.io/js/prisma-mock-vitest)

This is a mock of the Prisma API, intended for unit testing with [Vitest](https://vitest.dev). All the data is stored in memory.

This library uses [vitest-mock-extended](https://github.com/eratio08/vitest-mock-extended), so if functionality you need is not implemented yet, you can mock it yourself.

Pull requests are welcome for missing features.

## Installation

```bash
yarn add -D prisma-mock-vitest
```

```bash
npm install prisma-mock-vitest --save-dev
```

You should also have run `npx prisma generate` for your Prisma schema.

## Usage

Simple example how to create a prisma mock instance:

```ts
import { createPrismaMock } from 'prisma-mock-vitest';
import { beforeEach, expect, test } from 'vitest';

let client: PrismaClient;

beforeEach(async () => {
  client = await createPrismaMock();
});

test('Initial user count is 0', async () => {
  const totalUsers = await client.user.count();
  expect(totalUsers).toEqual(0);
});
```

An example how to mock a global prisma instance inside and schema a 'db' directory (like blitzjs):

```ts
import type { PrismaClient } from '@prisma/client';
import { createPrismaMock } from 'prisma-mock-vitest';
import { beforeEach } from 'vitest';
import { mockDeep, mockReset } from 'vitest-mock-extended';

vi.mock('db', () => ({
  __esModule: true,
  ...jest.requireActual('db'),
  default: mockDeep<PrismaClient>(),
}));

import db, { Prisma } from 'db';

beforeEach(() => {
  mockReset(db);
  return createPrismaMock({}, Prisma.dmmf.datamodel, db);
});
```

## API

```ts
createPrismaMock<P extends PrismaClient = PrismaClient>(
  data: PrismaMockData<P> = {},
  datamodel?: Prisma.DMMF.Datamodel,
  client = mockDeep<P>(),
): Promise<P>;
```

### data

Object with an array default data for each table/model.

```ts
createPrismaMock({
  users: [
    {
      id: 1,
      name: 'John Doe',
      accountId: 1,
    },
  ],
  account: [
    {
      id: 1,
      name: 'Company',
    },
  ],
});
```

### datamodel

The datamodel of the prisma client, i.e. `Prisma.dmmf.datamodel`.

### client

`vitest-mock-extended` instance. If it's not provided, a new instance is created.

## Supported Features

A lot of the functionality is implemented, but parts are missing. Here is a list of the (missing) features.

### Model Queries

- findUnique,
- findMany,
- findFirst,
- create,
- createMany
- delete,
- update,
- deleteMany,
- updateMany
- upsert
- count
- TODO: aggregate
- TODO: groupBy

### Model Query Options

- distinct
- include
- where
- select
- orderBy
- TODO: select: \_count

### Nested Queries

- create
- createMany
- update
- updateMany
- delete
- deleteMany
- connect
- connectOrCreate
- disconnect
- TODO: set
- TODO: upsert

### Filter Conditions and Operators

- equals
- gt
- gte
- lt
- lte
- not
- in
- notIn
- contains
- startWith
- endsWith
- AND
- OR
- NOT
- TODO: search
- TODO: mode

### Relation Filters

- some
- every
- none
- TODO: is

### Scalar List Methods

TODO (set, push)

### Scalar List Filters

TODO (has, hasEvery, hasSome, isEmpty, equals)

### Atomic Number Operations

- increment
- decrement
- multiply
- divide
- set

### JSON Filters

TODO (path, string_contains, string_starts_with, string_ends_with, array_contains, array_starts_with, array_ends_with)

### Attributes

- @@id
- @default
- @unique (TODO: no error if duplicate)
- @@unique (TODO: no error if duplicate)
- @relation
- TODO: @updatedAt

### Attribute functions

- autoincrement()
- cuid()
- uuid()
- now()
- TODO: auto()
- TODO: dbgenerated()

### Referential actions

- onDelete (SetNull, Cascade)
- TODO: onDelete: Restrict, NoAction, SetDefault
- TODO: onUpdate
