<script setup>
import {onBeforeMount} from "vue";
import {useStore} from 'vuex'
import 'vue-json-pretty/lib/styles.css';
import VueJsonPretty from 'vue-json-pretty';
import Default from "@/layouts/Default.vue";
import ModelView from "@/components/ModelView.vue";
import {LoginModel} from "@/models/LoginModel.js";
import {useHttp} from '@app/api.js'
import {SessionStorage} from "quasar";

const FormData = new LoginModel()
const store = useStore();
const api = useHttp();


onBeforeMount(() => {

});

const login = () => {
    api('/login', {
        method: "POST",
        data: FormData.get(),
    })
        .then((response) => {
            if( response.status === 200){
                return response.data;
            }else{
                console.error('ERRROR', response)
            }
        })
        .then((data) => {
            console.log('Api response data:', data)
            localStorage.setItem('token', data.token)
        })
        .catch((error) => {
            console.error('ERRROR', error)
        })
}


</script>
<template>
    <default>
        <h2>Login</h2>
        <model-view :model="FormData">
            <template v-slot="{ data }">
                eMail: <input type="text" v-model="data.email"><br>
                Password: <input type="password" v-model="data.password"><br>
                ===&gt; {{ data }}
            </template>
        </model-view>
        <hr>
        <button @click="login">Login</button>

        <h4>Data</h4>
        <vue-json-pretty :data="FormData.store()"/>
    </default>
</template>
