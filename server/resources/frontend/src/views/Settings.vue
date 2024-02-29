<script setup>
import Default from "@/layouts/Default.vue";
import {useSessionModel,useBrowserSettings} from "@/services/browserSettings.js";
import {} from "@/services/browserSettings.js";
import {MyVueXModel} from "@/models/MyVueXModel.js";
import {useStore} from "vuex";


/*
class TempModel extends Model //LocalModel ApiModel SocketModel
{
    name() {
        return 'TempModel'
    }
}


class ApiModel extends Model // SocketModel
{
    name() {
        return 'ApiModel'
    }
}


class SocketModel extends Model // ApiModel
{
    name() {
        return 'SocketModel'
    }
}


/*
const tempForm = new TempModel()
const localForm = new LocalModel()
const apiForm = new ApiModel()
const socketForm = new SocketModel()

console.log('tempForm', tempForm.name(), tempForm.data());
console.log('localForm', localForm.name(), localForm.data());
console.log('apiForm', apiForm.name(), apiForm.data());
console.log('socketForm', socketForm.name(), socketForm.data());
/**/

const browserSettings = useBrowserSettings()
const sessionModel = useSessionModel()
const vuexModel = new MyVueXModel();
const store = useStore()

console.log('MODELS: browserSettings data', browserSettings.data());
console.log('MODELS: sessionModel data', sessionModel.data());
console.log('MODELS: vuexModel data', vuexModel.data());
//console.log('VUEX: store', store);


</script>

<template>
    <default>
        <template v-slot:sidebar>
            Settings sidebar
        </template>

        Settings

        Devices

        <hr>
        <h4>BrowserSettings</h4>
        {{ browserSettings.data() }}
        <br>
        <input v-model="browserSettings.data().fontsize">
        <br>
        <input v-model="browserSettings.data().address.street">
        <br>
        <input v-model="browserSettings.data().address.city">
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


    </default>
</template>
