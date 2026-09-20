const ACCOUNTS_KEY = 'synapstride.v0121.localAccounts'
const SESSION_KEY = 'synapstride.v0121.authSession'
const LEGACY_ACCOUNT_KEY = 'synapstride.v012.parentAccount'
const LEGACY_SESSION_KEY = 'synapstride.v012.authSession'

const encoder = new TextEncoder()

const readJson = (key, fallback = null) => {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch (error) {
    console.error(`Unable to read ${key}.`, error)
    return fallback
  }
}

const writeJson = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value))
}

const toHex = (buffer) =>
  Array.from(new Uint8Array(buffer))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('')

const randomHex = (byteLength = 16) => {
  const bytes = new Uint8Array(byteLength)
  window.crypto.getRandomValues(bytes)
  return toHex(bytes)
}

const digestPassword = async (password, salt) => {
  const digest = await window.crypto.subtle.digest(
    'SHA-256',
    encoder.encode(`${salt}:${password}`)
  )
  return toHex(digest)
}

const normalizeEmail = (email = '') => email.trim().toLowerCase()

const migrateLegacyAccount = () => {
  const existing = readJson(ACCOUNTS_KEY, [])
  if (Array.isArray(existing) && existing.length > 0) return existing

  const legacy = readJson(LEGACY_ACCOUNT_KEY)
  if (!legacy?.email || !legacy?.passwordHash) return []

  // Keep the legacy SHA-256 hash only long enough to validate an existing local MVP account.
  // The next successful sign-in upgrades it to the salted v0.12.1 format.
  const migrated = [{
    id: legacy.id || `parent_${randomHex(8)}`,
    familyId: legacy.familyId || `family_${randomHex(8)}`,
    email: normalizeEmail(legacy.email),
    provider: legacy.provider || 'email',
    legacyPasswordHash: legacy.passwordHash,
    passwordHash: null,
    passwordSalt: null,
    createdAt: legacy.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }]
  writeJson(ACCOUNTS_KEY, migrated)
  return migrated
}

export const getLocalAccounts = () => {
  const accounts = readJson(ACCOUNTS_KEY, null)
  return Array.isArray(accounts) ? accounts : migrateLegacyAccount()
}

export const findLocalAccount = (email) => {
  const normalized = normalizeEmail(email)
  return getLocalAccounts().find((account) => account.email === normalized) || null
}

export const createLocalAccount = async ({ email, password }) => {
  const normalized = normalizeEmail(email)
  if (findLocalAccount(normalized)) {
    return { ok: false, code: 'ACCOUNT_EXISTS' }
  }

  const salt = randomHex(16)
  const passwordHash = await digestPassword(password, salt)
  const now = new Date().toISOString()
  const account = {
    id: `parent_${randomHex(8)}`,
    familyId: `family_${randomHex(8)}`,
    email: normalized,
    provider: 'email',
    passwordHash,
    passwordSalt: salt,
    createdAt: now,
    updatedAt: now,
  }

  const accounts = [...getLocalAccounts(), account]
  writeJson(ACCOUNTS_KEY, accounts)
  return { ok: true, account }
}

export const validateLocalCredentials = async ({ email, password }) => {
  const account = findLocalAccount(email)
  if (!account) return { ok: false, code: 'ACCOUNT_NOT_FOUND' }

  if (account.passwordHash && account.passwordSalt) {
    const candidate = await digestPassword(password, account.passwordSalt)
    return candidate === account.passwordHash
      ? { ok: true, account }
      : { ok: false, code: 'INVALID_PASSWORD' }
  }

  // Legacy v0.12 account migration path.
  if (account.legacyPasswordHash) {
    const legacyDigest = await window.crypto.subtle.digest(
      'SHA-256',
      encoder.encode(password)
    )
    const candidate = toHex(legacyDigest)
    if (candidate !== account.legacyPasswordHash) {
      return { ok: false, code: 'INVALID_PASSWORD' }
    }

    const salt = randomHex(16)
    const upgradedHash = await digestPassword(password, salt)
    const upgraded = {
      ...account,
      passwordHash: upgradedHash,
      passwordSalt: salt,
      legacyPasswordHash: undefined,
      updatedAt: new Date().toISOString(),
    }
    const accounts = getLocalAccounts().map((item) =>
      item.id === upgraded.id ? upgraded : item
    )
    writeJson(ACCOUNTS_KEY, accounts)
    return { ok: true, account: upgraded }
  }

  return { ok: false, code: 'INVALID_PASSWORD' }
}

export const createLocalSession = (account) => {
  const session = {
    signedIn: true,
    role: 'parent',
    parentId: account.id,
    familyId: account.familyId,
    email: account.email,
    provider: account.provider || 'email',
    signedInAt: new Date().toISOString(),
  }
  writeJson(SESSION_KEY, session)
  localStorage.removeItem(LEGACY_SESSION_KEY)
  return session
}

export const getLocalSession = () => {
  const session = readJson(SESSION_KEY)
  if (
    session?.signedIn &&
    (session?.email || session?.username)
  ) return session

  const legacy = readJson(LEGACY_SESSION_KEY)
  if (!legacy?.signedIn || !legacy?.email) return null
  const account = findLocalAccount(legacy.email)
  if (!account) return null
  return createLocalSession(account)
}

export const getAccountForSession = (session) => {
  if (!session?.signedIn || session?.role === 'child') return null
  return getLocalAccounts().find((account) =>
    account.id === session.parentId || account.email === normalizeEmail(session.email)
  ) || null
}

export const clearLocalSession = () => {
  localStorage.removeItem(SESSION_KEY)
  localStorage.removeItem(LEGACY_SESSION_KEY)
}


const CHILD_ACCOUNTS_KEY = 'synapstride.v014.childAccounts'
const normalizeUsername = (username = '') => username.trim().toLowerCase()

export const getLocalChildAccounts = () => {
  const accounts = readJson(CHILD_ACCOUNTS_KEY, [])
  return Array.isArray(accounts) ? accounts : []
}

export const findLocalChildAccount = (username) => {
  const normalized = normalizeUsername(username)
  return getLocalChildAccounts().find((account) => account.username === normalized) || null
}

export const createLocalChildAccount = async ({
  familyId,
  childId,
  childName,
  username,
  password,
}) => {
  const normalized = normalizeUsername(username)

  if (!familyId || !childId || !normalized || !password) {
    return { ok: false, code: 'INVALID_CHILD_ACCOUNT' }
  }

  const existing = findLocalChildAccount(normalized)

  // A username belonging to another family/child is a real conflict.
  if (
    existing &&
    (
      existing.familyId !== familyId ||
      existing.childId !== childId
    )
  ) {
    return { ok: false, code: 'USERNAME_EXISTS' }
  }

  const salt = randomHex(16)
  const passwordHash = await digestPassword(password, salt)
  const now = new Date().toISOString()

  const account = existing
    ? {
        ...existing,
        role: 'child',
        familyId,
        childId,
        childName: childName || existing.childName || 'Child',
        username: normalized,
        passwordHash,
        passwordSalt: salt,
        updatedAt: now,
      }
    : {
        id: `child_${randomHex(8)}`,
        role: 'child',
        familyId,
        childId,
        childName: childName || 'Child',
        username: normalized,
        passwordHash,
        passwordSalt: salt,
        createdAt: now,
        updatedAt: now,
      }

  const accounts = existing
    ? getLocalChildAccounts().map((item) =>
        item.id === existing.id ? account : item
      )
    : [...getLocalChildAccounts(), account]

  writeJson(CHILD_ACCOUNTS_KEY, accounts)

  // Verify the exact credential pair before reporting success.
  const verification = await validateLocalChildCredentials({
    username: normalized,
    password,
  })

  if (!verification.ok) {
    return { ok: false, code: 'CHILD_ACCOUNT_VERIFICATION_FAILED' }
  }

  return { ok: true, account: verification.account }
}

export const validateLocalChildCredentials = async ({ username, password }) => {
  const account = findLocalChildAccount(username)
  if (!account) return { ok: false, code: 'ACCOUNT_NOT_FOUND' }
  const candidate = await digestPassword(password, account.passwordSalt)
  return candidate === account.passwordHash
    ? { ok: true, account }
    : { ok: false, code: 'INVALID_PASSWORD' }
}

export const getChildAccountForSession = (session) => {
  if (!session?.signedIn || session?.role !== 'child') return null

  return getLocalChildAccounts().find((account) =>
    account.id === session.childAccountId ||
    (
      account.familyId === session.familyId &&
      account.username === normalizeUsername(session.username)
    )
  ) || null
}


export const createLocalChildSession = (account) => {
  const session = {
    signedIn: true,
    role: 'child',
    childAccountId: account.id,
    childId: account.childId,
    familyId: account.familyId,
    username: account.username,
    signedInAt: new Date().toISOString(),
  }
  writeJson(SESSION_KEY, session)
  localStorage.removeItem(LEGACY_SESSION_KEY)
  return session
}

export const localAuthStorageKeys = {
  accounts: ACCOUNTS_KEY,
  session: SESSION_KEY,
  childAccounts: CHILD_ACCOUNTS_KEY,
}
