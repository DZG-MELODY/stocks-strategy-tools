import devtools from '@vue/devtools';
import { createApp } from 'vue';
import { createRouter, createWebHashHistory } from 'vue-router';
import "./style.css";
import App from './App.vue';
import './samples/node-api';


const router = createRouter({
  history: createWebHashHistory(),
  routes: []
});

createApp(App)
  .use(router)
  .mount('#app')
  .$nextTick(() => {
    postMessage({ payload: 'removeLoading' }, '*');
  });

if (process.env.NODE_ENV === 'development' && process.env.DEV_TOOLS === 'vue') devtools.connect();