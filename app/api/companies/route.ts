import { NextRequest, NextResponse } from 'next/server'
import { companyService } from '@/backend/services/company.service'
import { CreateCompanyRequest } from '@/backend/types/company'

/**
 * GET /api/companies
 * Retrieves all companies ordered by creation date (newest first)
 */
export async function GET() {
  try {
    const companies = await companyService.getAllCompanies()
    return NextResponse.json(companies, { status: 200 })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch companies'
    console.error('GET /api/companies error:', error)
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}

/**
 * POST /api/companies
 * Creates a new company incorporation request
 */
export async function POST(request: NextRequest) {
  try {
    const body: CreateCompanyRequest = await request.json()
    
    const company = await companyService.createCompany(body)
    
    return NextResponse.json(company, { status: 201 })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to create company'
    console.error('POST /api/companies error:', error)
    
    // Determine status code based on error type
    const statusCode = errorMessage.includes('Missing required field') ||
                       errorMessage.includes('Invalid') ||
                       errorMessage.includes('must be')
      ? 400
      : 500
    
    return NextResponse.json(
      { error: errorMessage },
      { status: statusCode }
    )
  }
}

