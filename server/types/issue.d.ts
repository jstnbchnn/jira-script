export type Issue = {
    expand: string
    id: string
    self: string
    key: string
    fields: {
        summary: string
        assignee: {
            accountId: string
            displayName: string
        }
    }
}

export type IssuesResponse = {
  expand: string
  startAt: number
  maxResults: number
  total: number
  issues: Issue[]
}