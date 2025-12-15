/**
 * Composable for managing user-related data and operations
 *
 * Provides reusable functions for fetching and managing user profile data
 * across different pages and components.
 */

import { ref } from 'vue';

export interface User {
  name: string;
  email?: string;
  avatar: string;
  headline?: string;
  location?: string;
  bio?: string;
}

/**
 * Fetch current authenticated user information
 *
 * @returns Object containing user data, loading state, and error
 */
export const useFetchCurrentUser = () => {
  const { $apiRequestHandler } = useNuxtApp();
  const user = ref<User>({
    name: 'User',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=default',
  });
  const isLoading = ref(false);
  const error = ref('');

  const fetchUser = async () => {
    isLoading.value = true;
    error.value = '';

    try {
      const res = await $apiRequestHandler('/api/auth/me').base().get();

      if (res.data?.data?.data) {
        user.value = {
          name: res.data.data.data.name,
          email: res.data.data.data.email,
          avatar: res.data.data.data.profile_image_url || user.value.avatar,
        };
      }
    } catch (err) {
      error.value = 'Error loading user';
      console.error('Error fetching current user:', err);
    } finally {
      isLoading.value = false;
    }
  };

  return {
    user,
    isLoading,
    error,
    fetchUser,
  };
};

/**
 * Fetch user profile data
 *
 * @returns Object containing profile data, loading state, and error
 */
export const useFetchUserProfile = () => {
  const { $apiRequestHandler } = useNuxtApp();
  const profile = ref<any>(null);
  const isLoading = ref(false);
  const error = ref('');

  const fetchProfile = async () => {
    isLoading.value = true;
    error.value = '';

    try {
      const res = await $apiRequestHandler('/api/profile').base().get();

      if (res.error) {
        error.value = 'Failed to load profile';
        return;
      }

      if (res.data?.success && res.data?.data) {
        profile.value = res.data.data;
      }
    } catch (err) {
      error.value = 'Error loading profile';
      console.error('Error fetching user profile:', err);
    } finally {
      isLoading.value = false;
    }
  };

  return {
    profile,
    isLoading,
    error,
    fetchProfile,
  };
};

/**
 * Fetch followed mentors
 *
 * @returns Object containing followed mentors, loading state, and error
 */
export const useFetchFollowedMentors = () => {
  const { $apiRequestHandler } = useNuxtApp();
  const mentors = ref<any[]>([]);
  const isLoading = ref(false);
  const error = ref('');

  const fetchFollowedMentors = async () => {
    isLoading.value = true;
    error.value = '';

    try {
      const res = await $apiRequestHandler('/api/follows').base().get();

      if (res.error) {
        error.value = 'Failed to load followed mentors';
        return;
      }

      if (res.data?.success && res.data?.data) {
        mentors.value = res.data.data.map((mentor: any) => ({
          id: mentor.user_id,
          name: mentor.name,
          role: mentor.headline || 'Mentor',
          location: mentor.location || 'Unknown',
          avatar: mentor.profile_image_url || 'https://randomuser.me/api/portraits/men/1.jpg',
          rating: mentor.rating || 0,
          reviews: mentor.review_count || 0,
          sessions: mentor.session_count || 0,
          tags: mentor.skills || [],
          hourly_rate: mentor.hourly_rate,
        }));
      }
    } catch (err) {
      error.value = 'Error loading followed mentors';
      console.error('Error fetching followed mentors:', err);
    } finally {
      isLoading.value = false;
    }
  };

  return {
    mentors,
    isLoading,
    error,
    fetchFollowedMentors,
  };
};
