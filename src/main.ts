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
      component: () => import('@client/modules/home/index.vue')
    },
    {
      name: 'strategy',
      path: '/strategy',
      component: () => import('@client/modules/strategy/index.vue')
    }
  ]
});

createApp(App)
  .use(router)
  .mount('#app')
  .$nextTick(() => {
    postMessage({ payload: 'removeLoading' }, '*');
  });

if (process.env.NODE_ENV === 'development' && process.env.DEV_TOOLS === 'vue') devtools.connect();