/**
 * Authentication middleware
 * Protects routes that require authentication and redirects to login if needed
 */
export default defineNuxtRouteMiddleware((to) => {
  const token = useCookie('token').value;

  // If the user is not authenticated and trying to access a protected route, redirect to login
  if (to.meta.requiresAuth && !token) {
    return navigateTo('/login');
  }

  // If the user is authenticated and trying to access the login route, redirect to dashboard
  if (to.path === '/login' && token) {
    return navigateTo('/dashboard');
  }
});
