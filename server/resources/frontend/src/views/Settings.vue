<script setup>
import Default from "@/layouts/Default.vue";
import {useSessionModel, useBrowserSettings, useLocalModel, useCookieModel} from "@/services/browserSettings.js";
import {} from "@/services/browserSettings.js";
import {MyVueXModel} from "@/models/MyVueXModel.js";
import {useStore} from "vuex";
import {Model} from "@app/models/Model.js";

const localModel = useLocalModel()
const sessionModel = useSessionModel()
const cookieModel = useCookieModel()
const vuexModel = new MyVueXModel();
const store = useStore()
const model = new Model({
    theme: 'theme-name-333',
    fontsize: 33,
    address: {street: '', zip: '', city: ''},
    tags: ['tag-7','tag-8','tag-9'],
    time: '11:00:00'
})


console.log('MODELS: cookieModel data', cookieModel.data());
console.log('MODELS: localModel data', localModel.data());
console.log('MODELS: sessionModel data', sessionModel.data());
console.log('MODELS: vuexModel data', vuexModel.data());
console.log('MODELS: model data', model.data());
console.log('VUEX: store', store);


</script>

<template>
    <default>
        <template v-slot:sidebar>
            Settings sidebar
        </template>

        Settings



        <hr>
        <h4>CookieModel</h4>
        {{ cookieModel.data() }}
        <br>
        <input v-model="cookieModel.data().fontsize">
        <br>
        <input v-model="cookieModel.data().address.street">
        <br>
        <input v-model="cookieModel.data().address.city">
        <br>


        <hr>
        <h4>LocalModel</h4>
        {{ localModel.data() }}
        <br>
        <input v-model="localModel.data().fontsize">
        <br>
        <input v-model="localModel.data().address.street">
        <br>
        <input v-model="localModel.data().address.city">
        <br>

        <hr>
        <h4>SessionModel</h4>
        {{ sessionModel.data() }}
        <br>
        <input v-model="sessionModel.data().fontsize">
        <br>
        <input v-model="sessionModel.data().address.street">
        <br>
        <input v-model="sessionModel.data().address.city">
        <br>


        <hr>
        <h4>VueXModel</h4>
        {{ vuexModel.data() }}
        <br>
        <input v-model="vuexModel.data().fontsize">
        <br>
        <input v-model="vuexModel.data().address.street">
        <br>
        <input v-model="vuexModel.data().address.city">
        <br>
        {{ store.state }}


        <hr>
        <h4>Model</h4>
        {{ model.data() }}
        <br>
        <input v-model="model.data().fontsize">
        <br>
        <input v-model="model.data().address.street">
        <br>
        <input v-model="model.data().address.city">
        <br>


        <hr>
        {{ store.state }}


    </default>
</template>
