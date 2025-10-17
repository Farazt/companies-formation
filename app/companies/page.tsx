import { Suspense } from 'react'
import { Company } from '@/backend/types/company'
import Sidebar from '@/app/components/Sidebar'
import PageLayout from '@/app/components/PageLayout'
import Card from '@/app/components/Card'
import CompanyCard from '@/app/components/CompanyCard'
import Loading from '@/app/components/Loading'
import EmptyState from '@/app/components/EmptyState'

async function getCompanies(): Promise<Company[]> {
  const res = await fetch('http://localhost:3000/api/companies', {
    cache: 'no-store'
  })
  
  if (!res.ok) {
    throw new Error('Failed to fetch companies')
  }
  
  return res.json()
}

async function CompanyList() {
  const companies = await getCompanies()

  return (
    <div className="space-y-4">
      {companies.length === 0 ? (
        <EmptyState message="No companies found. Create your first company to get started." />
      ) : (
        companies.map((company) => (
          <CompanyCard key={company.id} company={company} />
        ))
      )}
    </div>
  )
}

export default function CompaniesPage() {
  return (
    <PageLayout sidebar={<Sidebar buttonText="Create New Company" buttonHref="/companies/new" />}>
      <Card title="Your Companies">
        <Suspense fallback={<Loading />}>
          <CompanyList />
        </Suspense>
      </Card>
    </PageLayout>
  )
}
