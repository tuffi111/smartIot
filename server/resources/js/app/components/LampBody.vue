<script setup>
import LampPixel from "./LampPixel.vue";
import {ref} from "vue";

const emits = defineEmits(['change'])

const props = defineProps({
  idx: {
    type: Number,
    required: false
  },
  pixels: {
    type: Object,
    required: false
  }
})

const pixelData = ref(Object.assign({}, props.pixels));


function onchange(pixel, color) {
  pixelData.value[pixel.value] = color.value;
  //emits('change', lamp, pixel, colorData);
}

</script>

<template>
  <h3>Lamp {{ idx }}</h3>
  <table class="table" style="">
    <tr>
      <th>

      </th>
      <th>

        <LampPixel :color="pixelData[1]" :idx="1" :lamp="props.idx" @change="onchange" />

      </th>
      <th>

      </th>
    </tr>

    <tr>
      <th>

        <LampPixel :color="pixelData[6]" :idx="6" :lamp="props.idx" @change="onchange" />

      </th>
      <th>

      </th>
      <th>

        <LampPixel :color="pixelData[2]" :idx="2" :lamp="props.idx" @change="onchange" />

      </th>
    </tr>

    <tr>
      <th>

      </th>
      <th>

        <LampPixel :color="pixelData[0]" :idx="0" :lamp="props.idx" @change="onchange" />

      </th>
      <th>

      </th>
    </tr>

    <tr>
      <th>

        <LampPixel :color="pixelData[5]" :idx="5" :lamp="props.idx" @change="onchange" />

      </th>
      <th>

      </th>
      <th>

        <LampPixel :color="pixelData[3]" :idx="3" :lamp="props.idx" @change="onchange" />

      </th>
    </tr>

    <tr>
      <th>

      </th>
      <th>

        <LampPixel :color="pixelData[4]" :idx="4" :lamp="props.idx" @change="onchange" />

      </th>
      <th>

      </th>
    </tr>
  </table>
</template>

<style scoped>
table {
  display: table;
  border: 1px solid;

  tr {
    display: table-row;
    height: 20px;
    border: 1px solid;

    th {
      display: table-cell;
      width: 20px;
      min-width: 20px;
      border: 1px solid;
    }
  }
}
</style>