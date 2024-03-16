<script setup>
import 'vue-json-pretty/lib/styles.css';
import VueJsonPretty from "vue-json-pretty";
import {useStore} from "vuex";
import {onBeforeMount} from "vue";
import {Model} from "@/models2/Model";
import {MyVueXModel} from "@app/models/examples/MyVueXModel";
import {ApiDataModel} from "@app/models/examples/ApiDataModel";
import {CookieStorage} from "@/models2/Storage/CookieStorage";
import {LocalDataModel} from "@app/models/examples/LocalDataModel";
import {CookieDataModel} from "@app/models/examples/CookieDataModel";
import {SessionDataModel} from "@app/models/examples/SessionDataModel";
import ModelFormExample from "@app/components/ModelFormExample.vue";

const store = useStore()
const apiModel = new ApiDataModel();
const vuexModel = new MyVueXModel()
const localModel = new LocalDataModel()//.storage(new CookieStorage())
const cookieModel = new CookieDataModel()
const sessionModel = new SessionDataModel();

const basicModel = new Model({
    theme: 'Model-theme',
    type: 7,
    address: {street: 'ggg', zip: 'ggg777', city: 'ggg777ggg'},
    tags: {'tag-7': 'tag-7', 'tag-77': 'tag-77', 'tag-777': 'tag-777'},
    rights: ['read', 'write'],
    time: '17:00:00'
})

console.log('XXX - VUEX: store', store);
console.log('XXX - MODELS: apiModel data', apiModel.data());
console.log('XXX - MODELS: vuexModel data', vuexModel.data());
console.log('XXX - MODELS: basicModel data', basicModel.data());
console.log('XXX - MODELS: localModel data', localModel.data());
console.log('XXX - MODELS: cookieModel data', cookieModel.data());
console.log('XXX - MODELS: sessionModel data', sessionModel.data());

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
    <vue-json-pretty :data="basicModel.data()" :deep="1"/>

    <hr>
    <h4>LocalStorage Model</h4>
    <model-form-example :model="localModel"></model-form-example>
    <vue-json-pretty :data="localModel.data()" :deep="1"/>

    <hr>
    <h4>SessionStorage Model</h4>
    <model-form-example :model="sessionModel"></model-form-example>
    <vue-json-pretty :data="sessionModel.data()" :deep="1"/>

    <hr>
    <h4>CookieStorage Model</h4>
    <model-form-example :model="cookieModel"></model-form-example>
    <vue-json-pretty :data="cookieModel.data()" :deep="1"/>

    <hr>
    <h4>ApiStorage Model</h4>
    <model-form-example :model="apiModel"></model-form-example>
    <vue-json-pretty :data="apiModel.data()" :deep="1"/>


    <hr>
    <h4>Vuex Store Model</h4>
    <model-form-example :model="vuexModel"></model-form-example>
    <vue-json-pretty :data="vuexModel.data()" :deep="0"/><hr>

    <hr>
    <h4>Global vuex store state</h4>
    <vue-json-pretty :data="store.state" :deep="3"/>
    <hr>

</template>
