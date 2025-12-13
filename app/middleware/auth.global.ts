export default defineNuxtRouteMiddleware(() => {
  if (!localStorage.getItem('authToken')) {
    return navigateTo('/auth')
  }
})
