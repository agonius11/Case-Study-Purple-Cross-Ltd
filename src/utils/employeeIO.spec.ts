import { describe, it, expect } from 'vitest'
import { mergeByCode, parseEmployeesJson, previewMerge, toCsv, toJson } from './employeeIO'
import type { Employee } from '@/types/employee'

const alice: Employee = {
  code: 'EMP001',
  fullName: 'Alice Adams',
  occupation: 'Chemist',
  department: 'Research',
  dateOfEmployment: '2020-01-01',
  terminationDate: null,
}

describe('parseEmployeesJson', () => {
  it('parses valid records and counts invalid ones', () => {
    const text = JSON.stringify([
      alice,
      { code: 'BAD', fullName: 'No Prefix' },
      { fullName: 'Missing code' },
    ])
    const result = parseEmployeesJson(text)
    expect(result.valid).toHaveLength(1)
    expect(result.valid[0]?.code).toBe('EMP001')
    expect(result.invalidCount).toBe(2)
  })

  it('throws on invalid JSON', () => {
    expect(() => parseEmployeesJson('{ not json')).toThrow(/not valid JSON/)
  })

  it('throws when the top level is not an array', () => {
    expect(() => parseEmployeesJson('{}')).toThrow(/array/)
  })
})

describe('previewMerge / mergeByCode', () => {
  const current = [alice]
  const incoming: Employee[] = [
    { ...alice, fullName: 'Alice Updated' },
    { ...alice, code: 'EMP002', fullName: 'Bob Brown' },
  ]

  it('previews added and updated counts', () => {
    expect(previewMerge(current, incoming)).toEqual({ added: 1, updated: 1 })
  })

  it('merges by code, updating existing and appending new', () => {
    const merged = mergeByCode(current, incoming)
    expect(merged).toHaveLength(2)
    expect(merged.find((e) => e.code === 'EMP001')?.fullName).toBe('Alice Updated')
    expect(merged.find((e) => e.code === 'EMP002')?.fullName).toBe('Bob Brown')
  })
})

describe('toCsv', () => {
  it('emits a header plus one row per employee', () => {
    const csv = toCsv([alice])
    const lines = csv.split('\n')
    expect(lines[0]).toBe('code,fullName,occupation,department,dateOfEmployment,terminationDate')
    expect(lines[1]).toBe('EMP001,Alice Adams,Chemist,Research,2020-01-01,')
  })

  it('quotes and escapes fields containing commas or quotes', () => {
    const tricky: Employee = { ...alice, fullName: 'Adams, Alice "AJ"' }
    const row = toCsv([tricky]).split('\n')[1]
    expect(row).toContain('"Adams, Alice ""AJ"""')
  })
})

describe('toJson', () => {
  it('produces valid, round-trippable JSON', () => {
    expect(JSON.parse(toJson([alice]))).toEqual([alice])
  })
})
