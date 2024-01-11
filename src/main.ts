import './assets/tailwind.css'

import { createApp, ref } from 'vue'
import App from './App.vue'
import router from './router'

import { type Auth } from './types'

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'
library.add(fas, far, fab)

const app = createApp(App)

app.use(router)
app.provide('auth', ref<Auth>({} as Auth))
app.component('fa-icon', FontAwesomeIcon)

app.mount('#app')
