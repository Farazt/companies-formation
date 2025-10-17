import { PrismaClient } from '@prisma/client'
import { mockDeep, mockReset, DeepMockProxy } from 'jest-mock-extended'

// Mock Prisma Client
export const prismaMock = mockDeep<PrismaClient>() as unknown as DeepMockProxy<PrismaClient>

// Reset mocks between tests
beforeEach(() => {
  mockReset(prismaMock)
})

// Mock the prisma module
jest.mock('@/lib/prisma', () => ({
  __esModule: true,
  prisma: prismaMock,
}))

