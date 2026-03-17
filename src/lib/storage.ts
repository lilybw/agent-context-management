import type { Conversation } from '../agents/types'

export function exportFilename(conversation: Conversation): string {
  const date = new Date(conversation.updatedAt).toISOString().split('T')[0]
  const safeName = conversation.title.replace(/[^a-z0-9]/gi, '-').toLowerCase()
  return `conversation-${safeName}-${date}.json`
}

export function saveConversation(conversation: Conversation): void {
  const json = JSON.stringify(conversation, null, 2)
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = exportFilename(conversation)
  anchor.click()
  URL.revokeObjectURL(url)
}

export async function loadConversationFromFile(file: File): Promise<Conversation> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const text = e.target?.result
        if (typeof text !== 'string') {
          reject(new Error('Failed to read file'))
          return
        }
        const data = JSON.parse(text) as Conversation
        if (!data.id || !data.messages || !Array.isArray(data.messages)) {
          reject(new Error('Invalid conversation file format'))
          return
        }
        resolve(data)
      } catch {
        reject(new Error('Failed to parse JSON file'))
      }
    }
    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsText(file)
  })
}
