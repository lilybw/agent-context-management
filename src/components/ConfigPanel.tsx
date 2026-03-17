import { createEffect, createSignal } from 'solid-js'
import type { AgentConfig } from '../agents/types'

const STORAGE_KEY = 'agent-config'

const DEFAULTS: AgentConfig = {
  provider: 'claude',
  model: 'claude-opus-4-5',
  apiKey: '',
  systemPrompt: '',
  maxTokens: 4096,
}

function loadConfig(): AgentConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return { ...DEFAULTS, ...JSON.parse(raw) } as AgentConfig
  } catch {}
  return { ...DEFAULTS }
}

interface ConfigPanelProps {
  onConfigChange: (config: AgentConfig) => void
}

export default function ConfigPanel(props: ConfigPanelProps) {
  const saved = loadConfig()
  const [provider, setProvider] = createSignal(saved.provider)
  const [model, setModel] = createSignal(saved.model)
  const [apiKey, setApiKey] = createSignal(saved.apiKey)
  const [systemPrompt, setSystemPrompt] = createSignal(saved.systemPrompt ?? '')
  const [maxTokens, setMaxTokens] = createSignal(saved.maxTokens ?? 4096)
  const [showKey, setShowKey] = createSignal(false)

  createEffect(() => {
    const config: AgentConfig = {
      provider: provider(),
      model: model(),
      apiKey: apiKey(),
      systemPrompt: systemPrompt(),
      maxTokens: maxTokens(),
    }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config))
    } catch {}
    props.onConfigChange(config)
  })

  return (
    <aside class="config-panel">
      <h2 class="config-panel__title">Configuration</h2>

      <div class="form-group">
        <label class="form-label" for="provider">
          Provider
        </label>
        <select
          id="provider"
          class="form-select"
          value={provider()}
          onChange={(e) => setProvider(e.currentTarget.value)}
        >
          <option value="claude">Claude (Anthropic)</option>
        </select>
      </div>

      <div class="form-group">
        <label class="form-label" for="model">
          Model
        </label>
        <select
          id="model"
          class="form-select"
          value={model()}
          onChange={(e) => setModel(e.currentTarget.value)}
        >
          <option value="claude-opus-4-5">claude-opus-4-5</option>
          <option value="claude-sonnet-4-5">claude-sonnet-4-5</option>
          <option value="claude-haiku-4-5">claude-haiku-4-5</option>
          <option value="claude-3-5-sonnet-20241022">claude-3-5-sonnet-20241022</option>
          <option value="claude-3-5-haiku-20241022">claude-3-5-haiku-20241022</option>
          <option value="claude-3-opus-20240229">claude-3-opus-20240229</option>
        </select>
      </div>

      <div class="form-group">
        <label class="form-label" for="apiKey">
          API Key
          <span class="form-hint"> (stored locally in your browser only)</span>
        </label>
        <div class="form-input-row">
          <input
            id="apiKey"
            class="form-input"
            type={showKey() ? 'text' : 'password'}
            value={apiKey()}
            onInput={(e) => setApiKey(e.currentTarget.value)}
            placeholder="sk-ant-…"
            autocomplete="off"
          />
          <button
            class="btn btn--ghost btn--sm"
            type="button"
            onClick={() => setShowKey((v) => !v)}
          >
            {showKey() ? 'Hide' : 'Show'}
          </button>
        </div>
      </div>

      <div class="form-group">
        <label class="form-label" for="maxTokens">
          Max Tokens
        </label>
        <input
          id="maxTokens"
          class="form-input"
          type="number"
          min={1}
          max={32768}
          value={maxTokens()}
          onInput={(e) => setMaxTokens(Number(e.currentTarget.value))}
        />
      </div>

      <div class="form-group">
        <label class="form-label" for="systemPrompt">
          System Prompt
        </label>
        <textarea
          id="systemPrompt"
          class="form-textarea"
          value={systemPrompt()}
          onInput={(e) => setSystemPrompt(e.currentTarget.value)}
          placeholder="Optional system prompt…"
          rows={5}
        />
      </div>
    </aside>
  )
}
