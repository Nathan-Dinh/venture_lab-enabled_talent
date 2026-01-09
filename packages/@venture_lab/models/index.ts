/**
 * Shared Data Models for Enable Talent Platform
 * Used by both frontend and backend
 */

import { z } from 'zod';

// ============================================================================
// ENUMS
// ============================================================================

export const UserRole = {
  USER: 'User',
  MENTOR: 'Mentor',
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];

// ============================================================================
// API RESPONSES
// ============================================================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// ============================================================================
// VALIDATION SCHEMAS (Zod)
// ============================================================================

// Base signup fields
const BaseSignupSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain an uppercase letter')
    .regex(/[0-9]/, 'Password must contain a number'),
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
});

// User journey data schema
export const UserJourneyDataSchema = z.object({
  currentRole: z.string().optional(),
  experience: z.string().optional(),
  location: z.string().optional(),
  goals: z.string().optional(),
  interests: z.array(z.string()).default([]),
  skills: z.array(z.string()).default([]),
  learningStyle: z.string().optional(),
  timezone: z.string().optional(),
  budget: z.string().optional(),
  frequency: z.string().optional(),
});

// Mentor journey data schema
export const MentorJourneyDataSchema = z.object({
  headline: z.string().optional(),
  experience: z.string().optional(),
  bio: z.string().optional(),
  skills: z.array(z.string()).default([]),
  expertise: z.array(z.string()).default([]),
  hourlyRate: z.number().nullable().optional(),
  timezone: z.string().optional(),
  location: z.string().optional(),
});

// User signup schema
export const UserSignupSchema = BaseSignupSchema.extend({
  journeyData: UserJourneyDataSchema.optional(),
});

// Mentor signup schema
export const MentorSignupSchema = BaseSignupSchema.extend({
  journeyData: MentorJourneyDataSchema.optional(),
});

// ============================================================================
// INFERRED TYPES
// ============================================================================

export type UserJourneyData = z.infer<typeof UserJourneyDataSchema>;
export type MentorJourneyData = z.infer<typeof MentorJourneyDataSchema>;
export type UserSignupRequest = z.infer<typeof UserSignupSchema>;
export type MentorSignupRequest = z.infer<typeof MentorSignupSchema>;
