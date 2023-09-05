import devtools from '@vue/devtools';
import { createApp } from 'vue';
import { createRouter, createWebHashHistory } from 'vue-router';
import { create, NButton, NCalendar, NConfigProvider, NDataTable } from 'naive-ui';
import "./style.css";
import App from './App.vue';

const naiveUI = create({
  components: [NButton, NCalendar, NConfigProvider, NDataTable]
});

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

const meta = document.createElement('meta');
meta.name = 'naive-ui-style';
document.head.appendChild(meta);

createApp(App)
  .use(naiveUI)
  .use(router)
  .mount('#app')
  .$nextTick(() => {
    postMessage({ payload: 'removeLoading' }, '*');
  });

if (process.env.NODE_ENV === 'development' && process.env.DEV_TOOLS === 'vue') devtools.connect();