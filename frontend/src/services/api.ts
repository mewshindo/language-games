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
  game: string
  difficulty: number
  score: number
}

export interface Result {
  id: number
  mode: string
  language: string
  difficulty: string
  created_at?: string
}

export interface LoginPayload {
  email: string
  password: string
}

export interface RegisterPayload {
  username: string
  email: string
  password: string
}

export interface Token {
  access_token: string
  token_type: string
}

export interface UserPublic {
  id: number
  username: string
}

export interface UserPrivate extends UserPublic {
  email: string
}

export interface UserStats extends UserPublic {
  created: Date
  total_runs: number
  completed_runs: number
}

const cache = new Map<string, { data: unknown; timestamp: number }>()

interface RequestOptions extends RequestInit {
  retries?: number
  retryDelay?: number
  skipCache?: boolean
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let message = `Request failed with status ${response.status}`

    try {
      const body = await response.json()
      if (typeof body.detail === 'string') {
        message = body.detail
      }
    } catch {
      // response may not contain json
    }

    throw new ApiError(response.status, message)
  }

  return response.json()
}

async function request<T>(route: string, options: RequestOptions): Promise<T> {
  const { retries = 0, retryDelay = 1000, skipCache = false, ...fetchOptions } = options

  const cacheKey = `${route}-${JSON.stringify(fetchOptions)}`
  const isGET = !fetchOptions.method || fetchOptions.method === 'GET'

  if (isGET && !skipCache) {
    const cached = cache.get(cacheKey)
    if (cached) {
      console.log(Date.now() - cached.timestamp)
    } else {
      console.log('no cache')
    }
    if (cached && Date.now() - cached.timestamp < 5000) {
      console.log('returning cached data')
      return cached.data as T
    }
  }

  let lastError: Error | null = null

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await fetch(route, {
        ...fetchOptions,
        headers: {
          Accept: 'application/json',
          ...fetchOptions.headers,
        },
      })

      const result = await handleResponse<T>(response)

      if (isGET && !skipCache) {
        cache.set(cacheKey, { data: result, timestamp: Date.now() })
      }

      return result
    } catch (error) {
      lastError = error as Error
      if (attempt < retries) {
        await new Promise((resolve) => setTimeout(resolve, retryDelay))
        continue
      }
      throw lastError
    }
  }

  throw lastError
}

export async function register(payload: RegisterPayload): Promise<Token> {
  return request<Token>('/api/users/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
}

export async function login(payload: LoginPayload): Promise<Token> {
  return request<Token>('/api/users/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      username: payload.email,
      password: payload.password,
    }),
  })
}

export async function getCurrentUser(token: string): Promise<UserPrivate> {
  return request<UserPrivate>(`/api/users/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

export async function getUserStats(userId: string): Promise<UserStats> {
  return request<UserStats>(`/api/users/${userId}/stats`, {
    headers: {
      Accept: 'application/json',
    },
  })
}

export async function createResult(userId: number, payload: CreateResultPayload): Promise<Result> {
  return request<Result>(`/api/users/${userId}/results`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(payload),
  })
}

export async function sendRunStarted(userId: number) {
  return request(`/api/users/${userId}/runs`, {
    method: 'POST',
  })
}
