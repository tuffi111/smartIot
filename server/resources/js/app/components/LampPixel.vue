<script setup>
import ModalContent from "@/components/ModalContent.vue";
import {ref} from "vue";

const emits = defineEmits(['change'])

const props = defineProps({
  idx: {
    type: Number,
    required: true
  },
  lamp: {
    type: Number,
    required: true
  },
  color: {
    type: Array,
    required: false
  },
})

const colorData = ref(props.color);
const isModalOpened = ref(false);
const lamp = ref(-1);
const pixel = ref(-1);
const color_r = ref(0)
const color_g = ref(0)
const color_b = ref(0)

const closeModal = () => {
  isModalOpened.value = false;
  console.log('CLOSE');
};

const showModal = (idx) => {
  pixel.value = idx;
  lamp.value = props.lamp;
  color_r.value = props.color[0];
  color_g.value = props.color[1];
  color_b.value = props.color[2];
  isModalOpened.value = true;
}

const onChange = () => {
  colorData.value[0] = color_r.value;
  colorData.value[1] = color_g.value;
  colorData.value[2] = color_b.value;
  //emits('change', pixel, colorData);
  closeModal();
}

</script>
<template>
  <div class="row">
    <div class="col text-center">
      <span @click="showModal(idx)" class="p-2" style="background-color: #00bd7e">
        [{{ idx }}]
      </span>
        <!--<span class="" style="font-size: 0.7em;">
          {{ colorData }}
        </span>-->
    </div>
  </div>


  <modal-content ref="modal" :isOpen="isModalOpened" @modal-close="closeModal">
    <template #header>
      Color of Lamp {{ lamp }} / Pixel {{ pixel }}
    </template>
    <template #body>
      <label for="color_r">
        R:
        <input type="number" min="0" max="255" id="color_r" v-model="color_r"/>
      </label>
      <label for="color_g">
        G:
        <input type="number" min="0" max="255" id="color_g" v-model="color_g"/>
      </label>
      <label for="color_b">
        B:
        <input type="number" min="0" max="255" id="color_b" v-model="color_b"/>
      </label>
    </template>
    <template #footer>
      <button @click="onChange">Change</button>
      <button @click="closeModal">Close</button>

    </template>
  </modal-content>


</template>
