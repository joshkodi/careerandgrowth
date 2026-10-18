// Stage 6B: dynamic learning resources. No Brave key or secrets in the browser.
const CACHE_VERSION = 'v2-quality'
const TTL_MS = 24 * 60 * 60 * 1000
const memory = new Map()
const inFlight = new Map()

const endpoint = () => {
  const explicit = String(import.meta.env.VITE_RESOURCE_DISCOVERY_API_URL || '').trim()
  if (explicit) return explicit
  const model = String(import.meta.env.VITE_MODEL_API_URL || '').trim()
  return /\/model\/?(?:\?.*)?$/.test(model) ? model.replace(/\/model\/?(?:\?.*)?$/, '/resources/discover') : ''
}

const clean = (value) => String(value || '')
  .replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ')
  .replace(/&amp;/g, '&').replace(/&quot;/g, '"')
  .replace(/&#39;/g, "'").replace(/\s+/g, ' ').trim()

// Rank age-friendly, goal-specific pages before generic or academic documents.
// This is a heuristic, not a guarantee of educational accuracy or reading level.
const rank = (item, goal, age) => {
  const host = new URL(item.url).hostname.toLowerCase()
  const path = new URL(item.url).pathname.toLowerCase()
  const title = item.title.toLowerCase()
  const text = `${title} ${item.description.toLowerCase()}`
  const goalTerms = String(goal || '').toLowerCase().match(/[a-z]{4,}/g) || []
  const stop = new Set(['what', 'which', 'about', 'their', 'these', 'those', 'with', 'from', 'this', 'that', 'have', 'learn', 'understand', 'explain'])
  const relevant = [...new Set(goalTerms.filter(t => !stop.has(t)))].filter(t => text.includes(t))
  let score = relevant.length * 4
  if (host === 'kids.britannica.com') score += 12
  else if (host.includes('kids.') || host.includes('kids') || host.includes('ducksters.com')) score += 9
  else if (host.includes('khanacademy.org') || host.includes('pbslearningmedia.org')) score += 7
  else if (host.includes('britannica.com') || host.endsWith('.edu') || host.endsWith('.gov')) score += 3
  if (/kids|children|student|middle school|grade [3-8]|for students/.test(text)) score += 5
  if (age != null && Number(age) <= 12 && /research paper|journal article|academic|dissertation|college|university students/.test(text)) score -= 12
  if (/\.pdf(?:$|\?)/.test(path) || /\.pdf(?:$|\?)/.test(item.url.toLowerCase())) score -= 25
  if (host === 'files.eric.ed.gov' || host === 'eric.ed.gov') score -= 15
  return score
}

const normalize = (items, goal, age) => {
  const seen = new Set()
  return (Array.isArray(items) ? items : []).flatMap((item) => {
    try {
      const url = new URL(item?.url)
      if (url.protocol !== 'https:' || url.username || url.password) return []
      const key = url.href.replace(/\/$/, '')
      if (seen.has(key)) return []
      seen.add(key)
      const title = clean(item?.title)
      if (!title) return []
      return [{ title, description: clean(item?.description).slice(0, 250), url: key,
        provider: clean(item?.source) || url.hostname }]
    } catch { return [] }
  }).sort((a, b) => rank(b, goal, age) - rank(a, goal, age)).slice(0, 3)
}

export async function discoverLiveLearningResources({ topic, learningGoal, age }) {
  const url = endpoint()
  if (!url || !learningGoal) return { resources: [], status: 'unconfigured' }
  const key = `synapstride:resources:${CACHE_VERSION}:${JSON.stringify([topic, learningGoal, age])}`
  const now = Date.now()
  const saved = memory.get(key)
  if (saved && saved.expires > now) return { resources: saved.resources, status: 'cached' }
  try {
    const raw = localStorage.getItem(key)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (parsed.expires > now && Array.isArray(parsed.resources)) {
        memory.set(key, parsed)
        return { resources: parsed.resources, status: 'cached' }
      }
    }
  } catch { /* Private browsing or storage disabled */ }
  if (inFlight.has(key)) return inFlight.get(key)
  const request = (async () => {
    try {
      const response = await fetch(url, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, learningGoal, age }),
      })
      if (!response.ok) throw new Error(`Resource search HTTP ${response.status}`)
      const payload = await response.json()
      const body = typeof payload.body === 'string' ? JSON.parse(payload.body) : payload
      const resources = normalize(body.resources, learningGoal, age)
      if (resources.length) {
        const entry = { resources, expires: Date.now() + TTL_MS }
        memory.set(key, entry)
        try { localStorage.setItem(key, JSON.stringify(entry)) } catch { /* optional cache */ }
      }
      return { resources, status: resources.length ? 'ready' : 'empty' }
    } catch (error) {
      if (import.meta.env.DEV) console.warn('Resource discovery unavailable:', error)
      return { resources: [], status: 'unavailable' }
    } finally { inFlight.delete(key) }
  })()
  inFlight.set(key, request)
  return request
}
