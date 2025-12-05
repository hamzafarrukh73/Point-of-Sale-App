const toast = useToast();

export const useAuthStore = defineStore('authStore', {
    state: () => ({
        username: 'Test Name',
        role: 'Tester',
        permissions: {
            dashboard: true,
            products: true,
            inventory: true,
            checkout: true,
            history: true,
            admin: true
        }
    }),
    getters: {
    
    },
    actions: {
        async login(name: string, password: string, navigate: boolean, navigatePath="/dashboard" as string) {     
            try {
                const response = await $fetch('http://127.0.0.1:8000/api/auth/login/', {
                    method: 'POST',
                    body: {
                        username: name,
                        password: password
                    }
                });
        
                // This block runs only if the request is successful (status code 2xx)
                if (response) {
                    localStorage.setItem('authToken', response.token);
                }
                if (navigate) {
                    toast.add({
                        title: 'Logging in...',
                        color: 'info'
                    });
                    navigateTo({ path: navigatePath });
                }
            } 
            catch (error) {
                toast.add({
                    title: 'Login failed. Please check your credentials.',
                    color: 'error'
                });
            }
        }
    }
});