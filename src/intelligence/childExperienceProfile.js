// SynapStride v0.15 — age-adaptive child experience profile.
// Keeps age-specific presentation decisions out of UI components.

export const childExperienceBands = Object.freeze({
  YOUNGER: 'younger',
  MIDDLE: 'middle',
  OLDER: 'older',
})

export const buildChildExperienceProfile = (childProfile = {}) => {
  const age = Number.parseInt(childProfile?.age, 10)
  const band = Number.isFinite(age) && age <= 8
    ? childExperienceBands.YOUNGER
    : Number.isFinite(age) && age >= 13
      ? childExperienceBands.OLDER
      : childExperienceBands.MIDDLE

  return {
    band,
    age: Number.isFinite(age) ? age : null,
    compactChoices: band === childExperienceBands.YOUNGER,
    preferShowAndTell: band === childExperienceBands.YOUNGER,
    companionPresence:
      band === childExperienceBands.YOUNGER ? 'high' :
      band === childExperienceBands.OLDER ? 'light' : 'balanced',
    greetingPrompt:
      band === childExperienceBands.YOUNGER
        ? 'What do you want to do?'
        : band === childExperienceBands.OLDER
          ? 'What are you working on?'
          : 'What are you up to today?',
    companionPlaceholder:
      band === childExperienceBands.YOUNGER
        ? 'Tell me anything...'
        : 'Ask me anything...',
  }
}
