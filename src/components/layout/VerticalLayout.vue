<script setup lang="ts">
</script>

<template>
  <div class="w-full h-full flex flex-col">
    <div class="h-12 flex-grow-0 flex-shrink-0 flex justify-between items-center px-3">
      <slot name="header"></slot><router-link to="/"><n-button size="small">返回主页</n-button></router-link>
    </div>
    <div class="flex-1 overflow-hidden">
      <slot></slot>
    </div>
  </div>
</template>