import type { PrismaClient } from '@prisma/client';
import { Prisma } from '@prisma/client';
type UnwrapPromise<P> = P extends Promise<infer R> ? R : P;
type PrismaDelegate = {
    findUnique: (...args: Array<any>) => Promise<any>;
};
type IsTable<S> = S extends `\\$${infer _fnc}` ? never : S;
type IsString<S> = S extends string ? S : never;
type PrismaList<P extends {
    [key: string]: any;
}, K extends string> = P[K] extends PrismaDelegate ? Array<Partial<UnwrapPromise<ReturnType<P[K]['findUnique']>>>> : never;
export type PrismaMockData<P extends {
    [key: string]: any;
}> = Partial<{
    [key in IsTable<Uncapitalize<IsString<keyof P>>>]: PrismaList<P, key>;
}>;
declare const createPrismaMock: <P extends PrismaClient<Prisma.PrismaClientOptions, never, Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined, import("@prisma/client/runtime").DefaultArgs> = PrismaClient<Prisma.PrismaClientOptions, never, Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined, import("@prisma/client/runtime").DefaultArgs>>(data?: Partial<{ [key in IsTable<Uncapitalize<IsString<keyof P>>>]: PrismaList<P, key>; }>, datamodel?: Prisma.DMMF.Datamodel, client?: import("vitest-mock-extended").DeepMockProxy<P>) => Promise<P>;
export default createPrismaMock;
export { createPrismaMock, createPrismaMock as createPrismaClient };
//# sourceMappingURL=index.d.ts.map