"use client"

import * as React from "react"
import { Input } from "./input"

interface TimePickerInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  value: string
  onChange: (value: string) => void
}

export function TimePickerInput({
  value,
  onChange,
  ...props
}: TimePickerInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    // Validate time format (HH:MM)
    if (/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(newValue) || newValue === "") {
      onChange(newValue)
    }
  }

  return (
    <Input
      type="time"
      value={value}
      onChange={handleChange}
      {...props}
    />
  )
} 