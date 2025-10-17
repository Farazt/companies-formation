import React from 'react'

interface BaseFieldProps {
  label: string
  name: string
  value: string | number
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
  required?: boolean
  placeholder?: string
}

interface InputFieldProps extends BaseFieldProps {
  type: 'text' | 'number'
  min?: number
}

interface SelectFieldProps extends BaseFieldProps {
  type: 'select'
  options: { value: string; label: string }[]
}

type FormFieldProps = InputFieldProps | SelectFieldProps

export default function FormField(props: FormFieldProps) {
  const { label, name, value, onChange, required, placeholder } = props

  const inputClasses = "px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white placeholder-gray-400"

  return (
    <div className="grid grid-cols-2 gap-4 items-center">
      <label htmlFor={name} className="text-gray-700 font-medium">
        {label}
      </label>
      
      {props.type === 'select' ? (
        <select
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          className={inputClasses}
        >
          {props.options.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={props.type}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          placeholder={placeholder}
          min={props.type === 'number' ? props.min : undefined}
          className={inputClasses}
        />
      )}
    </div>
  )
}

