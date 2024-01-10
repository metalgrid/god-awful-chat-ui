import {
  createRouter,
  createWebHistory,
  type NavigationGuardNext,
  type RouteLocationNormalized
} from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { inject, unref } from 'vue'
import type { Auth } from '@/types'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/chat',
      name: 'chat',
      component: () => import('../views/ChatWindow.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
      meta: {
        public: true
      }
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    }
  ]
})

router.beforeEach(
  (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
    const auth: Auth = unref(inject('auth', {} as Auth))
    console.log("Router's auth guard", auth)
    // Check if the route requires authentication
    if (!to.meta.public && !auth.token) {
      console.log('Redirecting to login')
      // Redirect to login if not authenticated
      next({ name: 'login' })
    } else {
      // Continue navigation
      next()
    }
  }
)

export default router
