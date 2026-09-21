const TRACE_LIMIT = 100
const traces = []
export function recordIntelligenceTrace(event = {}) { const trace = { id: `trace_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`, timestamp: new Date().toISOString(), ...event }; traces.push(trace); if (traces.length > TRACE_LIMIT) traces.splice(0, traces.length - TRACE_LIMIT); return trace }
export function getIntelligenceTraces() { return [...traces] }
export function clearIntelligenceTraces() { traces.splice(0, traces.length) }
