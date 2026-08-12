// ============================================================
// Career & Growth
// MVP v0.3
//
// Session / Child Identity Helpers
//
// This module contains small cross-cutting helpers used by
// Discovery, Parent Perspective, and Adventure evidence flows.
// ============================================================


// ============================================================
// SESSION ID
// ============================================================

export function createSessionId() {
  if (
    typeof crypto !== 'undefined' &&
    typeof crypto.randomUUID === 'function'
  ) {
    return `session_${crypto.randomUUID()}`
  }

  return `session_${Date.now()}_${Math.random()
    .toString(36)
    .slice(2, 9)}`
}


// ============================================================
// CHILD EVIDENCE ID
// ============================================================

export function getChildEvidenceId(
  childProfile
) {
  const normalizedName =
    childProfile.name
      .trim()
      .toLowerCase()
      .replace(
        /[^a-z0-9]+/g,
        '-'
      )
      .replace(
        /^-+|-+$/g,
        ''
      ) || 'child'

  return `child_${normalizedName}_${childProfile.age}`
}