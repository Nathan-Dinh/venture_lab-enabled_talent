import type { OAuthProviderDto } from '~/types/DTOs/auth';

/**
 * OAuth helper composable
 *
 * Provides convenient methods for OAuth authentication with different providers.
 *
 * @example
 * const { signInWithGoogle, signInWithGithub } = useOAuth();
 * await signInWithGoogle();
 */
export function useOAuth() {
  const { loginWithOAuth } = useSupabaseAuth();

  /**
   * Sign in with Google OAuth
   *
   * @param redirectTo - Optional redirect URL after authentication
   * @returns Promise with redirect URL or error
   */
  async function signInWithGoogle(redirectTo?: string) {
    const dto: OAuthProviderDto = {
      provider: 'google',
      options: {
        redirectTo,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    };

    const { data, error } = await loginWithOAuth(dto);

    if (data?.url) {
      await navigateTo(data.url, { external: true });
    }

    return { data, error };
  }

  /**
   * Sign in with GitHub OAuth
   *
   * @param redirectTo - Optional redirect URL after authentication
   * @returns Promise with redirect URL or error
   */
  async function signInWithGithub(redirectTo?: string) {
    const dto: OAuthProviderDto = {
      provider: 'github',
      options: {
        redirectTo,
        scopes: 'user:email',
      },
    };

    const { data, error } = await loginWithOAuth(dto);

    if (data?.url) {
      await navigateTo(data.url, { external: true });
    }

    return { data, error };
  }

  /**
   * Sign in with GitLab OAuth
   *
   * @param redirectTo - Optional redirect URL after authentication
   * @returns Promise with redirect URL or error
   */
  async function signInWithGitlab(redirectTo?: string) {
    const dto: OAuthProviderDto = {
      provider: 'gitlab',
      options: {
        redirectTo,
        scopes: 'read_user',
      },
    };

    const { data, error } = await loginWithOAuth(dto);

    if (data?.url) {
      await navigateTo(data.url, { external: true });
    }

    return { data, error };
  }

  /**
   * Sign in with Discord OAuth
   *
   * @param redirectTo - Optional redirect URL after authentication
   * @returns Promise with redirect URL or error
   */
  async function signInWithDiscord(redirectTo?: string) {
    const dto: OAuthProviderDto = {
      provider: 'discord',
      options: {
        redirectTo,
        scopes: 'identify email',
      },
    };

    const { data, error } = await loginWithOAuth(dto);

    if (data?.url) {
      await navigateTo(data.url, { external: true });
    }

    return { data, error };
  }

  /**
   * Sign in with Azure OAuth
   *
   * @param redirectTo - Optional redirect URL after authentication
   * @returns Promise with redirect URL or error
   */
  async function signInWithAzure(redirectTo?: string) {
    const dto: OAuthProviderDto = {
      provider: 'azure',
      options: {
        redirectTo,
        scopes: 'email',
      },
    };

    const { data, error } = await loginWithOAuth(dto);

    if (data?.url) {
      await navigateTo(data.url, { external: true });
    }

    return { data, error };
  }

  return {
    signInWithGoogle,
    signInWithGithub,
    signInWithGitlab,
    signInWithDiscord,
    signInWithAzure,
    loginWithOAuth,
  };
}
