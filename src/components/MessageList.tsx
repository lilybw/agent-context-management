import { createSignal, For, Show } from 'solid-js'
import type { Message } from '../agents/types'

interface MessageListProps {
  messages: Message[]
  onAnnotate: (index: number, annotation: string) => void
}

export default function MessageList(props: MessageListProps) {
  return (
    <div class="message-list">
      <For each={props.messages}>
        {(message, index) => (
          <MessageItem message={message} index={index()} onAnnotate={props.onAnnotate} />
        )}
      </For>
    </div>
  )
}

interface MessageItemProps {
  message: Message
  index: number
  onAnnotate: (index: number, annotation: string) => void
}

function MessageItem(props: MessageItemProps) {
  const [editing, setEditing] = createSignal(false)
  const [draft, setDraft] = createSignal(props.message.annotation ?? '')

  function saveAnnotation() {
    props.onAnnotate(props.index, draft())
    setEditing(false)
  }

  function cancelEdit() {
    setDraft(props.message.annotation ?? '')
    setEditing(false)
  }

  const formattedTime = () => {
    try {
      return new Date(props.message.timestamp).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      })
    } catch {
      return ''
    }
  }

  return (
    <div class={`message message--${props.message.role}`}>
      <div class="message__header">
        <span class="message__role">{props.message.role === 'user' ? 'You' : 'Assistant'}</span>
        <span class="message__time">{formattedTime()}</span>
      </div>
      <div class="message__content">{props.message.content}</div>
      <Show when={props.message.annotation && !editing()}>
        <div class="message__annotation">
          <span class="message__annotation-label">Note:</span> {props.message.annotation}
        </div>
      </Show>
      <Show when={editing()}>
        <div class="message__annotation-editor">
          <textarea
            class="annotation-input"
            value={draft()}
            onInput={(e) => setDraft(e.currentTarget.value)}
            placeholder="Add a note about this message…"
            rows={2}
          />
          <div class="annotation-actions">
            <button class="btn btn--sm btn--primary" onClick={saveAnnotation}>
              Save
            </button>
            <button class="btn btn--sm btn--ghost" onClick={cancelEdit}>
              Cancel
            </button>
          </div>
        </div>
      </Show>
      <Show when={!editing()}>
        <button
          class="btn btn--xs btn--ghost message__annotate-btn"
          onClick={() => {
            setDraft(props.message.annotation ?? '')
            setEditing(true)
          }}
        >
          {props.message.annotation ? 'Edit note' : '+ Add note'}
        </button>
      </Show>
    </div>
  )
}
