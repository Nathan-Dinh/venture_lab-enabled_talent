export type JourneyType = 'user' | 'mentor';

export interface UserJourneyData {
  currentRole: string;
  experience: string;
  location: string;
  goals: string;
  interests: string[];
  skills: string[];
  learningStyle: string;
  timezone: string;
  budget: string;
  frequency: string;
}

export interface MentorJourneyData {
  headline: string;
  experience: string;
  bio: string;
  skills: string[];
  expertise: string[];
  hourlyRate: number | null;
  tiers: Array<{
    name: string;
    duration: number;
    rate: number;
  }>;
  timezone: string;
  availability: {
    [day: string]: {
      enabled: boolean;
      startTime: string;
      endTime: string;
    };
  };
}

export type JourneyFormData = UserJourneyData | MentorJourneyData;
