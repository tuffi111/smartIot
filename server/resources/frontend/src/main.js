import '@app/utils.js'
import {createApp} from 'vue'
import {createStore} from "@app/store.js";
import {createRouter} from '@app/router.js'
import {createApi} from '@app/api.js'
import {Quasar} from 'quasar'
import AppComponent from '@/App.vue'
import routes from '@/routes.js'
import quasarLang from 'quasar/lang/de-DE'
import '@quasar/extras/material-icons/material-icons.css'
import 'quasar/src/css/index.sass'

const app = createApp(AppComponent)
const router = createRouter(routes)
createApi(app)

app.use(createStore())
app.use(router)

app.use(()=>{

    /*
    window.axios = require('axios');

    let user_token = $('meta[name="user-token"]').attr('content');

    window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
    window.axios.defaults.headers.common['Authorization'] = `Bearer ${user_token}`
     */
})

app.use(Quasar, {
  plugins: {}, // import Quasar plugins and add here
  lang: quasarLang,
})


//app.http.headers.common['Authorization'] = 'Basic YXBpOnBhc3N3b3Jk';

app.mount('#app')
