<script setup>
import ModelData from "@app/models/ModelData.vue";
const props = defineProps({model: {}})
const modelData = props.model.data()
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
