import './assets/CSS/main.CSS'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {
  faChevronDown,
  faChevronUp,
  faCircleXmark,
  faClipboard,
  faEye,
  faEyeSlash,
  faPencil,
  faPlusSquare,
  faSave,
  faTrash,
} from '@fortawesome/free-solid-svg-icons'
import {} from '@fortawesome/free-regular-svg-icons'
import {} from '@fortawesome/free-brands-svg-icons'

library.add(
  faClipboard,
  faEye,
  faEyeSlash,
  faPencil,
  faTrash,
  faChevronUp,
  faChevronDown,
  faPlusSquare,
  faCircleXmark,
  faSave,
)

const app = createApp(App)

app.component('font-awesome-icon', FontAwesomeIcon)

app.use(router)

app.mount('#app')
