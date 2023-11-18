import '@app/utils.js'
import '@/css/app.scss'
import {createApp} from 'vue'
import {createStore} from "@app/store.js";
import {createRouter} from '@app/router.js'
import {Quasar} from 'quasar'
import AppComponent from '@/App.vue'
import routes from '@/routes.js'
import quasarLang from 'quasar/lang/de-DE'
import '@quasar/extras/material-icons/material-icons.css'
import 'quasar/src/css/index.sass'

const app = createApp(AppComponent)
app.use(createStore())
app.use(createRouter(routes))

app.use(Quasar, {
  plugins: {}, // import Quasar plugins and add here
  lang: quasarLang,
})

app.mount('#app')
