/**
 * Composable for managing mentor-related data and operations
 *
 * Provides reusable functions for fetching and managing mentor data
 * across different pages and components.
 */

import { ref } from 'vue';

export interface Mentor {
  id: number;
  name: string;
  role: string;
  location: string;
  avatar: string;
  rating: number;
  reviews: number;
  sessions: number;
  tags: string[];
  hourly_rate?: number;
}

/**
 * Fetch list of mentors from the backend
 *
 * @param limit - Number of mentors to fetch (default: 20)
 * @param page - Page number for pagination (default: 1)
 * @returns Object containing mentors data, loading state, and error
 */
export const useFetchMentors = () => {
  const { $apiRequestHandler } = useNuxtApp();
  const mentors = ref<Mentor[]>([]);
  const isLoading = ref(false);
  const error = ref('');

  const fetchMentors = async (limit: number = 20, page: number = 1) => {
    isLoading.value = true;
    error.value = '';

    try {
      const res = await $apiRequestHandler(`/api/mentors?limit=${limit}&page=${page}`)
        .base()
        .get();

      if (res.error) {
        error.value = 'Failed to load mentors';
        return;
      }

      if (res.data?.success && res.data?.data?.data) {
        mentors.value = res.data.data.data.map((mentor: any) => ({
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
      error.value = 'Error loading mentors';
      console.error('Error fetching mentors:', err);
    } finally {
      isLoading.value = false;
    }
  };

  return {
    mentors,
    isLoading,
    error,
    fetchMentors,
  };
};

/**
 * Fetch single mentor details by ID
 *
 * @param mentorId - The ID of the mentor to fetch
 * @returns Object containing mentor data, loading state, and error
 */
export const useFetchMentorById = (mentorId: string | number) => {
  const { $apiRequestHandler } = useNuxtApp();
  const mentor = ref<any>(null);
  const isLoading = ref(false);
  const error = ref('');

  const fetchMentor = async () => {
    isLoading.value = true;
    error.value = '';

    try {
      const res = await $apiRequestHandler(`/api/mentors/${mentorId}`).base().get();

      if (res.error) {
        error.value = 'Failed to load mentor details';
        return;
      }

      if (res.data?.success && res.data?.data) {
        mentor.value = res.data.data;
      }
    } catch (err) {
      error.value = 'Error loading mentor details';
      console.error('Error fetching mentor:', err);
    } finally {
      isLoading.value = false;
    }
  };

  return {
    mentor,
    isLoading,
    error,
    fetchMentor,
  };
};
