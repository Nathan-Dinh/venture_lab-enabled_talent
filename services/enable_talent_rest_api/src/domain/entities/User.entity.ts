import { UserRole } from '../types/models.js';

/**
 * User Entity
 * Represents a user in the system with business logic
 */
export class UserEntity {
  constructor(
    public readonly user_id: string,
    public name: string,
    public email: string,
    public usertype_id: string,
    public role: UserRole,
    public headline?: string,
    public bio?: string,
    public location?: string,
    public profile_image_url?: string,
    public created_at?: Date,
    public updated_at?: Date
  ) {}

  /**
   * Check if user is a mentor
   */
  isMentor(): boolean {
    return this.role === UserRole.MENTOR || this.usertype_id === '2';
  }

  /**
   * Check if user is a regular user
   */
  isUser(): boolean {
    return this.role === UserRole.USER || this.usertype_id === '1';
  }

  /**
   * Get user's display name
   */
  getDisplayName(): string {
    return this.name || 'Anonymous User';
  }

  /**
   * Check if profile is complete
   */
  isProfileComplete(): boolean {
    return !!(
      this.name &&
      this.email &&
      this.headline &&
      this.bio &&
      this.location
    );
  }

  /**
   * Update user profile fields
   */
  updateProfile(data: {
    name?: string;
    headline?: string;
    bio?: string;
    location?: string;
    profile_image_url?: string;
  }): void {
    if (data.name !== undefined) this.name = data.name;
    if (data.headline !== undefined) this.headline = data.headline;
    if (data.bio !== undefined) this.bio = data.bio;
    if (data.location !== undefined) this.location = data.location;
    if (data.profile_image_url !== undefined)
      this.profile_image_url = data.profile_image_url;
  }

  /**
   * Convert to plain object
   */
  toJSON() {
    return {
      user_id: this.user_id,
      name: this.name,
      email: this.email,
      usertype_id: this.usertype_id,
      role: this.role,
      headline: this.headline,
      bio: this.bio,
      location: this.location,
      profile_image_url: this.profile_image_url,
      created_at: this.created_at,
      updated_at: this.updated_at,
    };
  }
}
