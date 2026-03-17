import Anthropic from '@anthropic-ai/sdk'
import type { AgentAPI, AgentConfig, AgentResponse, Message } from './types'

export class ClaudeAgent implements AgentAPI {
  async sendMessage(messages: Message[], config: AgentConfig): Promise<AgentResponse> {
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

    return {
      content,
      model: response.model,
      usage: {
        inputTokens: response.usage.input_tokens,
        outputTokens: response.usage.output_tokens,
      },
    }
  }
}
