import * as api from './api.js'

async function getTicketsForRelease() {
  const appVersion = process.argv.slice(2).join(' ')
  const versionId = await getVersionIdFromName(appVersion)
  const issues = await getIssuesFromVersion(versionId)

  return issues;
}

async function getVersionIdFromName(versionName: string): Promise<string> {
  const projects = await api.projectFromVersionName(versionName)
  const project = projects.values.find((project) =>  project.name === versionName)

  return project.id
} 

async function getIssuesFromVersion(versionNumber: string): 
  Promise<{ticket: string, summary: string, assignee: string }[]> {
    const response = await api.issuesFromProjectId(versionNumber)
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