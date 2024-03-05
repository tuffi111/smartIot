<script setup>
import 'vue-json-pretty/lib/styles.css';
import VueJsonPretty from 'vue-json-pretty';
import Default from "@/layouts/Default.vue";
import ModelView from "@/components/ModelView.vue";
import {onBeforeMount, reactive, ref} from "vue";
import {useStore} from 'vuex'
import {useApi, useHttp} from '@app/requests'
import {LoginModel} from "@/models/LoginModel";
import {Errors} from "@app/errors";
import {ionEyeOffOutline, ionEyeOutline, ionFingerPrint, ionMailOutline} from "@quasar/extras/ionicons-v7";
import {useRouter} from 'vue-router';
import {login} from "@app/auth";

const FormData = new LoginModel()
const router = useRouter()
const store = useStore();
const http = useHttp();
const api = useApi();
const permissions = reactive([]);
const showPass = ref(false);
const errors = new Errors(FormData);

const sendLogin = (e) => {
    e.preventDefault()
    login(FormData.get(),
        (data) => {
            router.push('/')
        },
        (error) => {
            errors.set(error.response.data.errors)
        })
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

            <q-form @submit="sendLogin">
                <q-card-section>
                    <model-view :model="FormData">
                        <template v-slot="{ data }">

                            <q-input name="email"
                                     label="E-Mail"
                                     v-model="data.email"
                                     hint="The eMail you used for registration"
                                     lazy-rules
                                     :rules="FormData.validation('email')"
                                     class="q-pt-lg"
                            >
                                <template v-slot:prepend>
                                    <q-icon :name="ionMailOutline"/>
                                </template>
                            </q-input>

                            <q-input name="password"
                                     label="Password"
                                     :type="showPass?'text':'password'"
                                     v-model="data.password"
                                     lazy-rules
                                     :rules="FormData.validation('password')"
                                     class="q-pt-lg"
                            >
                                <template v-slot:prepend>
                                    <q-icon :name="ionFingerPrint"/>
                                </template>
                                <template v-slot:append>
                                    <q-icon v-if="!showPass" title="Show password" :name="ionEyeOutline"
                                            @click="showPass=!showPass"/>
                                    <q-icon v-if="showPass" title="Hide password" :name="ionEyeOffOutline"
                                            @click="showPass=!showPass"/>
                                </template>
                            </q-input>
                        </template>
                    </model-view>
                </q-card-section>


                <q-card-actions align="around" class="q-pt-lg">
                    <q-btn color="primary" type="submit">Login</q-btn>
                    <router-link class="q-btn q-btn--flat cursor-pointer" to="/register">Sign-Up</router-link>
                    <q-btn flat @click="logout">Logout</q-btn>
                    <q-btn flat @click="getPermissions">Permissions</q-btn>
                </q-card-actions>
            </q-form>

        </q-card>

    </default>
</template>
