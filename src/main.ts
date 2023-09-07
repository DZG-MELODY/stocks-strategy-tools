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
      component: () => import('./modules/home/index.vue')
    },
    {
      name: 'strategy',
      path: '/strategy',
      component: () => import('./modules/strategy/index.vue')
    },
    {
      name: 'data-manage',
      path: '/data-manage',
      component: () => import('./modules/data-manage/index.vue')
    }
  ]
});

// naive-ui 与 tailwind 样式覆盖
// const meta = document.createElement('meta');
// meta.name = 'naive-ui-style';
// document.head.appendChild(meta);

createApp(App)
  .use(router)
  .mount('#app')
  .$nextTick(() => {
    postMessage({ payload: 'removeLoading' }, '*');
  });

if (process.env.NODE_ENV === 'development' && process.env.DEV_TOOLS === 'vue') devtools.connect();