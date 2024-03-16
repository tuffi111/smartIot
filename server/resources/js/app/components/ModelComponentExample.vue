<script setup>

import {ref} from "vue";
import VueJsonPretty from "vue-json-pretty";

const props = defineProps({model: {}})
const newTag = ref();

function addTag(tag) {
    props.model.data().tags[tag] = tag
}

function removeTag(tag) {
    delete props.model.data().tags[tag]
}

</script>

<template>
    Theme: <input v-model="props.model.data().theme">
    <br>
    Type: <input v-model="props.model.data().type">
    <br>
    Address.Street: <input v-model="props.model.data().address.street">
    <br>
    Address.Zip: <input v-model="props.model.data().address.zip">
    <br>
    Address.City: <input v-model="props.model.data().address.city">
    <hr>
    Add Tag: <input v-model="newTag">
    <button @click="addTag(newTag)">Add</button>
    <ul>
        <li v-for="tag in props.model.data().tags">
            {{ tag }} [
            <button @click="removeTag(tag)">X</button>
            ]
        </li>
    </ul>
</template>


