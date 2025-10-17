import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'

/**
 * Repository layer for Company database operations
 * Handles all direct interactions with the database via Prisma
 */
export class CompanyRepository {
  /**
   * Find all companies, ordered by creation date (newest first)
   */
  async findAll() {
    return await prisma.company.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })
  }

  /**
   * Find a company by ID
   */
  async findById(id: string) {
    return await prisma.company.findUnique({
      where: { id }
    })
  }

  /**
   * Create a new company
   */
  async create(data: Prisma.CompanyCreateInput) {
    return await prisma.company.create({
      data
    })
  }

  /**
   * Update a company by ID
   */
  async update(id: string, data: Prisma.CompanyUpdateInput) {
    return await prisma.company.update({
      where: { id },
      data
    })
  }

  /**
   * Delete a company by ID
   */
  async delete(id: string) {
    return await prisma.company.delete({
      where: { id }
    })
  }

  /**
   * Count total companies
   */
  async count() {
    return await prisma.company.count()
  }

  /**
   * Find companies by jurisdiction
   */
  async findByJurisdiction(jurisdiction: string) {
    return await prisma.company.findMany({
      where: { jurisdiction },
      orderBy: {
        createdAt: 'desc'
      }
    })
  }

  /**
   * Find companies by status
   */
  async findByStatus(status: string) {
    return await prisma.company.findMany({
      where: { status },
      orderBy: {
        createdAt: 'desc'
      }
    })
  }
}

// Export a singleton instance
export const companyRepository = new CompanyRepository()

