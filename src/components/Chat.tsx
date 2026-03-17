import { createSignal, Show } from 'solid-js'
import type { AgentConfig, Conversation } from '../agents/types'
import {
  addMessage,
  createAssistantMessage,
  createConversation,
  createUserMessage,
  updateAnnotation,
} from '../lib/history'
import { saveConversation } from '../lib/storage'
import DropZone from './DropZone'
import MessageInput from './MessageInput'
import MessageList from './MessageList'

interface ChatProps {
  config: AgentConfig
}

export default function Chat(props: ChatProps) {
  const [conversation, setConversation] = createSignal<Conversation>(
    createConversation(props.config.provider, props.config.model, props.config.systemPrompt)
  )
  const [loading, setLoading] = createSignal(false)
  const [error, setError] = createSignal<string | null>(null)
  const [showDropZone, setShowDropZone] = createSignal(false)

  async function sendMessage(content: string) {
    setError(null)
    const userMsg = createUserMessage(content)
    let conv = addMessage(conversation(), userMsg)
    setConversation(conv)
    setLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: conv.messages,
          config: props.config,
        }),
      })

      if (!res.ok) {
        const body = await res.json().catch(() => ({ error: res.statusText }))
        throw new Error(body.error ?? `Request failed: ${res.status}`)
      }

      const data = await res.json() as { content: string; model: string }
      const assistantMsg = createAssistantMessage(data.content)
      conv = addMessage(conv, assistantMsg)
      setConversation(conv)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  function newConversation() {
    setConversation(
      createConversation(props.config.provider, props.config.model, props.config.systemPrompt)
    )
    setError(null)
  }

  function handleAnnotate(index: number, annotation: string) {
    setConversation(updateAnnotation(conversation(), index, annotation))
  }

  function handleLoad(loaded: Conversation) {
    setConversation(loaded)
    setShowDropZone(false)
    setError(null)
  }

  return (
    <div class="chat">
      <div class="chat__header">
        <h2 class="chat__title">{conversation().title}</h2>
        <div class="chat__actions">
          <button class="btn btn--ghost btn--sm" onClick={() => setShowDropZone(true)}>
            Load
          </button>
          <button
            class="btn btn--ghost btn--sm"
            onClick={() => saveConversation(conversation())}
            disabled={conversation().messages.length === 0}
          >
            Save
          </button>
          <button class="btn btn--secondary btn--sm" onClick={newConversation}>
            New
          </button>
        </div>
      </div>

      <div class="chat__body">
        <Show
          when={conversation().messages.length > 0}
          fallback={
            <div class="chat__empty">
              <p>No messages yet. Start a conversation below.</p>
            </div>
          }
        >
          <MessageList messages={conversation().messages} onAnnotate={handleAnnotate} />
        </Show>
      </div>

      <Show when={error()}>
        <div class="chat__error">⚠ {error()}</div>
      </Show>

      <div class="chat__footer">
        <MessageInput onSubmit={sendMessage} disabled={loading()} />
      </div>

      <Show when={showDropZone()}>
        <DropZone onLoad={handleLoad} onClose={() => setShowDropZone(false)} />
      </Show>
    </div>
  )
}
