export interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: string
  annotation?: string
}

export interface Conversation {
  id: string
  title: string
  createdAt: string
  updatedAt: string
  provider: string
  model: string
  messages: Message[]
  systemPrompt?: string
}

export interface AgentConfig {
  provider: 'claude' | string
  model: string
  apiKey: string
  systemPrompt?: string
  maxTokens?: number
}

export interface AgentResponse {
  content: string
  model: string
  usage?: {
    inputTokens: number
    outputTokens: number
  }
}

export interface AgentAPI {
  sendMessage(messages: Message[], config: AgentConfig): Promise<AgentResponse>
}
