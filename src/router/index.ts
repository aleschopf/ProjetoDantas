import { createRouter, createWebHashHistory } from 'vue-router'
import TagAndTargetAudienceCrud from '../views/TagAndTargetAudienceCrud.vue'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: TagAndTargetAudienceCrud
    },
  ]
})

export default router
