// src/storage/growthStorage.js

import {
  GROWTH_MODEL_VERSION
} from "../data/growthTaxonomy";

import {
  isValidEvidenceEvent
} from "../intelligence/evidenceEngine";

//
// Career & Growth — MVP v0.3
// Growth Intelligence Storage
//
// MVP implementation:
// Browser localStorage
//
// Future implementation:
// API → Lambda → Aurora PostgreSQL
//
// The rest of the application should use these functions rather
// than reading/writing evidenceEvents directly from localStorage.
//

const STORAGE_KEY =
  "careerAndGrowth.growthIntelligence";


//
// -----------------------------------------------------------------------------
// DEFAULT STATE
// -----------------------------------------------------------------------------

export function createEmptyGrowthState() {
  return {
    version: GROWTH_MODEL_VERSION,

    evidenceEvents: [],

    // SynapStride v0.10.1 — curated/recommended opportunities.
    growthOpportunities: [],

    // SynapStride v0.10.1 — child/family-selected activities.
    // Calendar is a derived view of scheduled activities.
    growthActivities: [],

    growthProfile: {
      traits: {},
      domains: {},
      pathways: {},
      careerFamilies: {}
    },

    metadata: {
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  };
}

//
// -----------------------------------------------------------------------------
// SAFE LOCAL STORAGE ACCESS
// -----------------------------------------------------------------------------

function localStorageAvailable() {
  try {
    return typeof window !== "undefined" &&
      window.localStorage;
  } catch {
    return false;
  }
}

//
// -----------------------------------------------------------------------------
// LOAD
// -----------------------------------------------------------------------------

export function loadGrowthState() {
  if (!localStorageAvailable()) {
    return createEmptyGrowthState();
  }

  try {
    const raw =
      window.localStorage.getItem(STORAGE_KEY);

    if (!raw) {
      return createEmptyGrowthState();
    }

    const parsed = JSON.parse(raw);

    return {
      ...createEmptyGrowthState(),
      ...parsed,

      evidenceEvents:
        Array.isArray(parsed.evidenceEvents)
          ? parsed.evidenceEvents.filter(
              isValidEvidenceEvent
            )
          : [],

      growthOpportunities:
        Array.isArray(parsed.growthOpportunities)
          ? parsed.growthOpportunities
          : [],

      growthActivities:
        Array.isArray(parsed.growthActivities)
          ? parsed.growthActivities
          : [],

      growthProfile: {
        traits:
          parsed.growthProfile?.traits || {},

        domains:
          parsed.growthProfile?.domains || {},

        pathways:
          parsed.growthProfile?.pathways || {},

        careerFamilies:
          parsed.growthProfile
            ?.careerFamilies || {}
      }
    };
  } catch (error) {
    console.error(
      "Unable to load Growth Intelligence data:",
      error
    );

    return createEmptyGrowthState();
  }
}

//
// -----------------------------------------------------------------------------
// SAVE
// -----------------------------------------------------------------------------

export function saveGrowthState(state) {
  if (!localStorageAvailable()) {
    return false;
  }

  try {
    const nextState = {
      ...state,

      version: GROWTH_MODEL_VERSION,

      metadata: {
        ...state.metadata,

        updatedAt:
          new Date().toISOString()
      }
    };

    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(nextState)
    );

    return true;
  } catch (error) {
    console.error(
      "Unable to save Growth Intelligence data:",
      error
    );

    return false;
  }
}

//
// -----------------------------------------------------------------------------
// EVIDENCE EVENTS
// -----------------------------------------------------------------------------

export function getEvidenceEvents({
  childId = null
} = {}) {
  const state = loadGrowthState();

  if (!childId) {
    return state.evidenceEvents;
  }

  return state.evidenceEvents.filter(
    (event) => event.childId === childId
  );
}

export function appendEvidenceEvent(event) {
  if (!isValidEvidenceEvent(event)) {
    console.warn(
      "Attempted to save invalid evidence event:",
      event
    );

    return false;
  }

  const state = loadGrowthState();

  //
  // Evidence events should be append-only.
  //
  // Prevent accidental duplicate insertion of the
  // exact same event ID.
  //

  const alreadyExists =
    state.evidenceEvents.some(
      (existingEvent) =>
        existingEvent.id === event.id
    );

  if (alreadyExists) {
    return false;
  }

  const nextState = {
    ...state,

    evidenceEvents: [
      ...state.evidenceEvents,
      event
    ]
  };

  return saveGrowthState(nextState);
}

export function appendEvidenceEvents(events = []) {
  if (!Array.isArray(events)) {
    return false;
  }

  const validEvents =
    events.filter(isValidEvidenceEvent);

  if (validEvents.length === 0) {
    return false;
  }

  const state = loadGrowthState();

  const existingIds = new Set(
    state.evidenceEvents.map(
      (event) => event.id
    )
  );

  const newEvents =
    validEvents.filter(
      (event) => !existingIds.has(event.id)
    );

  if (newEvents.length === 0) {
    return false;
  }

  const nextState = {
    ...state,

    evidenceEvents: [
      ...state.evidenceEvents,
      ...newEvents
    ]
  };

  return saveGrowthState(nextState);
}



//
// -----------------------------------------------------------------------------
// GROWTH OPPORTUNITIES + ACTIVITIES — SYNAPSTRIDE MVP v0.10.1
// -----------------------------------------------------------------------------
//
// Opportunities are curated/recommended possibilities.
// Activities are opportunities the child/family has saved, scheduled or pursued.
// Calendar views should be derived from activity.schedule rather than persisted
// as a second source of truth.
//

export function getGrowthOpportunities({
  childId = null
} = {}) {
  const state = loadGrowthState();

  if (!childId) {
    return state.growthOpportunities || [];
  }

  return (state.growthOpportunities || []).filter(
    (opportunity) =>
      !opportunity.childId ||
      opportunity.childId === childId
  );
}

export function saveGrowthOpportunity(opportunity) {
  if (!opportunity?.id) {
    return false;
  }

  const state = loadGrowthState();
  const existing = state.growthOpportunities || [];
  const exists = existing.some(
    (item) => item.id === opportunity.id
  );

  return saveGrowthState({
    ...state,
    growthOpportunities: exists
      ? existing.map((item) =>
          item.id === opportunity.id
            ? opportunity
            : item
        )
      : [...existing, opportunity]
  });
}

export function saveGrowthOpportunities(opportunities = []) {
  if (!Array.isArray(opportunities)) {
    return false;
  }

  const state = loadGrowthState();
  const byId = new Map(
    (state.growthOpportunities || []).map(
      (item) => [item.id, item]
    )
  );

  opportunities
    .filter((item) => item?.id)
    .forEach((item) => byId.set(item.id, item));

  return saveGrowthState({
    ...state,
    growthOpportunities: [...byId.values()]
  });
}

export function getGrowthActivities({
  childId = null
} = {}) {
  const state = loadGrowthState();
  const activities = state.growthActivities || [];

  if (!childId) {
    return activities;
  }

  return activities.filter(
    (activity) => activity.childId === childId
  );
}

export function saveGrowthActivity(activity) {
  if (!activity?.id) {
    return false;
  }

  const state = loadGrowthState();
  const existing = state.growthActivities || [];
  const exists = existing.some(
    (item) => item.id === activity.id
  );

  return saveGrowthState({
    ...state,
    growthActivities: exists
      ? existing.map((item) =>
          item.id === activity.id
            ? activity
            : item
        )
      : [...existing, activity]
  });
}

export function removeGrowthActivity(activityId) {
  if (!activityId) {
    return false;
  }

  const state = loadGrowthState();

  return saveGrowthState({
    ...state,
    growthActivities: (
      state.growthActivities || []
    ).filter(
      (activity) => activity.id !== activityId
    )
  });
}

//
// -----------------------------------------------------------------------------
// GROWTH PROFILE
// -----------------------------------------------------------------------------
//
// The profile is DERIVED DATA.
//
// Evidence events are the historical source of truth.
//
// Therefore it is safe to replace this object whenever the
// Growth Engine recalculates the child's profile.
//

export function getGrowthProfile() {
  const state = loadGrowthState();

  return state.growthProfile;
}

export function saveGrowthProfile(
  growthProfile
) {
  const state = loadGrowthState();

  const nextState = {
    ...state,

    growthProfile: {
      traits:
        growthProfile?.traits || {},

      domains:
        growthProfile?.domains || {},

      pathways:
        growthProfile?.pathways || {},

      careerFamilies:
        growthProfile?.careerFamilies || {}
    }
  };

  return saveGrowthState(nextState);
}

//
// -----------------------------------------------------------------------------
// RESET DERIVED PROFILE
// -----------------------------------------------------------------------------
//
// Useful during development.
//
// This removes calculated intelligence while retaining the
// child's historical evidence.
//

export function clearGrowthProfile() {
  const state = loadGrowthState();

  return saveGrowthState({
    ...state,

    growthProfile: {
      traits: {},
      domains: {},
      pathways: {},
      careerFamilies: {}
    }
  });
}

//
// -----------------------------------------------------------------------------
// DEVELOPMENT RESET
// -----------------------------------------------------------------------------
//
// WARNING:
//
// This removes BOTH:
//
// - evidence history
// - calculated Growth Intelligence
//
// This should eventually only be exposed through a hidden
// developer/debug control.
//

export function resetGrowthIntelligence() {
  if (!localStorageAvailable()) {
    return false;
  }

  try {
    window.localStorage.removeItem(
      STORAGE_KEY
    );

    return true;
  } catch (error) {
    console.error(
      "Unable to reset Growth Intelligence:",
      error
    );

    return false;
  }
}

//
// -----------------------------------------------------------------------------
// EXPORT / DEBUG
// -----------------------------------------------------------------------------
//
// Very useful during MVP testing.
//
// In the browser console:
//
// console.log(exportGrowthIntelligence());
//

export function exportGrowthIntelligence() {
  return loadGrowthState();
}