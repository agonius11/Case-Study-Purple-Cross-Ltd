import { describe, it, expect } from 'vitest'
import { employmentStatus, terminationStatus } from './employeeStatus'

function isoOffsetDays(days: number): string {
  const date = new Date()
  date.setDate(date.getDate() + days)
  return date.toISOString().slice(0, 10)
}

const past = isoOffsetDays(-400)
const future = isoOffsetDays(400)
const today = isoOffsetDays(0)

describe('employmentStatus', () => {
  it('labels a past employment date as currently employed', () => {
    expect(employmentStatus(past)).toBe('Currently employed')
  })

  it('treats today as currently employed', () => {
    expect(employmentStatus(today)).toBe('Currently employed')
  })

  it('labels a future employment date as employed soon', () => {
    expect(employmentStatus(future)).toBe('Employed soon')
  })

  it('returns null for missing or invalid dates', () => {
    expect(employmentStatus(null)).toBeNull()
    expect(employmentStatus('not-a-date')).toBeNull()
  })
})

describe('terminationStatus', () => {
  it('labels a past termination date as terminated', () => {
    expect(terminationStatus(past)).toBe('Terminated')
  })

  it('labels a future termination date as to be terminated', () => {
    expect(terminationStatus(future)).toBe('To be terminated')
  })

  it('returns null when there is no termination date', () => {
    expect(terminationStatus(null)).toBeNull()
  })
})
