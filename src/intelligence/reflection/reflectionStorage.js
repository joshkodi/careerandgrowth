import { migrateLegacyStorageKey } from '../../storage/familyStorage'
const KEY='synapstride.v017.reflectionOutcomes'
const key=()=>migrateLegacyStorageKey(KEY)
export function getReflectionOutcomes({ childId }={}) { try { const all=JSON.parse(localStorage.getItem(key())||'[]'); return Array.isArray(all) ? (childId ? all.filter((x)=>x.childId===childId) : all) : [] } catch { return [] } }
export function saveReflectionOutcome(outcome={}) { if (!outcome?.childId || !outcome?.candidateId) return null; const all=getReflectionOutcomes(); const record={ id:`reflection-outcome-${Date.now()}`, createdAt:new Date().toISOString(), ...outcome }; localStorage.setItem(key(),JSON.stringify([...all,record])); return record }
