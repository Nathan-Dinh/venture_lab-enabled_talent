export function useCoreAuth() {
  async function signup() {
    try {
      const { data, error } = await useApiRequestHandler('/auth/signup').core().post();

      if (error) {
        return { data: null, error };
      }

      if (data.user) {
        return { data: null, error: null };
      }

      return { data: null, error: new Error('Login failed: No user data returned') };
    } catch (err) {
      return {
        data: null,
        error: err instanceof Error ? err : new Error('An unexpected error occurred'),
      };
    }
  }

  return {
    signup,
  };
}
