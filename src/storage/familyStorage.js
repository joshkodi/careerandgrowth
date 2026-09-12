// src/storage/familyStorage.js
// SynapStride MVP v0.13 — local Family Workspace storage boundary.
// Local-only MVP adapter. Future backend storage can preserve the same family boundary.

const ACCOUNTS_KEY = 'synapstride.v0121.localAccounts'
const SESSION_KEY = 'synapstride.v0121.authSession'
const FAMILY_PREFIX = 'synapstride.family'

const readJson = (key, fallback = null) => {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

export const getActiveFamilyId = () => {
  const session = readJson(SESSION_KEY)
  return session?.signedIn ? session.familyId || null : null
}

export const getLegacyOwnerFamilyId = () => {
  const accounts = readJson(ACCOUNTS_KEY, [])
  return Array.isArray(accounts) && accounts.length > 0
    ? accounts[0]?.familyId || null
    : null
}

export const getFamilyStorageKey = (baseKey, familyId = getActiveFamilyId()) => {
  if (!familyId) return baseKey
  return `${FAMILY_PREFIX}.${familyId}.${baseKey}`
}

// Existing pre-v0.13 browser data belongs to the first local account. This lets
// the long-lived MVP test family retain its data while every newer family starts clean.
export const migrateLegacyStorageKey = (baseKey, familyId = getActiveFamilyId()) => {
  if (!familyId) return baseKey

  const scopedKey = getFamilyStorageKey(baseKey, familyId)
  if (localStorage.getItem(scopedKey) !== null) return scopedKey

  const legacyValue = localStorage.getItem(baseKey)
  const legacyOwner = getLegacyOwnerFamilyId()

  if (legacyValue !== null && legacyOwner === familyId) {
    localStorage.setItem(scopedKey, legacyValue)
    localStorage.removeItem(baseKey)
  }

  return scopedKey
}

export const removeFamilyStorageKey = (baseKey, familyId = getActiveFamilyId()) => {
  localStorage.removeItem(getFamilyStorageKey(baseKey, familyId))
}
