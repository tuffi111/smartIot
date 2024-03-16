<script setup>
import {reactive, watch} from "vue"
const props = defineProps({modelValue: {}})
const emit = defineEmits(['update:modelValue'])
const data = reactive(Object.assign({}, props.modelValue))
watch(data, (event, payload) => emit('update:modelValue', payload), {deep: true})
</script>

<template>
    <slot :data="data">
    </slot>
</template>
