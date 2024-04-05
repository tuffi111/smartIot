<script setup>
import 'vue-json-pretty/lib/styles.css';
import VueJsonPretty from "vue-json-pretty";
import {useSystem} from "@app/services/System.js";
import {
    ionAddCircleOutline,
    ionContrastOutline,
    ionRefreshCircleOutline,
    ionRemoveCircleOutline
} from "@quasar/extras/ionicons-v7";

const props = defineProps()
const System = useSystem()

</script>

<template>
    <h2>Admin / System / Dashboard</h2>


    System settings
    <vue-json-pretty :data="System.settings().data()" :deep="1"/>


    <q-item>
        <q-item-section>
            <q-btn title="Toggle dark/light mode" :icon="ionContrastOutline" @click="System.toggleTheme()"/>
        </q-item-section>

        <q-item-section>
            <q-btn title="Decrease fontsize" :icon="ionRemoveCircleOutline"
                   @click="System.stepFontSize(-1)"/>
        </q-item-section>

        <q-item-section>
            <q-btn title="Reset fontsize" :icon="ionRefreshCircleOutline"
                   @click="System.setFontSize(System.defaultFontsize())"></q-btn>
        </q-item-section>

        <q-item-section>
            <q-btn title="Increase fontsize" :icon="ionAddCircleOutline" @click="System.stepFontSize(1)"/>
        </q-item-section>
    </q-item>
</template>

