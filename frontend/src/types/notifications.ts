export type MessageType = 'error' | 'success' | 'warning' | 'info'

export interface Message {
    id: number
    text: string
    type: MessageType
    duration: number
    createdAt: number
    elapsed: number
    isPaused: boolean
    timerId: ReturnType<typeof setInterval> | null
}