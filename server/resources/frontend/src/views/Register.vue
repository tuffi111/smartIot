<script setup>
import 'vue-json-pretty/lib/styles.css';
import Default from "@/layouts/Default.vue";
import ModelView from "@/components/ModelView.vue";
import {onBeforeMount, reactive, ref} from "vue";
import {useStore} from 'vuex'
import {useApi, useHttp} from '@app/requests.js'
import {RegisterModel} from "@/models/RegisterModel.js";
import {Errors} from "@app/errors.js";
import {
    ionPerson,
    ionEyeOffOutline,
    ionEyeOutline,
    ionFingerPrint,
    ionMailOutline,
    ionRefresh
} from "@quasar/extras/ionicons-v7";


const FormData = new RegisterModel()
const store = useStore();
const http = useHttp();
const api = useApi();

let permissions = reactive([]);
let showPass = ref(false);
let errors = new Errors(FormData);

onBeforeMount(() => {

});

const register = () => {
    http('/login', {
        method: "PUT",
        data: FormData.get(),
    })
        .then((response) => {
            if (response.status === 200) {
                return response.data;
            } else {
                console.error('Register error', response)
                //todo: notetify('Login failed', response)
            }
        })
        .then((data) => {
            localStorage.setItem('token', data.token)
        })
        .catch((error) => {
            Object.assign(errors, {email: [], password: []}, error.response.data.errors);
            errors.set(error.response.data.errors)
        })
}


</script>

<template>
    <default>
        <q-card class="my-card w-50">
            <q-card-section class="bg-purple-14 text-white">
                <div class="text-h4">Register</div>
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


                        <q-input name="name"
                                 label="Name"
                                 v-model="data.name"
                                 hint="Name your account"
                                 :error="errors.has('name')"
                                 :error-message="errors.get('name')"
                                 :rules="FormData.validation('name')"
                                 class="q-mt-xl"
                        >
                            <template v-slot:prepend>
                                <q-icon :name="ionPerson"/>
                            </template>
                        </q-input>


                        <div class="row">
                            <div class="col-12 col-sm-6 q-pr-sm q-pr-sm-none q-mt-xl">
                                <q-input name="password"
                                         label="Password"
                                         :type="showPass?'text':'password'"
                                         v-model="data.password"
                                         :error="errors.has('password')"
                                         :error-message="errors.get('password')"
                                         class="col-6"
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
                            </div>

                            <div class="col-12 col-sm-6 q-pl-sm q-pl-sm-none q-mt-xl">
                                <q-input name="password_confirmation"
                                         label="Confirm password"
                                         type="password"
                                         v-model="data.password_confirmation"
                                         :error="errors.has('password_confirmation')"
                                         :error-message="errors.get('password_confirmation')"
                                         :rules="FormData.validation('password_confirmation')"
                                         class=""
                                >
                                    <template v-slot:prepend>
                                        <q-icon :name="ionRefresh"/>
                                    </template>
                                    <template v-slot:append>
                                    </template>
                                </q-input>
                            </div>
                        </div>

                        <q-card class="my-card q-pa-sm q-mt-lg">
                            <div class="text-subtitle2 q-mb-sm">Password Criteria:</div>
                            <div>
                                <q-icon v-if="FormData.get().password.length >=12 " name="check" color="positive"/>
                                <q-icon v-else name="cancel" color="negative"/>
                                Must be at least 12 characters long.
                            </div>
                            <div>
                                <q-icon v-if="FormData.get().password.length >=12 " name="check" color="positive"/>
                                <q-icon v-else name="cancel" color="negative"/>
                                Must contain at least one capital letter.
                            </div>
                            <div>
                                <q-icon v-if="FormData.get().password.length >=12 " name="check" color="positive"/>
                                <q-icon v-else name="cancel" color="negative"/>
                                Must contain at least one number.
                            </div>
                            <div>
                                <q-icon v-if="FormData.get().password.length >=12 " name="check" color="positive"/>
                                <q-icon v-else name="cancel" color="negative"/>
                                Must contain at least one symbol.
                            </div>
                        </q-card>

                    </template>
                </model-view>
            </q-card-section>


            <q-card-actions align="around">
                <q-btn color="primary" @click="register">Register</q-btn>
                <router-link class="q-btn q-btn--flat cursor-pointer" to="/login">Login</router-link>
            </q-card-actions>
        </q-card>

    </default>
</template>
