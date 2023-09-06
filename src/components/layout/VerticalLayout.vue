<script setup lang="ts">
</script>

<template>
  <div class="w-full h-full flex flex-col">
    <div class="h-12 flex-grow-0 flex-shrink-0">
      <slot name="header"></slot>
    </div>
    <div class="flex-1">
      <slot></slot>
    </div>
  </div>
</template>