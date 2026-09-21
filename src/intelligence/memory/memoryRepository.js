import { createMemoryRecord } from './memoryModels'

const STORAGE_KEY = 'synapstride:v016:memory'
const memoryFallback = []
const storage = () => (typeof window !== 'undefined' && window.localStorage ? window.localStorage : null)
const readAll = () => { const s = storage(); if (!s) return [...memoryFallback]; try { return JSON.parse(s.getItem(STORAGE_KEY) || '[]') } catch { return [] } }
const writeAll = (records) => { const s = storage(); if (s) s.setItem(STORAGE_KEY, JSON.stringify(records)); else { memoryFallback.splice(0, memoryFallback.length, ...records) } }

export const localMemoryRepository = {
  async save(input) { const record = input?.version ? input : createMemoryRecord(input); const records = readAll(); const next = records.filter((x) => x.id !== record.id); next.push(record); writeAll(next); return record },
  async listByChild(childId) { return readAll().filter((x) => x.childId === childId) },
  async findRelevant({ childId, terms = [], limit = 8 } = {}) {
    const normalized = terms.map((x) => String(x).toLowerCase()).filter(Boolean)
    const records = await this.listByChild(childId)
    if (!normalized.length) return records.slice(-limit).reverse()
    return records.map((record) => ({ record, score: normalized.reduce((score, term) => score + (JSON.stringify(record).toLowerCase().includes(term) ? 1 : 0), 0) }))
      .filter((x) => x.score > 0).sort((a, b) => b.score - a.score).slice(0, limit).map((x) => x.record)
  },
  async clearChild(childId) { writeAll(readAll().filter((x) => x.childId !== childId)) },
}
