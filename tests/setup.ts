// Test setup file
// This runs before all tests

// Mock environment variables
process.env.DATABASE_URL = 'file:./test.db'
process.env.NODE_ENV = 'test'

// Global test timeout
jest.setTimeout(10000)

// Clean up after all tests
afterAll(async () => {
  // Add any global cleanup here
})

