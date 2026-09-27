export function buildGrowthGuideContext({ personalizedGuidance, childUnderstanding, journeyItems = [], growthActivities = [], recommendations = [] } = {}) {
  return {
    personalizedGuidance: personalizedGuidance || null,
    childUnderstanding: childUnderstanding || null,
    journeyItems: Array.isArray(journeyItems) ? journeyItems : [],
    growthActivities: Array.isArray(growthActivities) ? growthActivities : [],
    recommendations: Array.isArray(recommendations) ? recommendations : [],
  }
}
