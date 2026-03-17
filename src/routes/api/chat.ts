import { createAgent } from '../../agents/index'
import type { AgentConfig, Message } from '../../agents/types'

function jsonResponse(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

interface ChatRequest {
  messages: Message[]
  config: AgentConfig
}

export async function POST({ request }: { request: Request }) {
  try {
    const body = await request.json() as ChatRequest
    const { messages, config } = body

    if (!config.apiKey) {
      return jsonResponse({ error: 'API key is required' }, 400)
    }

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return jsonResponse({ error: 'Messages are required' }, 400)
    }

    const agent = createAgent(config)
    const response = await agent.sendMessage(messages, config)

    return jsonResponse(response)
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Internal server error'
    return jsonResponse({ error: message }, 500)
  }
}
