/**
 * Frontend-specific journey types
 */
import type { UserJourneyData, MentorJourneyData } from '~/types/models';

export type JourneyType = 'user' | 'mentor';
export type JourneyFormData = UserJourneyData | MentorJourneyData;
