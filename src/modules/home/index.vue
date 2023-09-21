<script setup lang="ts">
defineOptions({ name: 'HomePage' });
</script>

<template>
  <div class="w-full h-full bg-gray-100 dark:bg-black grid grid-cols-3 grid-rows-3 gap-3 p-3">
    <RouterLink :to="{ name: 'industry-trend' }">
      <div class="bg-blue-500 w-full h-full flex justify-center items-center cursor-pointer">
        <span class="font-bold">行业趋势</span>
      </div>
    </RouterLink>
    <RouterLink :to="{ name: 'topic-trend' }">
      <div class="bg-orange-500 w-full h-full flex justify-center items-center cursor-pointer">
        <span class="font-bold">题材趋势</span>
      </div>
    </RouterLink>
    <RouterLink :to="{ name: 'head-trend' }">
      <div class="bg-purple-500 w-full h-full flex justify-center items-center cursor-pointer">
        <span class="font-bold">龙头趋势</span>
      </div>
    </RouterLink>
    <RouterLink :to="{ name: 'data-manage' }">
      <div class="bg-green-500 w-full h-full flex justify-center items-center cursor-pointer">
        <span class="font-bold">数据管理</span>
      </div>
    </RouterLink>
  </div>
</template>