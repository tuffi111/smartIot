<script setup>
import 'vue-json-pretty/lib/styles.css';
import Default from "@/layouts/Default.vue";
import {useApi} from '@app/requests'
import {LoginModel} from "@/models/LoginModel";
import {useRouter} from 'vue-router';
import {login} from "@app/auth";
import LoginForm from "@/components/forms/auth/LoginForm.vue";

const FormData = new LoginModel()
//const FormData = new LoginModel({email: 'apiuser@meetago.com'})
const router = useRouter()
const api = useApi();

const sendLogin = (e) => {
    e.preventDefault()
    login(FormData.get(),
        () => {
            router.push('/')
        },
        (error) => {
            FormData.errors().set(error.response.data.errors)
        })
}

const logout = () => {
    api('/logout')
        .then(() => {
            console.info('Logout successful')
            localStorage.removeItem('token')
        })
        .catch(() => {
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
                console.error('ERROR', response)
            }
        })
        .then((data) => {
            console.log('Api response data:', data)
            //localStorage.setItem('token', data.token)
        })
        .catch(() => {
            //console.error('ERROR', error)
        })
}


</script>
<template>
    <default>
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
                    <router-link class="q-btn q-btn--flat cursor-pointer" to="/register">Sign-Up</router-link>
                    <q-btn flat @click="logout">Logout</q-btn>
                    <q-btn flat @click="getPermissions">Permissions</q-btn>
                    <q-btn color="primary" type="submit">Login</q-btn>
                </q-card-actions>
            </q-form>

        </q-card>

    </default>
</template>
