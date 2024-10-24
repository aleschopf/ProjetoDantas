import { createRouter, createWebHashHistory } from 'vue-router'
import TagAndTargetAudienceCrudView from '../views/TagAndTargetAudienceCrudView.vue'
import ExerciseCrudView from '../views/ExerciseCrudView.vue'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'TagAndTargetAudienceCrudView',
      component: TagAndTargetAudienceCrudView
    },
    {
      path: '/exercicios/cadastro',
      name: 'home',
      component: ExerciseCrudView
    },
  ]
})

export default router
