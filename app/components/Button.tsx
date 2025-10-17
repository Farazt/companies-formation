interface ButtonProps {
  type?: 'button' | 'submit' | 'reset'
  onClick?: () => void
  disabled?: boolean
  children: React.ReactNode
  variant?: 'primary' | 'secondary'
  className?: string
}

export default function Button({ 
  type = 'button',
  onClick,
  disabled = false,
  children,
  variant = 'primary',
  className = ''
}: ButtonProps) {
  const baseClasses = "px-8 py-3 rounded font-medium transition-colors"
  
  const variantClasses = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300 disabled:bg-gray-100"
  }

  const disabledClasses = disabled ? "cursor-not-allowed opacity-60" : ""

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${disabledClasses} ${className}`}
    >
      {children}
    </button>
  )
}

