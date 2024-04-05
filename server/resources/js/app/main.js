import '@/utils.js'
import {createApp} from 'vue'
import {createStore} from "vuex";
import {createRouter} from '@/router.js'
import {Quasar} from 'quasar'
import quasarLang from 'quasar/lang/de-DE'
import 'quasar/src/css/index.sass'
import "quasar/src/css/flex-addon.sass";
import iconSet from 'quasar/icon-set/svg-ionicons-v6'
import AppComponent from '@app/App.vue'
import backendRouter from '@/backend-router';
import routes from '@app/routes.js'
import {authData, resetPermissions} from "@/auth.js";
import { Ziggy } from '@app/../ziggy';
//import '@quasar/extras/material-icons/material-icons.css'

const app = createApp(AppComponent)

resetPermissions(Auth) // Variable "Auth" is set in html body via backend
authData().wait() // Fetch authdata from storage

app.use(createStore({}))
app.use(backendRouter(Ziggy));
app.use(createRouter(routes))

app.use(Quasar, {
    plugins: {}, // import Quasar plugins and add here
    lang: quasarLang,
    iconSet: iconSet
})

app.mount('#app')
