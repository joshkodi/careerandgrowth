// src/features/journey/useJourney.js

import {
  useMemo,
  useState,
} from 'react'

import {
  evidenceSourceTypes,
} from '../../data/growthTaxonomy'

import {
  createEvidenceEvent,
} from '../../intelligence/evidenceEngine'

import {
  getEnjoymentEvidence,
  getCompletionEvidence,
} from '../../intelligence/legacyEvidenceAdapter'

import {
  createJourneyItem,
  journeyOrigins,
  updateJourneyProgress,
  completeJourneyWithReflection,
  journeyStatuses,
} from '../../intelligence/journeyModels'

import {
  journeyPaths,
  createUnifiedJourneyItem,
  normalizeJourneyItems,
  getJourneyItemsByPath,
  getJourneySummary,
  updateUnifiedJourneyStatus,
  attachLearningSupportRequest,
} from '../../intelligence/unifiedJourneyModels'

import {
  createLearningSupportRequest,
} from '../../intelligence/learningIntentEngine'

import {
  buildLearningResearchBrief,
} from '../../intelligence/learningResearchStrategyGenerator'

import {
  buildResourceDiscoveryRequest,
} from '../../intelligence/resourceDiscoveryEngine'

import {
  runLearningResourcePipeline,
} from '../../intelligence/learningResourcePipeline'

import {
  createLearningResourceFeedback,
  createLearningSupportOutcome,
} from '../../intelligence/learningResourceFeedback'

import {
  buildLearningHistoryEvent,
  interpretLearningSupportOutcome,
} from '../../intelligence/learningOutcomeInterpreter'

import {
  findJourneyByExperience,
  getJourneyItems,
  saveJourneyItem,
} from '../../storage/journeyStorage'

import {
  createSessionId,
  getChildEvidenceId,
} from '../../utils/session'

import {
  getGrowExperience,
} from '../../data/growExperiences'


// ============================================================
// Career & Growth — MVP v0.8
// Unified Journey Controller
//
// Phase 8.1:
// - Preserves the existing v0.7 Experience Journey behavior.
// - Adds a normalized Unified Journey read model.
// - Exposes the three Journey paths without migrating storage.
// - Does NOT yet add School & Learning creation workflows.
//
// Existing v0.7 Journey items remain stored exactly as before.
// ============================================================

export default function useJourney({
  childProfile,
  setScreen,
  persistGrowthEvidence,
  onStudentIntent,
}) {
  const [
    journeyItems,
    setJourneyItems,
  ] = useState([])

  const [
    completedJourneyInsight,
    setCompletedJourneyInsight,
  ] = useState(null)


  // ==========================================================
  // UNIFIED JOURNEY READ MODEL — MVP v0.8
  // ==========================================================
  //
  // journeyItems remains the raw persisted representation so
  // existing v0.7 behavior stays stable.
  //
  // unifiedJourneyItems is the normalized v0.8 representation
  // used by new Journey UI/features.
  // ==========================================================

  const unifiedJourneyItems =
    useMemo(
      () =>
        normalizeJourneyItems(
          journeyItems
        ),
      [journeyItems]
    )


  const schoolLearningJourneyItems =
    useMemo(
      () =>
        getJourneyItemsByPath(
          journeyItems,
          journeyPaths
            .SCHOOL_LEARNING
        ),
      [journeyItems]
    )


  const experienceJourneyItems =
    useMemo(
      () =>
        getJourneyItemsByPath(
          journeyItems,
          journeyPaths.EXPERIENCES
        ),
      [journeyItems]
    )


  const activitiesInterestJourneyItems =
    useMemo(
      () =>
        getJourneyItemsByPath(
          journeyItems,
          journeyPaths
            .ACTIVITIES_INTERESTS
        ),
      [journeyItems]
    )


  const journeySummary =
    useMemo(
      () =>
        getJourneySummary(
          journeyItems
        ),
      [journeyItems]
    )


  // ==========================================================
  // RESTORE JOURNEY
  // ==========================================================

  const restoreJourney =
    () => {
      if (
        !childProfile.name.trim()
      ) {
        setJourneyItems([])
        return
      }

      const childId =
        getChildEvidenceId(
          childProfile
        )

      // Keep the raw stored representation in state.
      // Unified Journey normalization is derived above.
      setJourneyItems(
        getJourneyItems({
          childId,
        })
      )
    }


  // ==========================================================
  // START GROW EXPERIENCE
  // ==========================================================
  //
  // Intentionally unchanged from v0.7.
  // Existing Grow recommendations continue creating the same
  // Journey item contract and therefore the same evidence flow.
  // ==========================================================

  const handleStartGrow =
    (recommendation) => {
      if (
        !recommendation
          ?.experienceId
      ) {
        return null
      }

      const childId =
        getChildEvidenceId(
          childProfile
        )

      const existingJourney =
        findJourneyByExperience({
          childId,

          experienceId:
            recommendation
              .experienceId,
        })

      if (existingJourney) {
        setScreen('journey')

        return existingJourney
      }

      const experience =
        getGrowExperience(
          recommendation
            .experienceId
        )

      const journeyItem =
        createJourneyItem({
          childId,

          experienceId:
            recommendation
              .experienceId,

          title:
            experience?.title ||
            recommendation.title,

          emoji:
            experience?.emoji ||
            recommendation.emoji ||
            '🌱',

          description:
            experience?.description ||
            '',

          origin:
            journeyOrigins
              .RECOMMENDATION,

          recommendation,
        })

      saveJourneyItem(
        journeyItem
      )

      setJourneyItems(
        (current) => [
          ...current,
          journeyItem,
        ]
      )

      console.group(
        '🛤️ Journey v1'
      )

      console.log(
        'Started Grow:',
        journeyItem
      )

      console.groupEnd()

      setScreen('journey')

      return journeyItem
    }


  const goToJourney = () => {
    setScreen('journey')
  }


  // ==========================================================
  // JOURNEY PROGRESS
  // ==========================================================

  const handleJourneyProgress =
    (
      journeyId,
      percent
    ) => {
      const currentItem =
        journeyItems.find(
          (item) =>
            item.id ===
            journeyId
        )

      if (!currentItem) {
        return null
      }

      const updatedItem =
        updateJourneyProgress(
          currentItem,
          percent
        )

      saveJourneyItem(
        updatedItem
      )

      setJourneyItems(
        (current) =>
          current.map(
            (item) =>
              item.id ===
              updatedItem.id
                ? updatedItem
                : item
          )
      )

      return updatedItem
    }


  // ==========================================================
  // COMPLETE EXPERIENCE JOURNEY
  // ==========================================================
  //
  // This remains experience-specific in Phase 8.1 because the
  // current completion/reflection adapter produces Experience
  // evidence. School & Learning evidence gets its own explicit
  // contract in a later v0.8 phase rather than reusing this
  // behavior accidentally.
  // ==========================================================

  const handleCompleteJourney =
    (
      journeyId,
      reflection
    ) => {
      const currentItem =
        journeyItems.find(
          (item) =>
            item.id ===
            journeyId
        )

      if (!currentItem) {
        return null
      }

      const completedItem =
        completeJourneyWithReflection(
          currentItem,
          reflection
        )

      saveJourneyItem(
        completedItem
      )

      setJourneyItems(
        (current) =>
          current.map(
            (item) =>
              item.id ===
              completedItem.id
                ? completedItem
                : item
          )
      )

      const childId =
        getChildEvidenceId(
          childProfile
        )

      const experience =
        getGrowExperience(
          completedItem
            .experienceId
        )

      const domainId =
        experience?.domainId ||
        experience?.domain ||
        null

      const sessionId =
        createSessionId()

      const enjoymentMap = {
        not_for_me: 0,
        okay: 1,
        liked_it: 2,
        loved_it: 3,
      }

      const enjoymentValue =
        enjoymentMap[
          reflection?.enjoyment
        ]

      const evidenceEvents = []

      if (
        enjoymentValue !==
        undefined
      ) {
        evidenceEvents.push(
          createEvidenceEvent({
            childId,

            source: {
              type:
                evidenceSourceTypes
                  .REFLECTION,

              experienceId:
                completedItem
                  .experienceId,

              questionId:
                'journey_enjoyment',

              responseId:
                reflection
                  .enjoyment,
            },

            evidence:
              getEnjoymentEvidence(
                enjoymentValue
              ),

            context: {
              domainId,
              sessionId,
            },

            metadata: {
              questionText:
                'How much did you enjoy it?',

              responseText:
                reflection
                  .enjoyment,

              enjoymentValue,

              journeyId:
                completedItem.id,

              favoritePart:
                reflection
                  ?.favoritePart ||
                '',

              difficultPart:
                reflection
                  ?.difficultPart ||
                '',

              wouldDoAgain:
                reflection
                  ?.wouldDoAgain ??
                null,

              wantsNext:
                reflection
                  ?.wantsNext ||
                '',
            },
          })
        )
      }

      evidenceEvents.push(
        createEvidenceEvent({
          childId,

          source: {
            type:
              evidenceSourceTypes
                .COMPLETION,

            experienceId:
              completedItem
                .experienceId,

            questionId:
              null,

            responseId:
              'completed',
          },

          evidence:
            getCompletionEvidence(),

          context: {
            domainId,
            sessionId,
          },

          metadata: {
            experienceTitle:
              completedItem.title,

            journeyId:
              completedItem.id,

            origin:
              completedItem.origin,
          },
        })
      )

      const updatedProfile =
        persistGrowthEvidence(
          evidenceEvents
        )

      setCompletedJourneyInsight({
        journeyItem:
          completedItem,

        reflection,

        updatedProfile,

        completedAt:
          completedItem
            .completedAt,
      })

      if (
        reflection
          ?.wantsNext
          ?.trim()
      ) {
        onStudentIntent?.(
          reflection.wantsNext
        )
      }

      console.group(
        '↻ Growth Loop v0.4'
      )

      console.log(
        'Journey completed:',
        completedItem
      )

      console.log(
        'Growth evidence added:',
        evidenceEvents
      )

      console.log(
        'Next recommendations will recalculate from the updated profile and intent.'
      )

      console.groupEnd()

      return completedItem
    }



  // ==========================================================
  // SCHOOL & LEARNING — MVP v0.8 PHASE 8.3
  // ==========================================================

  const handleAddLearningItem =
    (learningItem = {}) => {
      const childId =
        getChildEvidenceId(
          childProfile
        )

      const journeyItem =
        createUnifiedJourneyItem({
          childId,

          title:
            learningItem.title,

          path:
            journeyPaths
              .SCHOOL_LEARNING,

          activityType:
            learningItem
              .activityType,

          source:
            learningItem.source,

          description:
            learningItem
              .description ||
            '',

          emoji:
            learningItem.emoji ||
            '🏫',

          subject:
            learningItem.subject ||
            null,

          topic:
            learningItem.topic ||
            null,

          dueDate:
            learningItem.dueDate ||
            null,

          estimatedTime:
            learningItem
              .estimatedTime ||
            null,

          metadata: {
            createdFrom:
              'school_learning',
          },
        })

      saveJourneyItem(
        journeyItem
      )

      setJourneyItems(
        (current) => [
          ...current,
          journeyItem,
        ]
      )

      return journeyItem
    }


  const handleLearningItemStatus =
    (
      journeyId,
      status
    ) => {
      const currentItem =
        journeyItems.find(
          (item) =>
            item.id ===
            journeyId
        )

      if (!currentItem) {
        return null
      }

      const updatedItem =
        updateUnifiedJourneyStatus(
          currentItem,
          status
        )

      saveJourneyItem(
        updatedItem
      )

      setJourneyItems(
        (current) =>
          current.map(
            (item) =>
              item.id ===
              updatedItem.id
                ? updatedItem
                : item
          )
      )

      return updatedItem
    }


  const handleLearningHelpRequest = (journeyId, helpRequest = {}) => {
    const currentItem = journeyItems.find((item) => item.id === journeyId)
    if (!currentItem) return null

    const supportRequest = createLearningSupportRequest({
      journeyItem: currentItem,
      modeId: helpRequest.modeId,
      studentNote: helpRequest.studentNote || '',
    })

    const researchBrief = buildLearningResearchBrief({
      journeyItem: currentItem,
      supportRequest,
      childProfile,
    })

    const discoveryRequest = buildResourceDiscoveryRequest(
      researchBrief,
      {
        maxResults: 8,
      }
    )

    const resourcePipeline =
      runLearningResourcePipeline(
        discoveryRequest
      )

    const enrichedSupportRequest = {
      ...supportRequest,

      researchBrief,

      discoveryRequest,

      resourcePipeline,

      status:
        resourcePipeline
          ?.status ===
          'evaluated'
          ? 'resources_evaluated'
          : discoveryRequest
            ? 'research_ready'
            : supportRequest.status,
    }

    const updatedItem = attachLearningSupportRequest(
      currentItem,
      enrichedSupportRequest
    )

    saveJourneyItem(updatedItem)

    setJourneyItems((current) =>
      current.map((item) =>
        item.id === updatedItem.id
          ? updatedItem
          : item
      )
    )

    return enrichedSupportRequest
  }


  const handleLearningResourceFeedback =
    (
      journeyId,
      candidateId,
      feedbackType
    ) => {
      const currentItem =
        journeyItems.find(
          (item) =>
            item.id === journeyId
        )

      if (!currentItem) {
        return null
      }

      const feedback =
        createLearningResourceFeedback({
          candidateId,
          feedbackType,
        })

      if (!feedback) {
        return null
      }

      const currentRequest =
        currentItem
          .learningSupportRequest ||
        {}

      const existingFeedback =
        currentRequest
          .resourceFeedback ||
        {}

      const historyEvent =
        buildLearningHistoryEvent({
          journeyItem:
            currentItem,

          eventType:
            'resource_feedback',

          payload: {
            candidateId,
            feedbackType,
          },
        })

      const updatedItem = {
        ...currentItem,

        learningSupportRequest: {
          ...currentRequest,

          resourceFeedback: {
            ...existingFeedback,

            [candidateId]:
              feedback,
          },
        },

        learningHistory: [
          ...(
            currentItem
              .learningHistory ||
            []
          ),
          historyEvent,
        ].filter(Boolean),

        updatedAt:
          new Date().toISOString(),
      }

      saveJourneyItem(
        updatedItem
      )

      setJourneyItems(
        (current) =>
          current.map(
            (item) =>
              item.id ===
              updatedItem.id
                ? updatedItem
                : item
          )
      )

      return feedback
    }


  const handleLearningSupportOutcome =
    (
      journeyId,
      outcomeType
    ) => {
      const currentItem =
        journeyItems.find(
          (item) =>
            item.id === journeyId
        )

      if (!currentItem) {
        return null
      }

      const outcome =
        createLearningSupportOutcome({
          outcomeType,
        })

      if (!outcome) {
        return null
      }

      const currentRequest =
        currentItem
          .learningSupportRequest ||
        {}

      const interpretation =
        interpretLearningSupportOutcome({
          journeyItem:
            currentItem,

          outcomeType,
        })

      const updatedItem = {
        ...currentItem,

        learningSupportRequest: {
          ...currentRequest,

          outcome,

          status:
            outcomeType ===
            'resolved'
              ? 'resolved'
              : outcomeType ===
                  'more_help'
                ? 'needs_more_help'
                : 'resources_reviewed',
        },

        status:
          outcomeType ===
          'resolved'
            ? journeyStatuses
                .IN_PROGRESS
            : currentItem.status,

        learningHistory: [
          ...(
            currentItem
              .learningHistory ||
            []
          ),
          interpretation
            ?.history,
        ].filter(Boolean),

        learningIntelligence: {
          lastInterpretation:
            interpretation,

          signals: [
            ...(
              currentItem
                .learningIntelligence
                ?.signals ||
              []
            ),
            ...(
              interpretation
                ?.signals ||
              []
            ),
          ],
        },

        updatedAt:
          new Date().toISOString(),
      }

      saveJourneyItem(
        updatedItem
      )

      setJourneyItems(
        (current) =>
          current.map(
            (item) =>
              item.id ===
              updatedItem.id
                ? updatedItem
                : item
          )
      )

      return outcome
    }


  const dismissCompletedJourneyInsight =
    () => {
      setCompletedJourneyInsight(
        null
      )
    }


  const resetJourney =
    () => {
      setJourneyItems([])
      setCompletedJourneyInsight(null)
    }


  return {
    // Raw v0.7-compatible Journey state.
    journeyItems,

    // MVP v0.8 Unified Journey read model.
    unifiedJourneyItems,
    schoolLearningJourneyItems,
    experienceJourneyItems,
    activitiesInterestJourneyItems,
    journeySummary,

    completedJourneyInsight,

    restoreJourney,

    handleStartGrow,

    goToJourney,

    handleJourneyProgress,

    handleCompleteJourney,

    handleAddLearningItem,
    handleLearningItemStatus,
    handleLearningHelpRequest,
    handleLearningResourceFeedback,
    handleLearningSupportOutcome,

    dismissCompletedJourneyInsight,

    resetJourney,
  }
}
