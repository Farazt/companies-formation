import { companyRepository } from '@/backend/repositories/company.repository'
import { CreateCompanyRequest, JURISDICTIONS } from '@/backend/types/company'

/**
 * Service layer for Company business logic
 * Handles validation, business rules, and coordinates repository calls
 */
export class CompanyService {
  /**
   * Get all companies
   */
  async getAllCompanies() {
    try {
      return await companyRepository.findAll()
    } catch (error) {
      console.error('Error in getAllCompanies:', error)
      throw new Error('Failed to fetch companies')
    }
  }

  /**
   * Get a single company by ID
   */
  async getCompanyById(id: string) {
    try {
      const company = await companyRepository.findById(id)
      if (!company) {
        throw new Error('Company not found')
      }
      return company
    } catch (error) {
      console.error('Error in getCompanyById:', error)
      throw error
    }
  }

  /**
   * Create a new company with validation
   */
  async createCompany(data: CreateCompanyRequest) {
    // Validate required fields
    this.validateRequiredFields(data)
    
    // Validate jurisdiction
    this.validateJurisdiction(data.jurisdiction)
    
    // Validate optional numeric fields
    this.validateNumericFields(data)
    
    // Validate SEC code format if provided
    if (data.secCode) {
      this.validateSecCode(data.secCode)
    }

    try {
      const company = await companyRepository.create({
        name: data.name,
        jurisdiction: data.jurisdiction,
        address: data.address,
        postCode: data.postCode,
        country: data.country,
        numberOfDirectors: data.numberOfDirectors ?? null,
        numberOfShareholders: data.numberOfShareholders ?? null,
        activities: data.activities ?? null,
        secCode: data.secCode ?? null,
        status: 'Incorporation Requested',
      })

      return company
    } catch (error) {
      console.error('Error in createCompany:', error)
      throw new Error('Failed to create company')
    }
  }

  /**
   * Update company status (e.g., mark as incorporated)
   */
  async updateCompanyStatus(id: string, status: string) {
    try {
      const updateData: any = { status }
      
      // If marking as incorporated, set the incorporation date
      if (status === 'Incorporated') {
        updateData.dateOfIncorporation = new Date()
      }

      return await companyRepository.update(id, updateData)
    } catch (error) {
      console.error('Error in updateCompanyStatus:', error)
      throw new Error('Failed to update company status')
    }
  }

  /**
   * Get companies by jurisdiction
   */
  async getCompaniesByJurisdiction(jurisdiction: string) {
    this.validateJurisdiction(jurisdiction)
    
    try {
      return await companyRepository.findByJurisdiction(jurisdiction)
    } catch (error) {
      console.error('Error in getCompaniesByJurisdiction:', error)
      throw new Error('Failed to fetch companies by jurisdiction')
    }
  }

  /**
   * Get companies by status
   */
  async getCompaniesByStatus(status: string) {
    try {
      return await companyRepository.findByStatus(status)
    } catch (error) {
      console.error('Error in getCompaniesByStatus:', error)
      throw new Error('Failed to fetch companies by status')
    }
  }

  /**
   * Get company statistics
   */
  async getCompanyStats() {
    try {
      const total = await companyRepository.count()
      const incorporated = await companyRepository.findByStatus('Incorporated')
      const pending = await companyRepository.findByStatus('Incorporation Requested')

      return {
        total,
        incorporated: incorporated.length,
        pending: pending.length
      }
    } catch (error) {
      console.error('Error in getCompanyStats:', error)
      throw new Error('Failed to fetch company statistics')
    }
  }

  // ==================== Private Validation Methods ====================

  /**
   * Validate required fields
   */
  private validateRequiredFields(data: CreateCompanyRequest) {
    const requiredFields: Array<keyof CreateCompanyRequest> = [
      'name',
      'jurisdiction',
      'address',
      'postCode',
      'country'
    ]

    for (const field of requiredFields) {
      if (!data[field] || (typeof data[field] === 'string' && data[field].trim() === '')) {
        throw new Error(`Missing required field: ${field}`)
      }
    }
  }

  /**
   * Validate jurisdiction is one of the allowed values
   */
  private validateJurisdiction(jurisdiction: string) {
    if (!JURISDICTIONS.includes(jurisdiction as any)) {
      throw new Error(
        `Invalid jurisdiction. Must be one of: ${JURISDICTIONS.join(', ')}`
      )
    }
  }

  /**
   * Validate numeric fields are positive numbers
   */
  private validateNumericFields(data: CreateCompanyRequest) {
    if (data.numberOfDirectors !== undefined) {
      if (typeof data.numberOfDirectors !== 'number' || data.numberOfDirectors < 0) {
        throw new Error('numberOfDirectors must be a positive number')
      }
    }

    if (data.numberOfShareholders !== undefined) {
      if (typeof data.numberOfShareholders !== 'number' || data.numberOfShareholders < 0) {
        throw new Error('numberOfShareholders must be a positive number')
      }
    }
  }

  /**
   * Validate SEC code format (alphanumeric)
   */
  private validateSecCode(secCode: string) {
    if (!/^[A-Z0-9]+$/i.test(secCode)) {
      throw new Error('SEC code must contain only alphanumeric characters')
    }
  }
}

// Export a singleton instance
export const companyService = new CompanyService()

