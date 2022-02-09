import * as api from './api.js'

async function getTicketsForRelease() {
  const appVersion = process.argv.slice(2).join(' ')
  const projectId = await getProjectIdFromVersionName(appVersion)
  const issues = await getIssuesFromProjectId(projectId)
  return issues;
}

async function getProjectIdFromVersionName(versionName: string): Promise<number> {
  const projects = await api.projectFromVersionName(versionName)
  return projects.values[0].projectId
} 

async function getIssuesFromProjectId(projectId: number): 
  Promise<{ticket: string, summary: string, assignee: string }[]> {
    const response = await api.issuesFromProjectId(projectId)
    return response.issues.map((issue) => ({
      ticket: issue.key,
      summary: issue.fields.summary,
      assignee: issue.fields.assignee.displayName
    })
  )
}

type TicketInfo = {
  summary: string
  ticket: string
}

const groupByAssignee = 
  (acc: Record<string, TicketInfo[]>, {assignee, summary, ticket})
  : Record<string, TicketInfo[]>=> {
    return ({
      ...acc, 
      [assignee]: [...acc[assignee] || [], {summary, ticket} ]
    })
}

async function createTicketString() {
  const tickets = await getTicketsForRelease()
  const groupedTickets = tickets.reduce(groupByAssignee, {})

  let ticketString = ''
  for (const assignee in groupedTickets) {
    const issues = groupedTickets[assignee]
    ticketString += `${assignee}\n`;
    ticketString += issues.map((issue) => `${issue.ticket} - ${issue.summary}`).join('\n')
    ticketString += '\n\n'
  }

  return ticketString;
}



console.log(await createTicketString())