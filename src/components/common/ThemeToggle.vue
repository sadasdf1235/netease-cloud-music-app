<template>
  <button class="icon-btn" @click="toggleDark()">
    <div class="i-carbon-moon dark:i-carbon-sun"></div>
  </button>
</template>

<script setup lang="ts">
import { useDark, useToggle } from '@vueuse/core'

const isDark = useDark()
const toggleDark = useToggle(isDark)
</script>