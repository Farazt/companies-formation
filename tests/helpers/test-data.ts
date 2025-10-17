import { Company } from '@/backend/types/company'

export const mockCompany: Company = {
  id: '123e4567-e89b-12d3-a456-426614174000',
  name: 'Test Company Ltd',
  jurisdiction: 'UK',
  address: '123 Test Street',
  postCode: 'SW1A 1AA',
  country: 'United Kingdom',
  numberOfDirectors: 2,
  numberOfShareholders: 5,
  activities: 'Software Development',
  secCode: 'ABC123',
  status: 'Incorporation Requested',
  dateOfIncorporation: null,
  createdAt: new Date('2025-01-01T00:00:00.000Z'),
  updatedAt: new Date('2025-01-01T00:00:00.000Z'),
}

export const mockCompanyIncorporated: Company = {
  ...mockCompany,
  id: '123e4567-e89b-12d3-a456-426614174001',
  name: 'Incorporated Company Ltd',
  status: 'Incorporated',
  dateOfIncorporation: new Date('2025-01-15T00:00:00.000Z'),
}

export const mockCreateCompanyRequest = {
  name: 'New Company Ltd',
  jurisdiction: 'Singapore',
  address: '456 New Street',
  postCode: '123456',
  country: 'Singapore',
  numberOfDirectors: 1,
  numberOfShareholders: 2,
  activities: 'Consulting',
  secCode: 'XYZ789',
}

export const mockCompanyList: Company[] = [
  mockCompany,
  mockCompanyIncorporated,
  {
    ...mockCompany,
    id: '123e4567-e89b-12d3-a456-426614174002',
    name: 'Another Company Ltd',
    jurisdiction: 'Caymans',
  },
]

