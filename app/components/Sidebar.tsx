import Link from 'next/link'

interface SidebarProps {
  buttonText: string
  buttonHref: string
}

export default function Sidebar({ buttonText, buttonHref }: SidebarProps) {
  return (
    <div className="w-64 bg-gray-200 min-h-screen p-4">
      <Link
        href={buttonHref}
        className="block w-full px-6 py-3 bg-blue-600 text-white text-center rounded hover:bg-blue-700 transition-colors font-medium"
      >
        {buttonText}
      </Link>
    </div>
  )
}

