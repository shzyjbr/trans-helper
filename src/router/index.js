import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path:'/',
    name:'LaunchPage',
    component:()=>import('@/pages/launchPage.vue')
  },
  {
    path:'/dashboard',
    name:'Dashboard',
    component:()=>import('@/pages/dashboard.vue')
  },

]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router