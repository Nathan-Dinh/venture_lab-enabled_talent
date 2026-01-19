import type {
  LoginRequest,
  OAuthOptions,
  SupabaseAuthResponse,
  SupabaseUser,
  ResetPasswordRequest,
  UpdatePasswordRequest,
} from '~/types/DTOs/auth';

export function useSupabaseAuth() {
  const supabase = useSupabaseClient();

  async function login(dto: LoginRequest): Promise<SupabaseAuthResponse> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: dto.email,
        password: dto.password,
      });

      if (error) {
        return { data: null, error };
      }

      if (data.user) {
        const user: SupabaseUser = {
          id: data.user.id,
          email: data.user.email!,
          user_metadata: data.user.user_metadata,
          created_at: data.user.created_at,
        };

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

  async function loginWithOAuth(dto: OAuthOptions): Promise<SupabaseAuthResponse<{ url: string }>> {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: dto.provider,
        options: {
          redirectTo: dto.redirectTo || `${window.location.origin}/auth/callback`,
          scopes: dto.scopes,
          queryParams: dto.queryParams,
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

  async function logout(): Promise<SupabaseAuthResponse<{ success: boolean }>> {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        return { data: null, error };
      }

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

  async function resetPassword(
    dto: ResetPasswordRequest
  ): Promise<SupabaseAuthResponse<{ success: boolean }>> {
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

  async function updatePassword(
    dto: UpdatePasswordRequest
  ): Promise<SupabaseAuthResponse<{ success: boolean }>> {
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
    login,
    loginWithOAuth,
    logout,
    resetPassword,
    updatePassword,
  };
}
