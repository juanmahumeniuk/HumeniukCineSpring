import { inputClass } from './EntityModal'

interface Option {
  id: number
  label: string
}

interface MultiSelectProps {
  options: Option[]
  value: number[]
  onChange: (ids: number[]) => void
  className?: string
}

export function MultiSelect({
  options,
  value,
  onChange,
  className = inputClass,
}: MultiSelectProps) {
  return (
    <select
      multiple
      className={`${className} min-h-[110px] cursor-pointer leading-relaxed [&_option:checked]:bg-white/10 [&_option:checked]:text-white`}
      value={value.map(String)}
      onChange={(e) => {
        const selected = Array.from(e.target.selectedOptions).map((o) =>
          Number(o.value),
        )
        onChange(selected)
      }}
    >
      {options.map((o) => (
        <option key={o.id} value={o.id}>
          {o.label}
        </option>
      ))}
    </select>
  )
}
