export interface Company {
  id: string
  name: string
  jurisdiction: string
  address: string
  postCode: string
  country: string
  numberOfDirectors: number | null
  numberOfShareholders: number | null
  activities: string | null
  secCode: string | null
  status: string
  dateOfIncorporation: Date | null
  createdAt: Date
  updatedAt: Date
}

export interface CreateCompanyRequest {
  name: string
  jurisdiction: string
  address: string
  postCode: string
  country: string
  numberOfDirectors?: number
  numberOfShareholders?: number
  activities?: string
  secCode?: string
}

export type CompanyStatus = 'Incorporation Requested' | 'Incorporated'

export const JURISDICTIONS = ['UK', 'Singapore', 'Caymans'] as const
export type Jurisdiction = typeof JURISDICTIONS[number]

