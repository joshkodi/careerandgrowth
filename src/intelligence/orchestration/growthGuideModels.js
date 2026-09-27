export const GROWTH_GUIDE_VERSION = '0.17.5'
export const guidanceCategories = Object.freeze({ CONTINUE: 'continue', EXPLORE: 'explore', GROW: 'grow' })
export function makeGuidanceAction(value = {}) {
  return {
    version: GROWTH_GUIDE_VERSION,
    id: value.id || `${value.category || 'guide'}-${value.targetId || value.source || 'action'}`,
    category: value.category || guidanceCategories.EXPLORE,
    source: value.source || 'synapstride',
    action: value.action || 'explore',
    targetId: value.targetId || null,
    title: value.title || 'Try something next',
    reason: value.reason || 'A useful next step based on what is happening now.',
    priority: Number.isFinite(value.priority) ? value.priority : 0,
    item: value.item || null,
    metadata: value.metadata || {},
  }
}
