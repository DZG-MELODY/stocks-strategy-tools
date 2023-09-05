<script setup lang="ts">
import { darkTheme } from 'naive-ui';
</script>

<template>
  <NConfigProvider class="w-full h-full" :theme="darkTheme">
    <RouterView></RouterView>
  </NConfigProvider>
</template>
