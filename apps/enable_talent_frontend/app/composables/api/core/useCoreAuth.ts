import type { UserSignupRequest, MentorSignupRequest } from '~/types/models';

export function useCoreAuth() {
  async function userSignup(payload: UserSignupRequest) {
    try {
      const { data, error } = await useApiRequestHandler('/auth/signup/user', {
        body: payload,
      })
        .core()
        .post();

      if (error) return { data: null, error };
      if (data?.success) return { data, error: null };

      return { data: null, error: new Error('Signup failed') };
    } catch (err) {
      return {
        data: null,
        error: err instanceof Error ? err : new Error('An unexpected error occurred'),
      };
    }
  }

  async function mentorSignup(payload: MentorSignupRequest) {
    try {
      const { data, error } = await useApiRequestHandler('/auth/signup/mentor', {
        body: payload,
      })
        .core()
        .post();

      if (error) return { data: null, error };
      if (data?.success) return { data, error: null };

      return { data: null, error: new Error('Signup failed') };
    } catch (err) {
      return {
        data: null,
        error: err instanceof Error ? err : new Error('An unexpected error occurred'),
      };
    }
  }

  return {
    userSignup,
    mentorSignup,
  };
}
