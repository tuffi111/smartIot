<script setup>
import ModelData from "@/models/ModelData.vue";
import {Model} from "@/models/Model.js";

const props = defineProps({model: { type: Model, required: true, default: new Model() }})
let modelData = props.model.data();
</script>

<template>
    <!-- rewrite model prop to v-model -->
    <model-data v-model="modelData" @update:modelValue="model.set($event)">
        <!-- Populate model data -->
        <template v-slot="{ data }">
            <slot :data="data">
            </slot>
        </template>
    </model-data>
</template>
