<script setup>

import {ref} from "vue";
import VueJsonPretty from "vue-json-pretty";

const props = defineProps({model: {}})
const newTag = ref();

function addTag(tag) {
  props.model.data['tagList'][tag] = tag
}

function removeTag(tag) {
  delete props.model.data['tagList'][tag]
}

</script>

<template>
  Test Tag: <input v-model="props.model.data['testTag']">
  <br>
  Add Tag: <input v-model="newTag">
  <button @click="addTag(newTag)">Add</button>
  <ul>
    <li v-for="tag in props.model.data['tagList']">
      {{ tag }} [
      <button @click="removeTag(tag)">X</button>
      ]
    </li>
  </ul>
  model Data: <vue-json-pretty :data="props.model.data" />
</template>


