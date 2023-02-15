import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from "./store";
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import '@/assets/styles/reset.scss'
import '@/assets/styles/comm.scss'

const app = createApp(App)
app.use(ElementPlus)
app.use(store)
app.use(router).mount('#app')