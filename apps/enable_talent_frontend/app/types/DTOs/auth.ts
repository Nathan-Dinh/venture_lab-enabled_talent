export type OAuthProvider =
  | 'google'
  | 'github'
  | 'gitlab'
  | 'bitbucket'
  | 'azure'
  | 'facebook'
  | 'twitter'
  | 'discord'
  | 'twitch';

export interface OAuthOptions {
  provider: OAuthProvider;
  redirectTo?: string;
  scopes?: string;
  queryParams?: Record<string, string>;
}

export interface SupabaseUser {
  id: string;
  email: string;
  user_metadata?: Record<string, any>;
  created_at?: string;
}

export interface SupabaseAuthResponse<T = SupabaseUser> {
  data: T | null;
  error: Error | null;
}

export interface ResetPasswordRequest {
  email: string;
}

export interface UpdatePasswordRequest {
  newPassword: string;
}
