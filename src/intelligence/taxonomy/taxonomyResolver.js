import { localTaxonomyRepository } from './taxonomyRepository'
const normalize = (value) => String(value || '').trim().toLowerCase().replace(/[^a-z0-9]+/g, ' ')

export function validateTaxonomyMapping(mapping, repository = localTaxonomyRepository) {
  const rawId = String(mapping?.taxonomyId || '')
  const id = rawId.includes('.') ? rawId.split('.').slice(1).join('.') : rawId
  return Boolean(repository.getById(id))
}

export function validateSemanticTaxonomyCandidates(candidates = [], repository = localTaxonomyRepository) {
  return (Array.isArray(candidates) ? candidates : []).filter((mapping) => validateTaxonomyMapping(mapping, repository)).map((mapping) => {
    const rawId = String(mapping.taxonomyId); const id = rawId.includes('.') ? rawId.split('.').slice(1).join('.') : rawId; const node = repository.getById(id)
    return { taxonomyId: node.canonicalId, label: node.label, taxonomyType: node.taxonomyType, confidence: Number.isFinite(mapping.confidence) ? mapping.confidence : null, source: 'semantic_model_validated' }
  })
}

export function resolveTaxonomyCandidates(concepts = [], repository = localTaxonomyRepository) {
  return (Array.isArray(concepts) ? concepts : []).flatMap((concept) => { const term = normalize(typeof concept === 'string' ? concept : concept?.label); if (!term) return []; return repository.search(term).slice(0, 5).map((node) => ({ concept: typeof concept === 'string' ? concept : concept?.label, taxonomyId: node.canonicalId, label: node.label, taxonomyType: node.taxonomyType, confidence: null, source: 'local_taxonomy_fallback' })) })
}
