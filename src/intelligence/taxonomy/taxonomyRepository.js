import { signals, traits, domains, pathways, careerFamilies, GROWTH_MODEL_VERSION } from '../../data/growthTaxonomy'

const groups = { signal: signals, trait: traits, domain: domains, pathway: pathways, career_family: careerFamilies }

export const localTaxonomyRepository = {
  getVersion() { return GROWTH_MODEL_VERSION },
  getById(id) {
    for (const [type, values] of Object.entries(groups)) {
      const match = values?.[id]
      if (match) return { ...match, taxonomyType: type, canonicalId: `${type}.${match.id}` }
    }
    return null
  },
  list(type) { return Object.values(groups[type] || {}).map((item) => ({ ...item, taxonomyType: type, canonicalId: `${type}.${item.id}` })) },
  search(query = '') {
    const q = String(query).trim().toLowerCase()
    if (!q) return []
    return Object.keys(groups).flatMap((type) => this.list(type)).filter((item) =>
      [item.id, item.label, item.description].some((value) => String(value || '').toLowerCase().includes(q))
    )
  },
}
