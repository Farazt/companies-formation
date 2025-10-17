import { Company } from '@/backend/types/company'

interface CompanyCardProps {
  company: Company
}

export default function CompanyCard({ company }: CompanyCardProps) {
  const formatDate = (date: Date | null) => {
    if (!date) return 'NA'
    return new Date(date).toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric'
    })
  }

  return (
    <div className="border border-gray-300 rounded p-6 bg-gray-50 hover:shadow-md transition-shadow">
      <h3 className="text-lg font-bold text-gray-900 mb-3">
        {company.name}
      </h3>
      <div className="space-y-1 text-sm text-gray-700">
        <InfoRow label="Status" value={company.status} />
        <InfoRow label="Jurisdiction" value={company.jurisdiction} />
        <InfoRow 
          label="Date of Incorporation" 
          value={formatDate(company.dateOfIncorporation)} 
        />
      </div>
    </div>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <p>
      <span className="font-semibold">{label}:</span> {value}
    </p>
  )
}

