import '@/tests/helpers/prisma-mock' // Import mock setup FIRST
import { prismaMock } from '@/tests/helpers/prisma-mock'
import { CompanyRepository } from '@/backend/repositories/company.repository'
import { mockCompany, mockCompanyList, mockCreateCompanyRequest } from '@/tests/helpers/test-data'

describe('CompanyRepository', () => {
  let repository: CompanyRepository

  beforeEach(() => {
    repository = new CompanyRepository()
  })

  describe('findAll', () => {
    it('should return all companies ordered by createdAt desc', async () => {
      prismaMock.company.findMany.mockResolvedValue(mockCompanyList)

      const result = await repository.findAll()

      expect(result).toEqual(mockCompanyList)
      expect(prismaMock.company.findMany).toHaveBeenCalledWith({
        orderBy: {
          createdAt: 'desc'
        }
      })
    })

    it('should return empty array when no companies exist', async () => {
      prismaMock.company.findMany.mockResolvedValue([])

      const result = await repository.findAll()

      expect(result).toEqual([])
    })
  })

  describe('findById', () => {
    it('should return a company by id', async () => {
      prismaMock.company.findUnique.mockResolvedValue(mockCompany)

      const result = await repository.findById(mockCompany.id)

      expect(result).toEqual(mockCompany)
      expect(prismaMock.company.findUnique).toHaveBeenCalledWith({
        where: { id: mockCompany.id }
      })
    })

    it('should return null when company not found', async () => {
      prismaMock.company.findUnique.mockResolvedValue(null)

      const result = await repository.findById('non-existent-id')

      expect(result).toBeNull()
    })
  })

  describe('create', () => {
    it('should create and return a new company', async () => {
      const newCompany = {
        ...mockCompany,
        name: mockCreateCompanyRequest.name,
      }
      prismaMock.company.create.mockResolvedValue(newCompany)

      const result = await repository.create({
        name: mockCreateCompanyRequest.name,
        jurisdiction: mockCreateCompanyRequest.jurisdiction,
        address: mockCreateCompanyRequest.address,
        postCode: mockCreateCompanyRequest.postCode,
        country: mockCreateCompanyRequest.country,
        numberOfDirectors: mockCreateCompanyRequest.numberOfDirectors,
        numberOfShareholders: mockCreateCompanyRequest.numberOfShareholders,
        activities: mockCreateCompanyRequest.activities,
        secCode: mockCreateCompanyRequest.secCode,
        status: 'Incorporation Requested',
      })

      expect(result).toEqual(newCompany)
      expect(prismaMock.company.create).toHaveBeenCalled()
    })
  })

  describe('update', () => {
    it('should update and return the company', async () => {
      const updatedCompany = {
        ...mockCompany,
        status: 'Incorporated',
      }
      prismaMock.company.update.mockResolvedValue(updatedCompany)

      const result = await repository.update(mockCompany.id, { status: 'Incorporated' })

      expect(result).toEqual(updatedCompany)
      expect(prismaMock.company.update).toHaveBeenCalledWith({
        where: { id: mockCompany.id },
        data: { status: 'Incorporated' }
      })
    })
  })

  describe('delete', () => {
    it('should delete and return the company', async () => {
      prismaMock.company.delete.mockResolvedValue(mockCompany)

      const result = await repository.delete(mockCompany.id)

      expect(result).toEqual(mockCompany)
      expect(prismaMock.company.delete).toHaveBeenCalledWith({
        where: { id: mockCompany.id }
      })
    })
  })

  describe('count', () => {
    it('should return the total count of companies', async () => {
      prismaMock.company.count.mockResolvedValue(3)

      const result = await repository.count()

      expect(result).toBe(3)
      expect(prismaMock.company.count).toHaveBeenCalled()
    })
  })

  describe('findByJurisdiction', () => {
    it('should return companies filtered by jurisdiction', async () => {
      const ukCompanies = mockCompanyList.filter(c => c.jurisdiction === 'UK')
      prismaMock.company.findMany.mockResolvedValue(ukCompanies)

      const result = await repository.findByJurisdiction('UK')

      expect(result).toEqual(ukCompanies)
      expect(prismaMock.company.findMany).toHaveBeenCalledWith({
        where: { jurisdiction: 'UK' },
        orderBy: {
          createdAt: 'desc'
        }
      })
    })
  })

  describe('findByStatus', () => {
    it('should return companies filtered by status', async () => {
      const incorporatedCompanies = mockCompanyList.filter(c => c.status === 'Incorporated')
      prismaMock.company.findMany.mockResolvedValue(incorporatedCompanies)

      const result = await repository.findByStatus('Incorporated')

      expect(result).toEqual(incorporatedCompanies)
      expect(prismaMock.company.findMany).toHaveBeenCalledWith({
        where: { status: 'Incorporated' },
        orderBy: {
          createdAt: 'desc'
        }
      })
    })
  })
})

