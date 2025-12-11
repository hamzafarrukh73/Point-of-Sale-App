<script setup lang="ts">
const toaster = { position: 'top-center', duration: 1000 }
</script>

<template>
    <UApp :toaster="toaster">
        <NuxtLayout>
            <NuxtPage />
        </NuxtLayout>
    </UApp>
</template>

<style></style>