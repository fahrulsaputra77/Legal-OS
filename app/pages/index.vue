<script setup lang="ts">
import { navigateTo } from 'nuxt/app'

definePageMeta({
  middleware: [
    function (to, from) {
      return navigateTo('/dashboard')
    },
  ],
})
</script>

<template>
  <div>Redirecting...</div>
</template>
