<script setup>
import {reactive, watch} from "vue"

const props = defineProps({modelValue: {}})
const emit = defineEmits(['update:modelValue'])
const data = reactive(Object.assign({}, props.modelValue))
watch(data, (event, payload) => emit('update:modelValue', payload), {deep: true})
</script>


<template>
  <div>
    <slot :data="data">
      Wert1: {{ data.wert1 }}<br>
      Wert2: <input type="text" v-model="data.wert2">
      === {{ data.wert2 }}
      <hr>
      {{ data }}<br>
      <hr>
      Slot
    </slot>
  </div>
</template>
