'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { JURISDICTIONS } from '@/backend/types/company'
import Sidebar from '@/app/components/Sidebar'
import PageLayout from '@/app/components/PageLayout'
import Card from '@/app/components/Card'
import FormField from '@/app/components/FormField'
import Button from '@/app/components/Button'
import ErrorMessage from '@/app/components/ErrorMessage'

export default function NewCompanyPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    jurisdiction: '',
    name: '',
    address: '',
    postCode: '',
    country: '',
    numberOfDirectors: '',
    numberOfShareholders: '',
    activities: '',
    secCode: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const payload = {
        name: formData.name,
        jurisdiction: formData.jurisdiction,
        address: formData.address,
        postCode: formData.postCode,
        country: formData.country,
        numberOfDirectors: formData.numberOfDirectors ? Number(formData.numberOfDirectors) : undefined,
        numberOfShareholders: formData.numberOfShareholders ? Number(formData.numberOfShareholders) : undefined,
        activities: formData.activities || undefined,
        secCode: formData.secCode || undefined
      }

      const res = await fetch('/api/companies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to create company')
      }

      router.push('/companies')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  const jurisdictionOptions = [
    { value: '', label: 'Australia [List of countries]' },
    ...JURISDICTIONS.map(j => ({ value: j, label: j }))
  ]

  const countryOptions = [
    { value: '', label: 'Australia [List of countries]' },
    { value: 'United Kingdom', label: 'United Kingdom' },
    { value: 'Singapore', label: 'Singapore' },
    { value: 'Cayman Islands', label: 'Cayman Islands' }
  ]

  return (
    <PageLayout sidebar={<Sidebar buttonText="View Your Companies" buttonHref="/companies" />}>
      <Card title="Create New Company" className="max-w-4xl">
        <form onSubmit={handleSubmit}>
          {error && <ErrorMessage message={error} />}

          <div className="space-y-6">
            <FormField
              type="select"
              label="Select Jurisdiction"
              name="jurisdiction"
              value={formData.jurisdiction}
              onChange={handleChange}
              required
              options={jurisdictionOptions}
            />

            <FormField
              type="text"
              label="Desired Company Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="[Free text]"
            />

            <FormField
              type="text"
              label="Company Address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              placeholder="[Free text]"
            />

            <FormField
              type="text"
              label="Company Post/Zip Code"
              name="postCode"
              value={formData.postCode}
              onChange={handleChange}
              required
              placeholder="[Post codes only]"
            />

            <FormField
              type="select"
              label="Company Country"
              name="country"
              value={formData.country}
              onChange={handleChange}
              required
              options={countryOptions}
            />

            <FormField
              type="number"
              label="Number of Directors"
              name="numberOfDirectors"
              value={formData.numberOfDirectors}
              onChange={handleChange}
              placeholder="[Number Drop Down]"
              min={0}
            />

            <FormField
              type="number"
              label="Number of Shareholders"
              name="numberOfShareholders"
              value={formData.numberOfShareholders}
              onChange={handleChange}
              placeholder="[Number Drop Down]"
              min={0}
            />

            <FormField
              type="text"
              label="Company Activities"
              name="activities"
              value={formData.activities}
              onChange={handleChange}
              placeholder="[Free text]"
            />

            <FormField
              type="text"
              label="Company SEC Code"
              name="secCode"
              value={formData.secCode}
              onChange={handleChange}
              placeholder="[SEC Codes only]"
            />
          </div>

          <div className="mt-8 flex justify-end">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Complete'}
            </Button>
          </div>
        </form>
      </Card>
    </PageLayout>
  )
}
