<script setup>
import 'vue-json-pretty/lib/styles.css';
import VueJsonPretty from "vue-json-pretty";
import ModelView from "@/models/ModelView.vue";
import {useStore} from "vuex";
import {Model} from "@/models/Model.js";
import {ApiDataModel} from "@app/models/examples/ApiDataModel.js";
import {MyVueXModel} from "@app/models/examples/MyVueXModel.js";
import {LocalDataModel} from "@app/models/examples/LocalDataModel.js";
import {CookieDataModel} from "@app/models/examples/CookieDataModel.js";
import {SessionDataModel} from "@app/models/examples/SessionDataModel.js";
import ModelComponentExample from "@app/components/ModelComponentExample.vue";
//import {useBrowserSettings} from "@app/services/browserSettings.js";
import {onBeforeMount} from "vue";

const store = useStore()
const apiModel = new ApiDataModel()
const vuexModel = new MyVueXModel()
const localModel = new LocalDataModel()
const cookieModel = new CookieDataModel()
const sessionModel = new SessionDataModel();
const basicModel = new Model({
    theme: 'Model-theme',
    type: 7,
    address: {street: 'ggg', zip: 'ggg777', city: 'ggg777ggg'},
    tags: {'tag-7':'tag-7', 'tag-77':'tag-77', 'tag-777':'tag-777'},
    rights: ['read','write'],
    time: '17:00:00'
})

console.log('VUEX: store', store);
console.log('MODELS: apiModel data', apiModel.data());
console.log('MODELS: vuexModel data', vuexModel.data());
console.log('MODELS: basicModel data', basicModel.data());
console.log('MODELS: localModel data', localModel.data());
console.log('MODELS: cookieModel data', cookieModel.data());
console.log('MODELS: sessionModel data', sessionModel.data());

onBeforeMount(() => {
    //FormDataApi.fetch()
});

</script>
<template>
    <h2>Models</h2>

    <h4>Basic Model</h4>
    Theme: <input v-model="basicModel.data().theme">
    <br>
    Type: <input v-model="basicModel.data().type">
    <br>
    Address.Street: <input v-model="basicModel.data().address.street">
    <br>
    Address.Zip: <input v-model="basicModel.data().address.zip">
    <br>
    Address.City: <input v-model="basicModel.data().address.city">
    <br>
    <vue-json-pretty :data="basicModel.data()" :deep="1" />


    <h4>Cookie Model</h4>
    <model-view :model="cookieModel">
        <template v-slot="{ data }">
            Theme: <input v-model="data['theme']">
            <br>
            Type: <input v-model="data['type']">
            <br>
            Address.Street: <input v-model="data['address'].street">
            <br>
            Address.Zip: <input v-model="data['address'].zip">
            <br>
            Address.City: <input v-model="data['address'].city">
            <br>
            <vue-json-pretty :data="data" class="collapsed" :deep="1"/>
        </template>
    </model-view>
    <vue-json-pretty :data="cookieModel.data()" :deep="0"/>

    <hr>
    <h4>LocalStorage Model</h4>
    <model-component-example :model="localModel"></model-component-example>
    <vue-json-pretty :data="localModel.data()" :deep="1"/>

    <hr>
    <h4>SessionStorage Model</h4>
    <model-component-example :model="sessionModel"></model-component-example>
    <vue-json-pretty :data="sessionModel.data()" :deep="1"/>

    <hr>
    <h4>Api Model</h4>
    <model-component-example :model="apiModel"></model-component-example>
    <q-btn @click="apiModel.update()">Update</q-btn><q-btn @click="apiModel.fetch()">Fetch</q-btn>
    <vue-json-pretty :data="apiModel.data()" :deep="1"/><hr>

    <hr>
    <h4>Vuex Store Model</h4>
    <model-component-example :model="vuexModel"></model-component-example>
    <vue-json-pretty :data="vuexModel.data()" :deep="0"/><hr>
    Global vuex store state: <vue-json-pretty :data="store.state" :deep="3"/><hr>

</template>
