<script setup>
import {onBeforeMount} from "vue";
import {useStore} from 'vuex'
import {MyModel} from "@/models/MyModel.js";
import {MyApiModel} from "@/models/MyApiModel.js";
import VueJsonPretty from 'vue-json-pretty';
import 'vue-json-pretty/lib/styles.css';
import ModelView from "@/components/ModelView.vue";
import ModelComponentExample from "@/components/ModelComponentExample.vue";

const store = useStore()
const FormData = new MyModel()
const FormDataApi = new MyApiModel({wert: 123})

onBeforeMount(() => {
    FormDataApi.fetch()
});

</script>
<template>
    <h2>Form/Model</h2>
    <h3>Example 1</h3>
    <h4>Local</h4>
    <model-view :model="FormData">
        <template v-slot="{ data }">
            Wert: <input type="text" v-model="data.wert">
            ===&gt; {{ data.wert }}
        </template>
    </model-view>

    <h4>Api</h4>
    <model-view :model="FormDataApi">
        <template v-slot="{ data }">
            Wert: <input type="text" v-model="data.wert">
            ===&gt; {{ data.wert }}
        </template>
    </model-view>


    <h3>Example 2</h3>
    <h4>Local</h4>
    <model-component-example :model="FormData"></model-component-example>

    <h4>Api</h4>
    <model-component-example :model="FormDataApi"></model-component-example>

    <h2>Store</h2>
    Global vuex store state:<br>
    <vue-json-pretty :data="store.state"/>
    <hr>
    Global vuex store state via model:<br>
    <vue-json-pretty :data="FormData.store().state"/>
</template>
