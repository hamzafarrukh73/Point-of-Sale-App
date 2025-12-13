<script setup lang="ts">
import type { FormSubmitEvent, AuthFormField } from '@nuxt/ui'
import * as z from 'zod'

definePageMeta({
  layout: 'nosidebar'
})

const fields = ref<AuthFormField[]>([
  {
    name: 'username',
    type: 'text',
    label: 'Username',
    placeholder: 'Enter Name',
    required: true
  },
  {
    name: 'password',
    type: 'password',
    label: 'Password',
    placeholder: 'Enter Password',
    required: true
  }
])

const schema = z.object({
  username: z.string('Invalid username'),
  password: z.string('Password is required').min(8, 'Must be at least 8 characters')
})

type Schema = z.output<typeof schema>

function onSubmit(payload: FormSubmitEvent<Schema>) {
  const authStore = useAuthStore()
  authStore.login(payload.data.username, payload.data.password, true)
}
</script>

<template>
  <UPageHero
    title="POS System"
    description="Manage your sales, inventory, and customers efficiently."
    orientation="horizontal"
    class="text-center lg:text-start"
  >
    <UPageCard>
      <UAuthForm
        title="Login"
        :fields="fields"
        :submit="{
          label: 'Login'
        }"
        :schema="schema"
        @submit="onSubmit"
      />
    </UPageCard>
  </UPageHero>
</template>

<style></style>
