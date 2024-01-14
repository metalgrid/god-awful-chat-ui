import {
  createRouter,
  createWebHistory,
  type NavigationGuardNext,
  type RouteLocationNormalized
} from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { inject, type Ref } from 'vue'
import type { Auth } from '@/types'
import { deleteCookie, getCookie } from '@/composables/cookies'

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
    }
  ]
})

router.beforeEach(
  (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
    const auth: Ref<Auth> = inject('auth', {} as Ref<Auth>)
    // Check if the route requires authentication
    if (!to.meta.public && !auth.value.token) {
      // load auth from local storage
      // verify token is valid
      const localAuth = getCookie('auth')
      if (localAuth) {
        fetch(`${import.meta.env.VITE_API_URL}/api/v1/conversations/messaged-participants`, {
          headers: {
            Authorization: `Bearer ${localAuth.token}`
          }
        })
          .then((response) => {
            if (response.ok) {
              auth.value = localAuth
              return next()
            } else {
              deleteCookie('auth')
              next({ name: 'login' })
            }
          })
          .catch(() => {
            deleteCookie('auth')
            next({ name: 'login' })
          })
      } else {
        next({ name: 'login' })
      }
      // Redirect to login if not authenticated
    } else {
      // Continue navigation
      next()
    }
  }
)

export default router
