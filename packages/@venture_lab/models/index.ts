/**
 * Shared Data Models for Enable Talent Platform
 * Used by both frontend and backend
 */

// ============================================================================
// ENUMS
// ============================================================================

export enum UserRole {
  USER = 'User',
  MENTOR = 'Mentor',
}

export enum SessionStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum AvailabilityStatus {
  AVAILABLE = 'available',
  UNAVAILABLE = 'unavailable',
}

export enum PaymentMethod {
  CARD = 'card',
  BANK = 'bank',
  PAYPAL = 'paypal',
}

export enum ConversationRole {
  MEMBER = 'member',
  ADMIN = 'admin',
}

// ============================================================================
// AUTH & USER
// ============================================================================

export interface AuthRequest {
  email: string;
  password: string;
  name?: string;
  role?: UserRole;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface JwtPayload {
  user_id: string;
  email: string;
  role: UserRole;
}

export interface User {
  user_id: string;
  name: string;
  email: string;
  usertype_id: string;
  role: UserRole;
  headline?: string;
  bio?: string;
  location?: string;
  profile_image_url?: string;
  created_at: string;
  updated_at?: string;
}

export interface UserProfile extends User {
  experience: Experience[];
  education: Education[];
  skills: Skill[];
  certifications: Certification[];
}

// ============================================================================
// MENTOR
// ============================================================================

export interface Mentor extends User {
  rating?: number;
  session_count?: number;
  endorsement_count?: number;
  hourly_rate?: number;
  availability?: Availability[];
  pricing?: PricingTier[];
}

export interface MentorCard {
  user_id: string;
  name: string;
  headline?: string;
  location?: string;
  profile_image_url?: string;
  rating?: number;
  session_count?: number;
  hourly_rate?: number;
  skills?: string[];
}

// ============================================================================
// EXPERIENCE & EDUCATION
// ============================================================================

export interface Experience {
  experience_id?: string;
  user_id?: string;
  company: string;
  title: string;
  description?: string;
  start_date: string;
  end_date?: string;
  is_current: boolean;
}

export interface Education {
  education_id?: string;
  user_id?: string;
  institution: string;
  degree: string;
  field_of_study?: string;
  start_date: string;
  end_date?: string;
}

export interface Certification {
  certification_id?: string;
  user_id?: string;
  name: string;
  organization?: string;
  issue_date?: string;
  expiry_date?: string;
  credential_url?: string;
}

// ============================================================================
// SKILLS
// ============================================================================

export interface Skill {
  user_skill_id?: string;
  user_id?: string;
  skill_name: string;
  category?: string;
  level: number; // 1-10
  endorsement_count: number;
  endorsed_by?: string[]; // List of user IDs who endorsed
}

export interface SkillEndorsement {
  endorsement_id?: string;
  endorser_id: string;
  user_skill_id: string;
  endorsed_at?: string;
}

// ============================================================================
// AVAILABILITY & BOOKING
// ============================================================================

export interface Availability {
  availability_id?: string;
  user_id?: string;
  day_of_week: number; // 0-6 (Sun-Sat)
  start_time: string; // HH:mm format
  end_time: string; // HH:mm format
  timezone?: string;
  status: AvailabilityStatus;
}

export interface Booking {
  booking_id?: string;
  customer_id: string;
  mentor_id: string;
  booking_time: string; // ISO 8601
  status: SessionStatus;
  created_at?: string;
}

export interface Session {
  session_id?: string;
  booking_id?: string;
  start_time: string; // ISO 8601
  end_time: string; // ISO 8601
  session_status: SessionStatus;
  notes?: string;
  mentor_id: string;
  customer_id: string;
}

// ============================================================================
// PRICING
// ============================================================================

export interface PricingTier {
  pricing_id?: string;
  user_id?: string;
  tier_name: string; // 'Quick Chat', 'Standard', etc.
  duration_minutes: number;
  rate: number;
  description?: string;
}

export interface UserPricing {
  user_id: string;
  hourly_rate: number;
  currency: string;
  tiers: PricingTier[];
}

export interface PaymentInformation {
  payment_id?: string;
  user_id?: string;
  payment_method: PaymentMethod;
  card_last_four?: string;
  bank_account?: string;
  paypal_email?: string;
  is_default?: boolean;
}

// ============================================================================
// SOCIAL FEATURES
// ============================================================================

export interface Following {
  following_id?: string;
  follower_id: string;
  followed_id: string;
  followed_at?: string;
}

export interface Follow {
  user_id: string;
  name: string;
  headline?: string;
  profile_image_url?: string;
  role: UserRole;
}

// ============================================================================
// MESSAGING
// ============================================================================

export interface Conversation {
  conversation_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ConversationMember {
  member_id?: string;
  conversation_id?: string;
  user_id: string;
  role: ConversationRole;
  joined_at?: string;
}

export interface Message {
  message_id?: string;
  conversation_id: string;
  sender_id: string;
  message_text: string;
  sent_at?: string;
  is_read: boolean;
}

export interface ConversationWithMessages extends Conversation {
  members: ConversationMember[];
  messages: Message[];
}

// ============================================================================
// API RESPONSES
// ============================================================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

// ============================================================================
// VALIDATION SCHEMAS (Zod)
// ============================================================================

import { z } from 'zod';

export const SignupSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain an uppercase letter')
    .regex(/[0-9]/, 'Password must contain a number'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  role: z.enum([UserRole.USER, UserRole.MENTOR]).optional().default(UserRole.USER),
});

export const LoginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Password is required'),
  role: z.enum([UserRole.USER, UserRole.MENTOR]).optional(),
});

export const UpdateProfileSchema = z.object({
  name: z.string().min(2).optional(),
  headline: z.string().optional(),
  bio: z.string().optional(),
  location: z.string().optional(),
  profile_image_url: z.string().url().optional(),
});

export const AddSkillSchema = z.object({
  skill_name: z.string().min(1),
  category: z.string().optional(),
  level: z.number().min(1).max(10).default(5),
});

export const UpdateAvailabilitySchema = z.object({
  availability: z.array(
    z.object({
      day_of_week: z.number().min(0).max(6),
      start_time: z.string(),
      end_time: z.string(),
      timezone: z.string().optional(),
      status: z.enum([AvailabilityStatus.AVAILABLE, AvailabilityStatus.UNAVAILABLE]),
    })
  ),
});

export const UpdatePricingSchema = z.object({
  hourly_rate: z.number().positive().optional(),
  currency: z.string().optional().default('USD'),
  tiers: z
    .array(
      z.object({
        tier_name: z.string(),
        duration_minutes: z.number().positive(),
        rate: z.number().positive(),
        description: z.string().optional(),
      })
    )
    .optional(),
});

export const CreateSessionSchema = z.object({
  mentor_id: z.string(),
  booking_time: z.string().datetime(),
  tier_id: z.string().optional(),
});

export const SendMessageSchema = z.object({
  conversation_id: z.string(),
  message_text: z.string().min(1),
});

export type SignupRequest = z.infer<typeof SignupSchema>;
export type LoginRequest = z.infer<typeof LoginSchema>;
export type UpdateProfileRequest = z.infer<typeof UpdateProfileSchema>;
export type AddSkillRequest = z.infer<typeof AddSkillSchema>;
export type UpdateAvailabilityRequest = z.infer<typeof UpdateAvailabilitySchema>;
export type UpdatePricingRequest = z.infer<typeof UpdatePricingSchema>;
export type CreateSessionRequest = z.infer<typeof CreateSessionSchema>;
export type SendMessageRequest = z.infer<typeof SendMessageSchema>;
