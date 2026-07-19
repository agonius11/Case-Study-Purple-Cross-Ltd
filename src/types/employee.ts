export interface Employee {
  code: string
  fullName: string
  occupation: string
  department: string
  dateOfEmployment: string | null
  terminationDate: string | null
}

export type EmploymentStatus = 'Employed soon' | 'Currently employed'
export type TerminationStatus = 'To be terminated' | 'Terminated'
export type EmployeeStatus = EmploymentStatus | TerminationStatus
