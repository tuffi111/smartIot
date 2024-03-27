<script setup>
import 'vue-json-pretty/lib/styles.css';
import Default from "@app/layouts/Default.vue";
import {LoginModel} from "@app/models/auth/LoginModel";
import {useRouter} from 'vue-router';
import {isAuth, login, user, refresh, authData} from "@/auth";
import LoginForm from "@app/components/forms/auth/LoginForm.vue";

//const FormData = new LoginModel()
const FormData = new LoginModel({email: 'apiuser@meetago.com', password: 'secret'})
const router = useRouter()

const sendLogin = (e) => {
    e.preventDefault()
    login(FormData.get(),
        () => {
            router.push('/')
        },
        (error) => {
            console.error(error)
            FormData.errors().set(error.response.data.errors)
        })
        .finally(() => {
            refresh()
        })
}



</script>
<template>
    <default>

        isAuth: {{ isAuth() }}<hr>
        Data: {{ authData().get() }}<hr>
        User: {{ user() }}<hr>

        <q-card class="my-card w-50">
            <q-card-section class="bg-purple-14 text-white">
                <div class="text-h3">Login</div>
                <div class="text-subtitle2"></div>
            </q-card-section>

            <q-form @submit="sendLogin">
                <q-card-section>
                    <login-form :model="FormData"/>
                </q-card-section>


                <q-card-actions align="around" class="q-pa-xl">
                    <q-btn color="primary" type="submit">Login</q-btn>
                </q-card-actions>
            </q-form>

        </q-card>

    </default>
</template>
