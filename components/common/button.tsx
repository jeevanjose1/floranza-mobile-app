import React from 'react'
import { Text, TouchableOpacity } from 'react-native'
import { twMerge } from 'tailwind-merge'

type Variant = 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost'
type Size = 'small' | 'medium' | 'large'

type Props = {
  children: React.ReactNode
  variant?: Variant
  size?: Size
  onPress?: () => void
  disabled?: boolean
  className?: string
}

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'medium',
  onPress,
  disabled = false,
  className
}: Props) => {
  const baseStyles = 'rounded-lg justify-center items-center'

  const variantStyles = {
    primary: 'bg-primary active:opacity-70',
    secondary: 'bg-cyan-400 active:bg-cyan-500',
    outline: 'border-2 border-blue-500 bg-transparent',
    danger: 'bg-red-500 active:bg-red-600',
    ghost: 'bg-transparent active:bg-gray-100',
  }

  const sizeStyles = {
    small: 'px-3 py-2',
    medium: 'px-4 py-3',
    large: 'px-5 py-4',
  }

  const textVariantStyles = {
    primary: 'text-white font-semibold',
    secondary: 'text-white font-semibold',
    outline: 'text-blue-500 font-semibold',
    danger: 'text-white font-semibold',
    ghost: 'text-blue-500 font-medium',
  }

  const textSizeStyles = {
    small: 'text-xs',
    medium: 'text-sm',
    large: 'text-base',
  }

  const containerClass = twMerge(
    baseStyles,
    variantStyles[variant],
    sizeStyles[size],
    disabled && 'opacity-50',
    className
  )

  const textClass = twMerge(
    textVariantStyles[variant],
    textSizeStyles[size]
  )

  return (
    <TouchableOpacity 
      onPress={onPress} 
      disabled={disabled}
      activeOpacity={0.7}
      className={containerClass}
    >
      <Text className={textClass}>
        {children}
      </Text>
    </TouchableOpacity>
  )
}

export default Button