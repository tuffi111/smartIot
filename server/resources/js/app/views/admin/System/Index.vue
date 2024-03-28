<script setup>
import {useQuasar} from "quasar";
import {useSystem} from "@app/services/System.js";
import {
    ionAddCircleOutline,
    ionContrastOutline,
    ionRefreshCircleOutline,
    ionRemoveCircleOutline
} from "@quasar/extras/ionicons-v7";


const System = useSystem('admin/system/index', useQuasar())


const props = defineProps()

</script>

<template>
    <h2>Admin / System / Dashboard</h2>

    {{ System.settings().get() }}
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

