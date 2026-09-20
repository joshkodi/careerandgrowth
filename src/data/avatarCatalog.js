export const avatarCatalog = [
  // Ages 5–7
  { id: 'nova-blue', label: 'Nova', ageBand: '5-7', gender: 'boy', skin: '#F1BE93', hair: '#4A2B1B', hairStyle: 'swoop', shirt: '#2F80ED', bg: '#E8F4FF' },
  { id: 'milo-orange', label: 'Milo', ageBand: '5-7', gender: 'boy', skin: '#8D5524', hair: '#261711', hairStyle: 'curls', shirt: '#F2994A', bg: '#FFF1E4' },
  { id: 'leo-slate', label: 'Leo', ageBand: '5-7', gender: 'boy', skin: '#F3C69C', hair: '#D49A33', hairStyle: 'side', shirt: '#4F5D75', bg: '#EEF2F7' },
  { id: 'kai-green', label: 'Kai', ageBand: '5-7', gender: 'boy', skin: '#E7B18B', hair: '#1D1D1F', hairStyle: 'crop', shirt: '#2F9E68', bg: '#EAF8F0' },
  { id: 'luna-pink', label: 'Luna', ageBand: '5-7', gender: 'girl', skin: '#F1C6A8', hair: '#6B3E2E', hairStyle: 'bob', shirt: '#EB5757', bg: '#FFF0F6' },
  { id: 'maya-yellow', label: 'Maya', ageBand: '5-7', gender: 'girl', skin: '#7A4328', hair: '#24130E', hairStyle: 'puffs', shirt: '#F2C94C', bg: '#FFF8D7' },
  { id: 'zoe-lilac', label: 'Zoe', ageBand: '5-7', gender: 'girl', skin: '#D49A78', hair: '#321D17', hairStyle: 'long', shirt: '#8B5CF6', bg: '#F3EEFF' },
  { id: 'aria-coral', label: 'Aria', ageBand: '5-7', gender: 'girl', skin: '#E7B18B', hair: '#9A4F2C', hairStyle: 'bob', shirt: '#FF6B6B', bg: '#FFF0ED' },

  // Ages 8–12
  { id: 'ethan-blue', label: 'Ethan', ageBand: '8-12', gender: 'boy', skin: '#EAB98B', hair: '#5A2F1B', hairStyle: 'swoop', shirt: '#2563EB', bg: '#EAF2FF' },
  { id: 'jay-green', label: 'Jay', ageBand: '8-12', gender: 'boy', skin: '#A66A45', hair: '#151515', hairStyle: 'crop', shirt: '#219653', bg: '#E9F8EF' },
  { id: 'noah-orange', label: 'Noah', ageBand: '8-12', gender: 'boy', skin: '#8D5524', hair: '#261711', hairStyle: 'curls', shirt: '#F2994A', bg: '#FFF1E4' },
  { id: 'liam-indigo', label: 'Liam', ageBand: '8-12', gender: 'boy', skin: '#F1C6A8', hair: '#3D2C24', hairStyle: 'side', shirt: '#4F46E5', bg: '#EEF0FF' },
  { id: 'aria-purple', label: 'Aria', ageBand: '8-12', gender: 'girl', skin: '#D49A78', hair: '#321D17', hairStyle: 'long', shirt: '#7B61FF', bg: '#F1EDFF' },
  { id: 'zoe-coral', label: 'Zoe', ageBand: '8-12', gender: 'girl', skin: '#E7B18B', hair: '#9A4F2C', hairStyle: 'bob', shirt: '#FF6B6B', bg: '#FFF0ED' },
  { id: 'nia-teal', label: 'Nia', ageBand: '8-12', gender: 'girl', skin: '#7D4A2F', hair: '#17100C', hairStyle: 'puffs', shirt: '#14B8A6', bg: '#E7FAF7' },
  { id: 'sana-rose', label: 'Sana', ageBand: '8-12', gender: 'girl', skin: '#C88F6B', hair: '#231A18', hairStyle: 'long', shirt: '#E85D9E', bg: '#FFF0F7' },

  // Ages 13–15
  { id: 'kai-indigo', label: 'Kai', ageBand: '13-15', gender: 'boy', skin: '#D8A17C', hair: '#2A201D', hairStyle: 'side', shirt: '#4F46E5', bg: '#EEF0FF' },
  { id: 'omar-red', label: 'Omar', ageBand: '13-15', gender: 'boy', skin: '#9C5C37', hair: '#1B1410', hairStyle: 'curls', shirt: '#C0392B', bg: '#FDEDEC' },
  { id: 'alex-green', label: 'Alex', ageBand: '13-15', gender: 'boy', skin: '#F0C2A0', hair: '#262626', hairStyle: 'crop', shirt: '#27865A', bg: '#EBF8F1' },
  { id: 'mateo-gold', label: 'Mateo', ageBand: '13-15', gender: 'boy', skin: '#B87552', hair: '#3A251D', hairStyle: 'swoop', shirt: '#C88922', bg: '#FFF7E5' },
  { id: 'sophia-blue', label: 'Sophia', ageBand: '13-15', gender: 'girl', skin: '#F0C2A0', hair: '#4B2E23', hairStyle: 'long', shirt: '#3B82F6', bg: '#EBF4FF' },
  { id: 'ava-violet', label: 'Ava', ageBand: '13-15', gender: 'girl', skin: '#B87552', hair: '#20140F', hairStyle: 'long', shirt: '#8B5CF6', bg: '#F3EEFF' },
  { id: 'leila-teal', label: 'Leila', ageBand: '13-15', gender: 'girl', skin: '#9D6547', hair: '#19110F', hairStyle: 'bob', shirt: '#0F9D8A', bg: '#E8FAF6' },
  { id: 'emma-rose', label: 'Emma', ageBand: '13-15', gender: 'girl', skin: '#E7B18B', hair: '#7A4A34', hairStyle: 'long', shirt: '#D95F8D', bg: '#FFF1F5' },
]

export const DEFAULT_AVATAR_ID = 'ethan-blue'

export function getAgeBand(age) {
  const numericAge = Number(age)
  if (numericAge <= 7) return '5-7'
  if (numericAge <= 12) return '8-12'
  return '13-15'
}

export function getAvatarById(avatarId) {
  return avatarCatalog.find((avatar) => avatar.id === avatarId) ||
    avatarCatalog.find((avatar) => avatar.id === DEFAULT_AVATAR_ID)
}

export function getAvatarsForAge(age) {
  const band = getAgeBand(age)
  return avatarCatalog.filter((avatar) => avatar.ageBand === band)
}

export function getAvatarsForBand(ageBand = 'all') {
  if (ageBand === 'all') return avatarCatalog
  return avatarCatalog.filter((avatar) => avatar.ageBand === ageBand)
}
