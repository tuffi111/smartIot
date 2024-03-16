import '@/utils.js'
import {createApp} from 'vue'
import {createStore} from "vuex";
import {createRouter} from '@/router.js'
import {Quasar} from 'quasar'
import quasarLang from 'quasar/lang/de-DE'
import 'quasar/src/css/index.sass'
//import '@quasar/extras/material-icons/material-icons.css'
import "quasar/src/css/flex-addon.sass";
import iconSet from 'quasar/icon-set/svg-ionicons-v6'
import requests from '@/requests.js'
import AppComponent from '@app/App.vue'
import routes from '@app/routes.js'
import {refresh} from "@/auth.js";

const app = createApp(AppComponent)
const router = createRouter(routes)
requests.setup(app)
refresh(Auth)


app.use(createStore({}))
app.use(router)

app.use(Quasar, {
    plugins: {}, // import Quasar plugins and add here
    lang: quasarLang,
    iconSet: iconSet
})

app.mount('#app')
