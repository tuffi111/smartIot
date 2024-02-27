<script setup>
import 'vue-json-pretty/lib/styles.css';
import VueJsonPretty from 'vue-json-pretty';
import Default from "@/layouts/Default.vue";
import ModelView from "@/components/ModelView.vue";
import {onBeforeMount, reactive, ref} from "vue";
import {useStore} from 'vuex'
import {useApi, useHttp} from '@app/requests.js'
import {LoginModel} from "@/models/LoginModel.js";
import {Errors} from "@app/errors.js";
import {ionEyeOffOutline, ionEyeOutline, ionFingerPrint, ionMailOutline} from "@quasar/extras/ionicons-v7";
import { useRouter } from 'vue-router';

const FormData = new LoginModel()
const router = useRouter()
const store = useStore();
const http = useHttp();
const api = useApi();

let permissions = reactive([]);
let showPass = ref(false);
let errors = new Errors(FormData);

onBeforeMount(() => {

});

const login = () => {
    http('/login', {
        method: "POST",
        data: FormData.get(),
    })
        .then((response) => {
            //console.error('API: RESPONSE', response)
            if (response.status === 200) {
                return response.data;
            } else {
                //console.error('ERRROR', response)
                //todo: notetify('Login failed', response)
            }

        })
        .then((data) => {
            localStorage.setItem('token', data.token)
            router.push('/')
        })
        .catch((error) => {
            //console.error('ERRROR', error.response.data.errors)
            errors.set(error.response.data.errors)
        })
}

function resetForm() {
    Object.assign(form, initialState);
}

const logout = () => {
    api('/logout')
        .then((response) => {
            console.info('Logout successful')
            localStorage.removeItem('token')
        })
        .catch((error) => {
            //console.error('Logout:', error)
        })
}

const getPermissions = () => {
    api('/permissions', {
        method: "get",
    })
        .then((response) => {
            if (response.status === 200) {
                return response.data;
            } else {
                console.error('ERRROR', response)
            }
        })
        .then((data) => {
            console.log('Api response data:', data)
            //localStorage.setItem('token', data.token)
        })
        .catch((error) => {
            //console.error('ERRROR', error)
        })
}


</script>
<template>
    <default>
        <q-card class="my-card w-50">
            <q-card-section class="bg-purple-14 text-white">
                <div class="text-h4">Login</div>
                <div class="text-subtitle2"></div>
            </q-card-section>


            <q-card-section>
                <model-view :model="FormData">
                    <template v-slot="{ data }">
                        <q-input name="email"
                                 label="E-Mail"
                                 v-model="data.email"
                                 hint="The eMail you used for registration"
                                 :error="errors.has('email')"
                                 :error-message="errors.get('email')"
                                 :rules="FormData.validation('email')"
                        >
                            <template v-slot:prepend>
                                <q-icon :name="ionMailOutline"/>
                            </template>
                        </q-input>

                        <q-input name="password"
                                 label="Password"
                                 :type="showPass?'text':'password'"
                                 v-model="data.password"
                                 :error="errors.has('password')"
                                 :error-message="errors.get('password')"
                                 :rules="FormData.validation('password')"
                        >
                            <template v-slot:prepend>
                                <q-icon :name="ionFingerPrint"/>
                            </template>
                            <template v-slot:append>
                                <q-icon v-if="!showPass" title="Show password" :name="ionEyeOutline" @click="showPass=!showPass"/>
                                <q-icon v-if="showPass" title="Hide password" :name="ionEyeOffOutline" @click="showPass=!showPass"/>
                            </template>
                        </q-input>

                    </template>
                </model-view>
            </q-card-section>


            <q-card-actions align="around" class="q-mt-sm">
                <q-btn color="primary" @click="login">Login</q-btn>
                <router-link class="q-btn q-btn--flat cursor-pointer" to="/register">Sign-Up</router-link>
                <q-btn flat @click="logout">Logout</q-btn>
                <q-btn flat @click="getPermissions">Permissions</q-btn>
            </q-card-actions>
        </q-card>

    </default>
</template>
