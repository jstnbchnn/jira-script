export type Project = {
  self: string
  id: string
  description: string
  name: string
  archived: boolean
  released: boolean
  startDate: string
  releaseDate: string
  overdue: boolean
  userStartDate: string
  userReleaseDate: string
  projectId: number
}

export type ProjectResponse = {
  self: string
  maxResults: number
  startAt: number
  total: number
  isLast: boolean
  values: Project[]
}
