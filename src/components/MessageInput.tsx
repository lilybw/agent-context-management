import { createSignal } from 'solid-js'

interface MessageInputProps {
  onSubmit: (content: string) => void
  disabled: boolean
}

export default function MessageInput(props: MessageInputProps) {
  const [value, setValue] = createSignal('')

  function submit() {
    const content = value().trim()
    if (!content || props.disabled) return
    props.onSubmit(content)
    setValue('')
  }

  function onKeyDown(e: KeyboardEvent) {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault()
      submit()
    }
  }

  return (
    <div class="message-input">
      <textarea
        class="message-input__textarea"
        value={value()}
        onInput={(e) => setValue(e.currentTarget.value)}
        onKeyDown={onKeyDown}
        placeholder="Type a message… (Ctrl+Enter to send)"
        disabled={props.disabled}
        rows={3}
      />
      <button
        class="btn btn--primary message-input__send"
        onClick={submit}
        disabled={props.disabled || !value().trim()}
      >
        {props.disabled ? 'Sending…' : 'Send'}
      </button>
    </div>
  )
}
