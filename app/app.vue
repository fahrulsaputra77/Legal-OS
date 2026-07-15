<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
import '~/assets/css/tailwind.css'

useHead({
  titleTemplate: (titleChunk) => {
    return titleChunk ? `${titleChunk} - AI Legal OS` : 'AI Legal OS — One AI. Every Legal Workflow.';
  },
  bodyAttrs: {
    class: 'antialiased font-sans',
  }
})
</script>
