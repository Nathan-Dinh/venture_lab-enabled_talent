import type { OAuthOptions } from '~/types/DTOs/auth';

export function useOAuth() {
  const { loginWithOAuth } = useSupabaseAuth();

  async function signInWithGoogle(redirectTo?: string) {
    const dto: OAuthOptions = {
      provider: 'google',
      redirectTo,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
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
    loginWithOAuth,
  };
}
