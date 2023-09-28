import devtools from '@vue/devtools';
import { createApp } from 'vue';
import { createRouter, createWebHashHistory } from 'vue-router';
import "./style.css";
import App from './App.vue';


const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      name: 'home',
      path: '/',
      meta: { title: '策略助手' },
      component: () => import('./modules/home/index.vue')
    },
    {
      name: 'industry-trend',
      path: '/industry-trend',
      meta: { title: '行业趋势分析' },
      component: () => import('./modules/industry-trend/index.vue'),
    },
    {
      name: 'topic-trend',
      path: '/topic-trend',
      meta: { title: '题材趋势分析' },
      component: () => import('./modules/topic-trend/index.vue'),
    },
    {
      name: 'head-trend',
      path: '/head-trend',
      meta: { title: '龙头分析' },
      component: () => import('./modules/head-trend/index.vue'),
    },
    {
      name: 'stock-analyze',
      path: '/stock-analyze',
      meta: { title: '个股分析' },
      component: () => import('./modules/stock-analyze/index.vue'),
    },
    {
      name: 'data-manage',
      path: '/data-manage',
      meta: { title: '数据管理' },
      component: () => import('./modules/data-manage/index.vue')
    }
  ]
});

// naive-ui 与 tailwind 样式覆盖
const meta = document.createElement('meta');
meta.name = 'naive-ui-style';
document.head.appendChild(meta);

router.afterEach((to) => {
  document.title = to.meta.title as string;
});

createApp(App)
  .use(router)
  .mount('#app')
  .$nextTick(() => {
    postMessage({ payload: 'removeLoading' }, '*');
  });

if (process.env.NODE_ENV === 'development' && process.env.DEV_TOOLS === 'vue') devtools.connect();