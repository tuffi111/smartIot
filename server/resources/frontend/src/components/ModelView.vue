<script setup>
import ModelData from "@app/models/ModelData.vue";
const props = defineProps({model: {}})
</script>

<template>
  <!-- rewrite model prop to v-model -->
  <model-data v-model="model.data" @update:modelValue="model.update($event)">
    <!-- Populate model data -->
    <template v-slot="{ data }">
      <slot :data="data">
      </slot>
    </template>
  </model-data>
</template>
