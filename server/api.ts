import fetch, { Headers } from 'node-fetch'
import 'dotenv/config'
import type { ProjectResponse } from './types/project'
import { IssuesResponse } from './types/issue'

const baseHeaders = {
  'Authorization': `Basic ${Buffer.from(`${process.env.USER_EMAIL}:${process.env.API_TOKEN}`).toString('base64')}`,
  'Content-Type': 'application/json'
}

async function request<TResponse>(
  url: string,
  config?: RequestInit
): Promise<TResponse> {
  const headers = new Headers({...baseHeaders})
  const response = await fetch(url, { headers })
  const data = await response.json()
  return data as TResponse;
}

async function projectFromVersionName(versionName: string): Promise<ProjectResponse> {
  const url = `${process.env.API_HOST}/project/10048/version?orderBy=+releaseDate&query=${versionName}&status=unreleased`
  return request<ProjectResponse>(url)
}

async function issuesFromProjectId(versionNumber: string) {
  const jql = `project = 10048 AND fixVersion = ${versionNumber} AND "Work Type[Dropdown]" = "Front End" ORDER BY priority DESC, key ASC&fields=assignee, summary`
  const url = `${process.env.API_HOST}/search?jql=${jql}`
  return request<IssuesResponse>(url)
}

export {
  projectFromVersionName,
  issuesFromProjectId
}