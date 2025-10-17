import { GET, POST } from '@/app/api/companies/route'
import { companyService } from '@/backend/services/company.service'
import { mockCompany, mockCompanyList, mockCreateCompanyRequest } from '@/tests/helpers/test-data'
import { NextRequest } from 'next/server'

// Mock the service
jest.mock('@/backend/services/company.service', () => ({
  companyService: {
    getAllCompanies: jest.fn(),
    createCompany: jest.fn(),
  },
}))

describe('API Route: /api/companies', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('GET /api/companies', () => {
    it('should return all companies with 200 status', async () => {
      (companyService.getAllCompanies as jest.Mock).mockResolvedValue(mockCompanyList)

      const response = await GET()
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.length).toBe(mockCompanyList.length)
      expect(data[0].name).toBe(mockCompanyList[0].name)
      expect(companyService.getAllCompanies).toHaveBeenCalled()
    })

    it('should return 500 when service throws error', async () => {
      (companyService.getAllCompanies as jest.Mock).mockRejectedValue(new Error('Database error'))

      const response = await GET()
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data).toEqual({ error: 'Database error' })
    })

    it('should return empty array when no companies exist', async () => {
      (companyService.getAllCompanies as jest.Mock).mockResolvedValue([])

      const response = await GET()
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toEqual([])
    })
  })

  describe('POST /api/companies', () => {
    it('should create a company and return 201 status', async () => {
      const newCompany = { ...mockCompany, ...mockCreateCompanyRequest }
      ;(companyService.createCompany as jest.Mock).mockResolvedValue(newCompany)

      const request = new NextRequest('http://localhost:3000/api/companies', {
        method: 'POST',
        body: JSON.stringify(mockCreateCompanyRequest),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(201)
      expect(data.name).toBe(newCompany.name)
      expect(data.jurisdiction).toBe(newCompany.jurisdiction)
      expect(companyService.createCompany).toHaveBeenCalledWith(mockCreateCompanyRequest)
    })

    it('should return 400 when missing required field', async () => {
      (companyService.createCompany as jest.Mock).mockRejectedValue(new Error('Missing required field: name'))

      const invalidData = { ...mockCreateCompanyRequest, name: '' }
      const request = new NextRequest('http://localhost:3000/api/companies', {
        method: 'POST',
        body: JSON.stringify(invalidData),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data).toEqual({ error: 'Missing required field: name' })
    })

    it('should return 400 when invalid jurisdiction', async () => {
      (companyService.createCompany as jest.Mock).mockRejectedValue(new Error('Invalid jurisdiction'))

      const invalidData = { ...mockCreateCompanyRequest, jurisdiction: 'Invalid' }
      const request = new NextRequest('http://localhost:3000/api/companies', {
        method: 'POST',
        body: JSON.stringify(invalidData),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data).toEqual({ error: 'Invalid jurisdiction' })
    })

    it('should return 400 when negative numberOfDirectors', async () => {
      (companyService.createCompany as jest.Mock).mockRejectedValue(
        new Error('numberOfDirectors must be a positive number')
      )

      const invalidData = { ...mockCreateCompanyRequest, numberOfDirectors: -1 }
      const request = new NextRequest('http://localhost:3000/api/companies', {
        method: 'POST',
        body: JSON.stringify(invalidData),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toContain('must be')
    })

    it('should return 400 when invalid SEC code', async () => {
      (companyService.createCompany as jest.Mock).mockRejectedValue(new Error('Invalid SEC code format'))

      const invalidData = { ...mockCreateCompanyRequest, secCode: 'INVALID@CODE!' }
      const request = new NextRequest('http://localhost:3000/api/companies', {
        method: 'POST',
        body: JSON.stringify(invalidData),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data).toEqual({ error: 'Invalid SEC code format' })
    })

    it('should return 500 for unexpected errors', async () => {
      (companyService.createCompany as jest.Mock).mockRejectedValue(new Error('Unexpected error'))

      const request = new NextRequest('http://localhost:3000/api/companies', {
        method: 'POST',
        body: JSON.stringify(mockCreateCompanyRequest),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data).toEqual({ error: 'Unexpected error' })
    })

    it('should create company with only required fields', async () => {
      const minimalData = {
        name: 'Minimal Company',
        jurisdiction: 'UK',
        address: '123 Street',
        postCode: 'SW1A',
        country: 'UK',
      }
      const newCompany = { ...mockCompany, ...minimalData }
      ;(companyService.createCompany as jest.Mock).mockResolvedValue(newCompany)

      const request = new NextRequest('http://localhost:3000/api/companies', {
        method: 'POST',
        body: JSON.stringify(minimalData),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(201)
      expect(data.name).toBe('Minimal Company')
      expect(data.jurisdiction).toBe('UK')
    })

    it('should handle malformed JSON', async () => {
      const request = new NextRequest('http://localhost:3000/api/companies', {
        method: 'POST',
        body: 'invalid json',
      })

      const response = await POST(request)
      
      expect(response.status).toBeGreaterThanOrEqual(400)
    })
  })
})

