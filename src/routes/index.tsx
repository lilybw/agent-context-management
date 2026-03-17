import { createSignal } from 'solid-js'
import type { AgentConfig } from '../agents/types'
import Chat from '../components/Chat'
import ConfigPanel from '../components/ConfigPanel'

export default function Home() {
  const [config, setConfig] = createSignal<AgentConfig>({
    provider: 'claude',
    model: 'claude-opus-4-5',
    apiKey: '',
    systemPrompt: '',
    maxTokens: 4096,
  })

  return (
    <div class="app-layout">
      <ConfigPanel onConfigChange={setConfig} />
      <main class="app-main">
        <Chat config={config()} />
      </main>
    </div>
  )
}
