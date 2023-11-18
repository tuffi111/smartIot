import '@app/utils'
import '@/css/app.scss'
import {createApp} from 'vue'
import {createStore} from "@app/store";
import {createRouter} from '@app/router'
import {Quasar} from 'quasar'
import AppComponent from '@/App.vue'
import routes from '@/routes'
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
