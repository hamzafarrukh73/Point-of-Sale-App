export const useAuthStore = defineStore('authStore', {
  state: () => ({
    token: localStorage.getItem('authToken') || '',
    url: 'http://localhost:8000',
    api: '/api/auth/login/',
    user: {
      username: localStorage.getItem('username') || 'Guest',
      role: 'Tester',
      permissions: {
        dashboard: true,
        products: true,
        inventory: true,
        checkout: true,
        history: true,
        admin: true
      }
    },
    toast: useToast()
  }),
  getters: {
    getUser: (state) => state.user,
    isAuthenticated: (state) => !!state.token
  },
  actions: {
    async login(
      name: string,
      password: string,
      navigate: boolean,
      navigatePath = '/dashboard' as string
    ) {
      try {
        const response = await $fetch(`${this.url}${this.api}`, {
          method: 'POST',
          body: {
            username: name,
            password: password
          }
        })

        // This block runs only if the request is successful (status code 2xx)
        if (response) {
          localStorage.setItem('authToken', response.token)
          localStorage.setItem('username', name)
          this.token = response.token
          this.user.username = name
          if (navigate) {
            this.toast.add({
              title: 'Logging in...',
              color: 'info',
              duration: 5000
            })
            navigateTo({ path: navigatePath })
          }
        }
      } catch (error) {
        this.toast.add({
          title: 'Login failed. Please check your credentials.',
          color: 'error'
        })
      }
    },

    logout() {
      localStorage.removeItem('authToken')
      localStorage.removeItem('username')
      this.token = ''
      this.user.username = 'Guest'
      navigateTo({ path: '/login' })
    }
  }
})
