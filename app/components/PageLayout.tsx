import React from 'react'

interface PageLayoutProps {
  sidebar: React.ReactNode
  children: React.ReactNode
}

export default function PageLayout({ sidebar, children }: PageLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {sidebar}
        <div className="flex-1 p-8">
          {children}
        </div>
      </div>
    </div>
  )
}

