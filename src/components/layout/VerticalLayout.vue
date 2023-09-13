<script setup lang="ts">

export type InlineButtons = 'return' | 'home';

const props = withDefaults(defineProps<{ inlineButtons?: Array<InlineButtons> }>(),
  {
    inlineButtons: () => (['return', 'home'])
  });

</script>

<template>
  <div class="w-full h-full flex flex-col">
    <div class="h-12 flex-grow-0 flex-shrink-0 flex justify-between items-center px-3">
      <n-button v-if="props.inlineButtons.includes('return')" size="small" @click="$router.go(-1)">返回</n-button>
      <slot name="header"></slot>
      <router-link v-if="props.inlineButtons.includes('home')" to="/"><n-button size="small">返回主页</n-button></router-link>
    </div>
    <div class="flex-1 overflow-hidden">
      <slot></slot>
    </div>
  </div>
</template>