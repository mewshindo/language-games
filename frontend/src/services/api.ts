export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export interface CreateResultPayload {
  mode: string
  language: string
  difficulty: string
}

export interface Result {
  id: number
  mode: string
  language: string
  difficulty: string
  created_at?: string
}

export async function createResult(
    userId: number,
    payload: CreateResultPayload,
): Promise<Result>{
    const response = await fetch(`/api/users/${userId}/results`,{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
        },
        body: JSON.stringify(payload),
    })
    if (!response.ok) {
    let message = `Request failed with status ${response.status}`

    try {
      const body = await response.json()
      if (typeof body.detail === 'string') {
        message = body.detail
      }
    } catch {
      // the response may not contain json
    }

    throw new ApiError(response.status, message)
  }
  return response.json()
}

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...options,
    headers: {
      Accept: 'application/json',
      ...options?.headers,
    },
  })

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`

    try {
      const body = await response.json()
      if (typeof body.detail === 'string') {
        message = body.detail
      }
    } catch {
      // the response may not contain json
    }

    throw new ApiError(response.status, message)
  }

  return response.json() as Promise<T>
}

export interface Post {
  id: number
  content: string
}

export function getResults(userId: number){
  return request<Result[]>(`/api/results/${userId}`)
}

export function getBackendIndex(){
  return request<string>('/api/info')
}

export async function getMotd() {
  const response = await fetch('/api/motd')

  if (!response.ok) {
    throw new ApiError(response.status, `Could not load MOTD: ${response.status}`)
  }

  return response.text()
}