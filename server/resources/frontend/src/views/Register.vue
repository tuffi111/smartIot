<script setup>
import 'vue-json-pretty/lib/styles.css';
import Default from "@/layouts/Default.vue";
import {RegisterModel} from "@/models/RegisterModel";
import {useHttp} from '@app/requests'
import RegisterForm from "@/components/forms/auth/RegisterForm.vue";
import {authData} from "@app/auth.js";

const FormData = new RegisterModel()
//const FormData = new RegisterModel({email:'apiuser@meetago.com',firstname:"Vorname",lastname:"Nachname",password:"1234567890!A",password_confirmation:"1234567890!A",accepted:['agb']})
const http = useHttp();

const register = (e) => {
    e.preventDefault()
    FormData.errors().reset()

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
        .then((responseData) => {
            //localStorage.setItem('token', data.token)
            authData.set('token', responseData.token)
        })
        .catch((error) => {
            FormData.errors().set(error.response.data.errors)
        })
}


</script>

<template>
    <default>
        <q-form @submit="register">

            <q-card class="my-card w-50">
                <q-card-section class="bg-purple-14 text-white">
                    <div class="text-h3">Register</div>
                    <div class="text-subtitle2"></div>
                </q-card-section>
                <q-card-section>
                    <register-form :model="FormData"></register-form>
                </q-card-section>
                <q-card-actions align="around" class="q-pa-xl">
                    <router-link class="q-btn q-btn--flat cursor-pointer" to="/login">Login</router-link>
                    <q-btn color="primary" type="submit">Register</q-btn>
                </q-card-actions>
            </q-card>

        </q-form>

    </default>
</template>
