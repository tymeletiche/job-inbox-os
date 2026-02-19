import {
  ClassifierInput,
  ClassifierOutput,
  EventType,
} from './classifier/types';
import {
  stripForwardedHeaders,
  isLikelyNewsletter,
  scoreAllEventTypes,
  resolveAmbiguity,
  rawScoreToConfidence,
} from './classifier/scoring';
import { extractData } from './classifier/extraction';

export type { ClassifierInput, ClassifierOutput, EventType };

export function classifyEmail(input: ClassifierInput): ClassifierOutput {
  // Pre-process: strip forwarded email headers
  const subject = stripForwardedHeaders(input.subject);
  const body = stripForwardedHeaders(input.body);
  const sender = input.sender;

  // Extract structured data regardless of classification
  const extractedData = extractData(subject, body, sender);

  // Newsletter check — short-circuit to OTHER
  if (isLikelyNewsletter(subject, body)) {
    return {
      eventType: 'OTHER',
      confidence: 0.1,
      extractedData,
      rawMatches: ['[newsletter-detected]'],
      allScores: {} as Record<EventType, number>,
    };
  }

  // Score all event types
  const allScoringResults = scoreAllEventTypes(subject, body, sender);

  // Pick the winner
  const bestType = resolveAmbiguity(allScoringResults);
  const bestResult = allScoringResults[bestType];

  // Convert raw score to confidence
  const confidence = bestResult ? rawScoreToConfidence(bestResult.rawScore) : 0;

  // Build allScores map (raw score → confidence)
  const allScores: Record<string, number> = {};
  for (const [type, result] of Object.entries(allScoringResults)) {
    allScores[type] = rawScoreToConfidence(result.rawScore);
  }

  // If confidence too low, default to OTHER
  if (confidence < 0.25) {
    return {
      eventType: 'OTHER',
      confidence,
      extractedData,
      rawMatches: bestResult?.matches || [],
      allScores: allScores as Record<EventType, number>,
    };
  }

  return {
    eventType: bestType,
    confidence,
    extractedData,
    rawMatches: bestResult?.matches || [],
    allScores: allScores as Record<EventType, number>,
  };
}
