import { describe, it, expect } from 'vitest'
import {
  isCodeUnique,
  required,
  validateCode,
  validateDate,
  validateFullName,
  validateTerminationOrder,
} from './validation'

describe('required', () => {
  it('fails on empty or whitespace values', () => {
    expect(required('')).toBe('This field is required')
    expect(required('   ')).toBe('This field is required')
    expect(required(null, 'Code')).toBe('Code is required')
  })

  it('passes on a non-empty value', () => {
    expect(required('x')).toBeNull()
  })
})

describe('validateCode', () => {
  it('accepts the EMP### format', () => {
    expect(validateCode('EMP001')).toBeNull()
    expect(validateCode('EMP1234')).toBeNull()
  })

  it('rejects bad formats', () => {
    expect(validateCode('001')).not.toBeNull()
    expect(validateCode('EMP1')).not.toBeNull()
    expect(validateCode('')).toBe('Code is required')
  })
})

describe('isCodeUnique', () => {
  const existing = ['EMP001', 'EMP002']

  it('is false for an existing code (case-insensitive)', () => {
    expect(isCodeUnique('EMP001', existing)).toBe(false)
    expect(isCodeUnique('emp001', existing)).toBe(false)
  })

  it('is true for a new code', () => {
    expect(isCodeUnique('EMP999', existing)).toBe(true)
  })
})

describe('validateFullName', () => {
  it('requires at least two characters', () => {
    expect(validateFullName('A')).toBe('Full name must be at least 2 characters')
  })

  it('accepts names with titles, periods and hyphens', () => {
    expect(validateFullName('Mrs. Lisa Carroll')).toBeNull()
    expect(validateFullName("Mary O'Neil-Smith")).toBeNull()
  })

  it('rejects names with digits or symbols', () => {
    expect(validateFullName('John3')).not.toBeNull()
  })
})

describe('validateDate', () => {
  it('allows empty dates', () => {
    expect(validateDate(null)).toBeNull()
    expect(validateDate('')).toBeNull()
  })

  it('rejects unparseable dates', () => {
    expect(validateDate('nope')).toBe('Enter a valid date')
  })
})

describe('validateTerminationOrder', () => {
  it('passes when termination is on or after employment', () => {
    expect(validateTerminationOrder('2020-01-01', '2020-01-01')).toBeNull()
    expect(validateTerminationOrder('2020-01-01', '2021-01-01')).toBeNull()
  })

  it('fails when termination precedes employment', () => {
    expect(validateTerminationOrder('2020-01-01', '2019-01-01')).not.toBeNull()
  })

  it('passes when either date is missing', () => {
    expect(validateTerminationOrder(null, '2020-01-01')).toBeNull()
    expect(validateTerminationOrder('2020-01-01', null)).toBeNull()
  })
})
