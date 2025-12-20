import type {
  SignupDto,
  LoginDto,
  OAuthProviderDto,
  AuthResponseDto,
  UserDto,
  ResetPasswordDto,
  UpdatePasswordDto,
} from '~/types/DTOs/auth';

/**
 * Supabase authentication composable
 *
 * Provides methods for user authentication including signup, login, OAuth, and logout.
 *
 * @example
 * const { signup, login, loginWithOAuth, logout, getCurrentUser } = useSupabaseAuth();
 * await signup({ email: 'user@example.com', password: 'password123' });
 */
export function useSupabaseAuth() {
  const supabase = useSupabaseClient();

  /**
   * Sign up a new user with email and password
   *
   * @param dto - User email, password, and optional metadata
   * @returns Promise with user data or error
   */
  async function signup(dto: SignupDto): Promise<AuthResponseDto> {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: dto.email,
        password: dto.password,
        options: dto.options,
      });

      if (error) {
        return { data: null, error };
      }

      if (data.user) {
        const user: UserDto = {
          id: data.user.id,
          email: data.user.email!,
          user_metadata: data.user.user_metadata,
          created_at: data.user.created_at,
        };

        return { data: user, error: null };
      }

      return { data: null, error: new Error('Signup failed: No user data returned') };
    } catch (err) {
      return {
        data: null,
        error: err instanceof Error ? err : new Error('An unexpected error occurred'),
      };
    }
  }

  /**
   * Sign in an existing user with email and password
   *
   * @param dto - User email and password
   * @returns Promise with user data or error
   */
  async function login(dto: LoginDto): Promise<AuthResponseDto> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: dto.email,
        password: dto.password,
      });

      if (error) {
        return { data: null, error };
      }

      if (data.user) {
        const user: UserDto = {
          id: data.user.id,
          email: data.user.email!,
          user_metadata: data.user.user_metadata,
          created_at: data.user.created_at,
        };

        // Store the session token
        if (data.session?.access_token) {
          const token = useCookie('token', {
            maxAge: 60 * 60 * 24 * 7, // 7 days
            sameSite: 'lax',
            secure: process.env.NODE_ENV === 'production',
          });
          token.value = data.session.access_token;
        }

        return { data: user, error: null };
      }

      return { data: null, error: new Error('Login failed: No user data returned') };
    } catch (err) {
      return {
        data: null,
        error: err instanceof Error ? err : new Error('An unexpected error occurred'),
      };
    }
  }

  /**
   * Sign in with OAuth provider (Google, GitHub, etc.)
   *
   * @param dto - OAuth provider and options
   * @returns Promise with redirect URL or error
   */
  async function loginWithOAuth(dto: OAuthProviderDto): Promise<AuthResponseDto<{ url: string }>> {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: dto.provider,
        options: {
          redirectTo: dto.options?.redirectTo || `${window.location.origin}/auth/callback`,
          scopes: dto.options?.scopes,
          queryParams: dto.options?.queryParams,
        },
      });

      if (error) {
        return { data: null, error };
      }

      if (data.url) {
        return { data: { url: data.url }, error: null };
      }

      return { data: null, error: new Error('OAuth failed: No redirect URL returned') };
    } catch (err) {
      return {
        data: null,
        error: err instanceof Error ? err : new Error('An unexpected error occurred'),
      };
    }
  }

  /**
   * Sign out the current user
   *
   * @returns Promise with success status or error
   */
  async function logout(): Promise<AuthResponseDto<{ success: boolean }>> {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        return { data: null, error };
      }

      // Clear the token cookie
      const token = useCookie('token');
      token.value = null;

      return { data: { success: true }, error: null };
    } catch (err) {
      return {
        data: null,
        error: err instanceof Error ? err : new Error('An unexpected error occurred'),
      };
    }
  }

  /**
   * Get the current authenticated user
   *
   * @returns Promise with current user data or error
   */
  async function getCurrentUser(): Promise<AuthResponseDto> {
    try {
      const { data, error } = await supabase.auth.getUser();

      if (error) {
        return { data: null, error };
      }

      if (data.user) {
        const user: UserDto = {
          id: data.user.id,
          email: data.user.email!,
          user_metadata: data.user.user_metadata,
          created_at: data.user.created_at,
        };

        return { data: user, error: null };
      }

      return { data: null, error: new Error('No user found') };
    } catch (err) {
      return {
        data: null,
        error: err instanceof Error ? err : new Error('An unexpected error occurred'),
      };
    }
  }

  /**
   * Send password reset email
   *
   * @param dto - User's email address
   * @returns Promise with success status or error
   */
  async function resetPassword(
    dto: ResetPasswordDto
  ): Promise<AuthResponseDto<{ success: boolean }>> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(dto.email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (error) {
        return { data: null, error };
      }

      return { data: { success: true }, error: null };
    } catch (err) {
      return {
        data: null,
        error: err instanceof Error ? err : new Error('An unexpected error occurred'),
      };
    }
  }

  /**
   * Update user password
   *
   * @param dto - New password
   * @returns Promise with success status or error
   */
  async function updatePassword(
    dto: UpdatePasswordDto
  ): Promise<AuthResponseDto<{ success: boolean }>> {
    try {
      const { error } = await supabase.auth.updateUser({
        password: dto.newPassword,
      });

      if (error) {
        return { data: null, error };
      }

      return { data: { success: true }, error: null };
    } catch (err) {
      return {
        data: null,
        error: err instanceof Error ? err : new Error('An unexpected error occurred'),
      };
    }
  }

  return {
    signup,
    login,
    loginWithOAuth,
    logout,
    getCurrentUser,
    resetPassword,
    updatePassword,
  };
}
