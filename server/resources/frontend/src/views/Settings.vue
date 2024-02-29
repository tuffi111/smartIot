<script setup>
import Default from "@/layouts/Default.vue";
import VueJsonPretty from "vue-json-pretty";
import {useStore} from "vuex";
import {Model} from "@app/models/Model.js";
import {MyVueXModel} from "@/models/examples/MyVueXModel.js";
import {LocalDataModel} from "@/models/examples/LocalDataModel.js";
import {CookieDataModel} from "@/models/examples/CookieDataModel.js";
import {SessionDataModel} from "@/models/examples/SessionDataModel.js";
import {useBrowserSettings} from "@/services/browserSettings.js";

const store = useStore()
const vuexModel = new MyVueXModel()
const localModel = new LocalDataModel()
const cookieModel = new CookieDataModel()
const sessionModel = new SessionDataModel();
const model = new Model({
    theme: 'theme-name-333',
    fontsize: 33,
    address: {street: '', zip: '', city: ''},
    tags: ['tag-7','tag-8','tag-9'],
    time: '11:00:00'
})


console.log('VUEX: store', store);
console.log('MODELS: model data', model.data());
console.log('MODELS: vuexModel data', vuexModel.data());
console.log('MODELS: localModel data', localModel.data());
console.log('MODELS: cookieModel data', cookieModel.data());
console.log('MODELS: sessionModel data', sessionModel.data());

</script>

<template>
    <default>
        <template v-slot:sidebar>
            Settings sidebar
        </template>

        Model examples

        <hr>
        <h4>CookieModel</h4>
        <br>
        <input v-model="cookieModel.data().fontsize">
        <br>
        <input v-model="cookieModel.data().address.street">
        <br>
        <input v-model="cookieModel.data().address.city">
        <br>
        <vue-json-pretty :data="cookieModel.data()"/>


        <hr>
        <h4>LocalModel</h4>
        <br>
        <input v-model="localModel.data().fontsize">
        <br>
        <input v-model="localModel.data().address.street">
        <br>
        <input v-model="localModel.data().address.city">
        <br>
        <vue-json-pretty :data="localModel.data()"/>

        <hr>
        <h4>SessionModel</h4>
        <br>
        <input v-model="sessionModel.data().fontsize">
        <br>
        <input v-model="sessionModel.data().address.street">
        <br>
        <input v-model="sessionModel.data().address.city">
        <br>
        <vue-json-pretty :data="sessionModel.data()"/>


        <hr>
        <h4>VueXModel</h4>
        <br>
        <input v-model="vuexModel.data().fontsize">
        <br>
        <input v-model="vuexModel.data().address.street">
        <br>
        <input v-model="vuexModel.data().address.city">
        <br>
        <vue-json-pretty :data="vuexModel.data()"/>



        <hr>
        <h4>Model</h4>
        <br>
        <input v-model="model.data().fontsize">
        <br>
        <input v-model="model.data().address.street">
        <br>
        <input v-model="model.data().address.city">
        <br>
        <vue-json-pretty :data="model.data()"/>



        <hr>
        <h4>Store</h4>
        <vue-json-pretty :data="store.state"/>


    </default>
</template>
