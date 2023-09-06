<script setup lang="ts">
defineOptions({ name: 'HomePage' });
</script>

<template>
  <div class="w-full h-full bg-white dark:bg-black grid grid-cols-3 grid-rows-3 gap-3">
    <RouterLink :to="{ name: 'strategy' }">
      <div class="bg-slate-400 w-full h-full flex justify-center items-center cursor-pointer">
        <span class="font-bold">数据更新</span>
      </div>
    </RouterLink>
  </div>
</template>