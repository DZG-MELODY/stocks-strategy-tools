<script setup lang="ts">
defineOptions({ name: 'HomePage' });
</script>

<template>
  <div class="w-full h-full bg-white dark:bg-black grid grid-cols-3 grid-rows-3 gap-3">
    <div class="bg-slate-400 w-full h-full flex justify-center items-center">
      <RouterLink :to="{ name: 'strategy' }"><span class="cursor-pointer">数据更新</span></RouterLink>
    </div>
  </div>
</template>