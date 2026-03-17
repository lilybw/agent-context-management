import { createSignal, Show } from 'solid-js'
import type { Conversation } from '../agents/types'
import { loadConversationFromFile } from '../lib/storage'

interface DropZoneProps {
  onLoad: (conversation: Conversation) => void
  onClose: () => void
}

export default function DropZone(props: DropZoneProps) {
  const [dragging, setDragging] = createSignal(false)
  const [error, setError] = createSignal<string | null>(null)

  async function handleFile(file: File) {
    setError(null)
    if (!file.name.endsWith('.json') && file.type !== 'application/json') {
      setError('Please drop a JSON file')
      return
    }
    try {
      const conversation = await loadConversationFromFile(file)
      props.onLoad(conversation)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load file')
    }
  }

  function onDragOver(e: DragEvent) {
    e.preventDefault()
    setDragging(true)
  }

  function onDragLeave() {
    setDragging(false)
  }

  async function onDrop(e: DragEvent) {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer?.files[0]
    if (file) await handleFile(file)
  }

  async function onFileInput(e: Event) {
    const input = e.target as HTMLInputElement
    const file = input.files?.[0]
    if (file) await handleFile(file)
  }

  return (
    <div class="dropzone-overlay">
      <div
        class={`dropzone ${dragging() ? 'dropzone--active' : ''}`}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      >
        <div class="dropzone__icon">📂</div>
        <p class="dropzone__title">Drop a conversation JSON file here</p>
        <p class="dropzone__subtitle">or</p>
        <label class="btn btn--secondary">
          Browse files
          <input
            type="file"
            accept=".json,application/json"
            style="display:none"
            onChange={onFileInput}
          />
        </label>
        <Show when={error()}>
          <p class="dropzone__error">{error()}</p>
        </Show>
        <button class="btn btn--ghost dropzone__close" onClick={props.onClose}>
          Cancel
        </button>
      </div>
    </div>
  )
}
