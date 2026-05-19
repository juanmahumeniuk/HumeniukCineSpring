import type { ButtonHTMLAttributes, ReactNode } from 'react'

type Variant = 'primary' | 'outline' | 'ghost' | 'danger'

const variants: Record<Variant, string> = {
  primary: [
    'text-black font-semibold',
    'bg-gradient-to-b from-white via-[#f4f4f7] to-[#d8d8df]',
    'border border-white/40',
    'shadow-[0_1px_0_0_rgba(255,255,255,0.9)_inset,0_-1px_0_0_rgba(0,0,0,0.18)_inset,0_10px_28px_-10px_rgba(255,255,255,0.35)]',
    'hover:shadow-[0_1px_0_0_rgba(255,255,255,0.9)_inset,0_-1px_0_0_rgba(0,0,0,0.18)_inset,0_18px_40px_-12px_rgba(255,255,255,0.45)]',
  ].join(' '),
  outline: [
    'text-white',
    'bg-white/[0.04]',
    'border border-white/15',
    'shadow-[0_1px_0_0_rgba(255,255,255,0.08)_inset,0_8px_22px_-12px_rgba(0,0,0,0.55)]',
    'backdrop-blur-xl',
    'hover:bg-white/[0.08] hover:border-white/25',
  ].join(' '),
  ghost: [
    'text-white/85',
    'bg-white/[0.03]',
    'border border-white/10',
    'backdrop-blur-xl',
    'hover:bg-white/[0.07] hover:text-white hover:border-white/20',
  ].join(' '),
  danger: [
    'text-white font-medium',
    'bg-gradient-to-b from-[rgba(255,107,107,0.32)] to-[rgba(220,60,60,0.32)]',
    'border border-[rgba(255,107,107,0.45)]',
    'shadow-[0_1px_0_0_rgba(255,255,255,0.1)_inset,0_10px_24px_-12px_rgba(255,80,80,0.55)]',
    'backdrop-blur-xl',
    'hover:from-[rgba(255,107,107,0.42)] hover:to-[rgba(220,60,60,0.42)]',
  ].join(' '),
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  children: ReactNode
  size?: 'sm' | 'md' | 'lg'
}

const sizes = {
  sm: 'px-3 py-1.5 text-[12.5px] rounded-full',
  md: 'px-4 py-2 text-[13.5px] rounded-full',
  lg: 'px-5 py-2.5 text-sm rounded-full',
}

export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type="button"
      className={`liquid-btn inline-flex items-center justify-center gap-2 font-medium tracking-tight disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      <span className="relative z-10 inline-flex items-center gap-2">
        {children}
      </span>
    </button>
  )
}
