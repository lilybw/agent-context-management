import { ClaudeAgent } from './claude'
import type { AgentAPI, AgentConfig } from './types'

export function createAgent(config: AgentConfig): AgentAPI {
  switch (config.provider) {
    case 'claude':
      return new ClaudeAgent()
    default:
      throw new Error(`Unknown provider: ${config.provider}`)
  }
}

export type { AgentAPI, AgentConfig, AgentResponse, Message, Conversation } from './types'
