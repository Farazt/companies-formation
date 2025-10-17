import { CompanyService } from '@/backend/services/company.service'
import { companyRepository } from '@/backend/repositories/company.repository'
import { mockCompany, mockCompanyList, mockCreateCompanyRequest } from '@/tests/helpers/test-data'

// Mock the repository
jest.mock('@/backend/repositories/company.repository', () => ({
  companyRepository: {
    findAll: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
    findByJurisdiction: jest.fn(),
    findByStatus: jest.fn(),
  },
}))

describe('CompanyService', () => {
  let service: CompanyService

  beforeEach(() => {
    service = new CompanyService()
    jest.clearAllMocks()
  })

  describe('getAllCompanies', () => {
    it('should return all companies', async () => {
      (companyRepository.findAll as jest.Mock).mockResolvedValue(mockCompanyList)

      const result = await service.getAllCompanies()

      expect(result).toEqual(mockCompanyList)
      expect(companyRepository.findAll).toHaveBeenCalled()
    })

    it('should throw error when repository fails', async () => {
      (companyRepository.findAll as jest.Mock).mockRejectedValue(new Error('Database error'))

      await expect(service.getAllCompanies()).rejects.toThrow('Failed to fetch companies')
    })
  })

  describe('getCompanyById', () => {
    it('should return a company by id', async () => {
      (companyRepository.findById as jest.Mock).mockResolvedValue(mockCompany)

      const result = await service.getCompanyById(mockCompany.id)

      expect(result).toEqual(mockCompany)
      expect(companyRepository.findById).toHaveBeenCalledWith(mockCompany.id)
    })

    it('should throw error when company not found', async () => {
      (companyRepository.findById as jest.Mock).mockResolvedValue(null)

      await expect(service.getCompanyById('non-existent-id')).rejects.toThrow('Company not found')
    })
  })

  describe('createCompany', () => {
    it('should create a company with valid data', async () => {
      const newCompany = { ...mockCompany, ...mockCreateCompanyRequest }
      ;(companyRepository.create as jest.Mock).mockResolvedValue(newCompany)

      const result = await service.createCompany(mockCreateCompanyRequest)

      expect(result).toEqual(newCompany)
      expect(companyRepository.create).toHaveBeenCalledWith({
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
    })

    it('should throw error when name is missing', async () => {
      const invalidData = { ...mockCreateCompanyRequest, name: '' }

      await expect(service.createCompany(invalidData)).rejects.toThrow('Missing required field: name')
    })

    it('should throw error when jurisdiction is missing', async () => {
      const invalidData = { ...mockCreateCompanyRequest, jurisdiction: '' }

      await expect(service.createCompany(invalidData)).rejects.toThrow('Missing required field: jurisdiction')
    })

    it('should throw error when address is missing', async () => {
      const invalidData = { ...mockCreateCompanyRequest, address: '' }

      await expect(service.createCompany(invalidData)).rejects.toThrow('Missing required field: address')
    })

    it('should throw error when postCode is missing', async () => {
      const invalidData = { ...mockCreateCompanyRequest, postCode: '' }

      await expect(service.createCompany(invalidData)).rejects.toThrow('Missing required field: postCode')
    })

    it('should throw error when country is missing', async () => {
      const invalidData = { ...mockCreateCompanyRequest, country: '' }

      await expect(service.createCompany(invalidData)).rejects.toThrow('Missing required field: country')
    })

    it('should throw error when jurisdiction is invalid', async () => {
      const invalidData = { ...mockCreateCompanyRequest, jurisdiction: 'InvalidJurisdiction' }

      await expect(service.createCompany(invalidData)).rejects.toThrow('Invalid jurisdiction')
    })

    it('should accept valid jurisdictions', async () => {
      ;(companyRepository.create as jest.Mock).mockResolvedValue(mockCompany)

      const validJurisdictions = ['UK', 'Singapore', 'Caymans']

      for (const jurisdiction of validJurisdictions) {
        const data = { ...mockCreateCompanyRequest, jurisdiction }
        await expect(service.createCompany(data)).resolves.not.toThrow()
      }
    })

    it('should throw error when numberOfDirectors is negative', async () => {
      const invalidData = { ...mockCreateCompanyRequest, numberOfDirectors: -1 }

      await expect(service.createCompany(invalidData)).rejects.toThrow('numberOfDirectors must be a positive number')
    })

    it('should throw error when numberOfShareholders is negative', async () => {
      const invalidData = { ...mockCreateCompanyRequest, numberOfShareholders: -1 }

      await expect(service.createCompany(invalidData)).rejects.toThrow('numberOfShareholders must be a positive number')
    })

    it('should throw error when secCode is invalid', async () => {
      const invalidData = { ...mockCreateCompanyRequest, secCode: 'INVALID@CODE!' }

      await expect(service.createCompany(invalidData)).rejects.toThrow('SEC code must contain only alphanumeric characters')
    })

    it('should accept valid SEC codes', async () => {
      ;(companyRepository.create as jest.Mock).mockResolvedValue(mockCompany)

      const validSecCodes = ['ABC123', 'XYZ789', 'TEST01']

      for (const secCode of validSecCodes) {
        const data = { ...mockCreateCompanyRequest, secCode }
        await expect(service.createCompany(data)).resolves.not.toThrow()
      }
    })

    it('should create company without optional fields', async () => {
      const minimalData = {
        name: 'Minimal Company',
        jurisdiction: 'UK',
        address: '123 Street',
        postCode: 'SW1A',
        country: 'UK',
      }
      const newCompany = { ...mockCompany, ...minimalData }
      ;(companyRepository.create as jest.Mock).mockResolvedValue(newCompany)

      const result = await service.createCompany(minimalData)

      expect(result).toEqual(newCompany)
      expect(companyRepository.create).toHaveBeenCalledWith({
        ...minimalData,
        numberOfDirectors: null,
        numberOfShareholders: null,
        activities: null,
        secCode: null,
        status: 'Incorporation Requested',
      })
    })
  })

  describe('updateCompanyStatus', () => {
    it('should update company status', async () => {
      const updatedCompany = { ...mockCompany, status: 'Incorporated' }
      ;(companyRepository.update as jest.Mock).mockResolvedValue(updatedCompany)

      const result = await service.updateCompanyStatus(mockCompany.id, 'Incorporated')

      expect(result).toEqual(updatedCompany)
      expect(companyRepository.update).toHaveBeenCalledWith(
        mockCompany.id, 
        expect.objectContaining({ 
          status: 'Incorporated',
          dateOfIncorporation: expect.any(Date)
        })
      )
    })

    it('should throw error when update fails', async () => {
      (companyRepository.update as jest.Mock).mockRejectedValue(new Error('Database error'))

      await expect(service.updateCompanyStatus(mockCompany.id, 'Incorporated')).rejects.toThrow('Failed to update company status')
    })
  })

  describe('getCompaniesByJurisdiction', () => {
    it('should return companies by jurisdiction', async () => {
      const ukCompanies = mockCompanyList.filter(c => c.jurisdiction === 'UK')
      ;(companyRepository.findByJurisdiction as jest.Mock).mockResolvedValue(ukCompanies)

      const result = await service.getCompaniesByJurisdiction('UK')

      expect(result).toEqual(ukCompanies)
      expect(companyRepository.findByJurisdiction).toHaveBeenCalledWith('UK')
    })

    it('should throw error when invalid jurisdiction', async () => {
      await expect(service.getCompaniesByJurisdiction('Invalid')).rejects.toThrow('Invalid jurisdiction')
    })
  })

  describe('getCompaniesByStatus', () => {
    it('should return companies by status', async () => {
      const incorporatedCompanies = mockCompanyList.filter(c => c.status === 'Incorporated')
      ;(companyRepository.findByStatus as jest.Mock).mockResolvedValue(incorporatedCompanies)

      const result = await service.getCompaniesByStatus('Incorporated')

      expect(result).toEqual(incorporatedCompanies)
      expect(companyRepository.findByStatus).toHaveBeenCalledWith('Incorporated')
    })
  })

  describe('getCompanyStats', () => {
    it('should return company statistics', async () => {
      (companyRepository.count as jest.Mock).mockResolvedValue(10)
      ;(companyRepository.findByStatus as jest.Mock).mockResolvedValueOnce([mockCompany])
      ;(companyRepository.findByStatus as jest.Mock).mockResolvedValueOnce([mockCompany, mockCompany])

      const result = await service.getCompanyStats()

      expect(result).toEqual({
        total: 10,
        incorporated: 1,
        pending: 2,
      })
    })

    it('should throw error when stats fetch fails', async () => {
      (companyRepository.count as jest.Mock).mockRejectedValue(new Error('Database error'))

      await expect(service.getCompanyStats()).rejects.toThrow('Failed to fetch company statistics')
    })
  })
})

