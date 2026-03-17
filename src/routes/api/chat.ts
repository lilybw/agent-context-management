import Anthropic from '@anthropic-ai/sdk'
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

    const client = new Anthropic({ apiKey: config.apiKey })

    const formattedMessages = messages.map((m) => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    }))

    const params: Anthropic.MessageCreateParamsNonStreaming = {
      model: config.model,
      max_tokens: config.maxTokens ?? 4096,
      messages: formattedMessages,
    }

    if (config.systemPrompt) {
      params.system = config.systemPrompt
    }

    const response = await client.messages.create(params)

    const textBlock = response.content.find((b) => b.type === 'text')
    const content = textBlock && textBlock.type === 'text' ? textBlock.text : ''

    return jsonResponse({
      content,
      model: response.model,
      usage: {
        inputTokens: response.usage.input_tokens,
        outputTokens: response.usage.output_tokens,
      },
    })
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Internal server error'
    return jsonResponse({ error: message }, 500)
  }
}
