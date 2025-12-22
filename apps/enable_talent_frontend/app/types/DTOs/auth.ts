export interface SignupDto {
  email: string;
  password: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface OAuthProviderDto {
  provider:
    | 'google'
    | 'github'
    | 'gitlab'
    | 'bitbucket'
    | 'azure'
    | 'facebook'
    | 'twitter'
    | 'discord'
    | 'twitch';
  options?: {
    redirectTo?: string;
    scopes?: string;
    queryParams?: Record<string, string>;
  };
}

export interface UserDto {
  id: string;
  email: string;
  user_metadata?: Record<string, any>;
  created_at?: string;
}

export interface AuthResponseDto<T = UserDto> {
  data: T | null;
  error: Error | null;
}

export interface ResetPasswordDto {
  email: string;
}

export interface UpdatePasswordDto {
  newPassword: string;
}
