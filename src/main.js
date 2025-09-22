import './assets/css/main.css'
import './assets/CSS/mobile.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {
  faBoxArchive,
  faBoxOpen,
  faCheck,
  faChevronDown,
  faChevronUp,
  faCircleCheck,
  faCircleXmark,
  faClipboard,
  faEye,
  faEyeSlash,
  faFolderPlus,
  faPencil,
  faPlus,
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
  faCheck,
  faCircleCheck,
  faBoxArchive,
  faBoxOpen,
  faFolderPlus,
  faPlus,
)

const app = createApp(App)

app.component('font-awesome-icon', FontAwesomeIcon)

app.use(router)

app.mount('#app')
