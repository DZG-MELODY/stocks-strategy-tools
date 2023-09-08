<script setup lang="ts">
// import { darkTheme } from 'naive-ui';
</script>

<template>
  <n-config-provider class="w-full h-full">
    <n-message-provider>
      <router-view></router-view>
    </n-message-provider>
  </n-config-provider>
</template>
