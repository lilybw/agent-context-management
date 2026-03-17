import type { Conversation, Message } from '../agents/types'

export function createConversation(
  provider: string,
  model: string,
  systemPrompt?: string
): Conversation {
  const now = new Date().toISOString()
  return {
    id: crypto.randomUUID(),
    title: 'New Conversation',
    createdAt: now,
    updatedAt: now,
    provider,
    model,
    messages: [],
    systemPrompt,
  }
}

export function addMessage(conversation: Conversation, message: Message): Conversation {
  const messages = [...conversation.messages, message]
  const title =
    conversation.messages.length === 0 && message.role === 'user'
      ? message.content.slice(0, 50) + (message.content.length > 50 ? '…' : '')
      : conversation.title
  return {
    ...conversation,
    title,
    messages,
    updatedAt: new Date().toISOString(),
  }
}

export function updateAnnotation(
  conversation: Conversation,
  messageIndex: number,
  annotation: string
): Conversation {
  const messages = conversation.messages.map((m, i) =>
    i === messageIndex ? { ...m, annotation } : m
  )
  return {
    ...conversation,
    messages,
    updatedAt: new Date().toISOString(),
  }
}

export function createUserMessage(content: string): Message {
  return {
    role: 'user',
    content,
    timestamp: new Date().toISOString(),
  }
}

export function createAssistantMessage(content: string): Message {
  return {
    role: 'assistant',
    content,
    timestamp: new Date().toISOString(),
  }
}
