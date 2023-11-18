<script setup>
import {onBeforeMount, ref} from "vue";
import LampBody from "@/components/LampBody.vue";
import JsonData from '../../../data.json';
import Default from "@/layouts/Default.vue";


const props = defineProps()

const lampCount = 6;
const pixelsPerLampCount = 7;
const pixelsPerLamp = ref(JsonData);
const lamps = ref({});


for (let l = 0; l < lampCount; l++) {
  let lampPixels = {};
  for (let p = 0; p < pixelsPerLampCount; p++) {
    lampPixels[p] = pixelsPerLamp.value[(l * pixelsPerLampCount) + p];
  }
  lamps.value[l] = lampPixels;
}


/*
const gateway = `ws://${window.location.hostname}/ws`;

console.log('WS: Trying to open a WebSocket connection...', gateway);
const websocket = new WebSocket(gateway);
websocket.onopen = () => {
  console.log('WS: onopen', arguments)
};
websocket.onclose = () => {
  console.log('WS: onclose', arguments)
};
websocket.onmessage = () => {
  console.log('WS: onmessage', arguments)
};

onBeforeMount(() => {

FormData

fetch('/get', {
  method: 'GET',
}).then((response) => {
  console.log('/get response', response)
  return response.json();
}).then((data) => {
  console.log('/get response parsed', data)
  pixelsPerLamp.value = data;
}).catch((error) => {
  console.error('/get response error', error)
});
});

/**/

function submit() {

  console.log('SUBMIT', lamps.value)
  let data = {};
  for (let lamp in lamps.value) {
    console.log('Lamp', lamp, lamps.value[lamp])
    for (let pixel in lamps.value[lamp]) {
      let idx = parseInt(lamp * pixelsPerLampCount) + parseInt(pixel);
      console.log('Pixel', pixel, idx, lamps.value[lamp][pixel])
      data[idx] = lamps.value[lamp][pixel];
    }
  }

  console.log('SUBMIT', data)

  fetch('/set', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(data)
  }).then(() => {
    console.log('RESPONSE', arguments)

  }).catch(() => {
    console.error('RESPONSE ERROR', arguments)
  });

}

function getPixelsForLamp(pixels, lamp) {
  let idx = lamp * pixelsPerLampCount;
  let result = {};
  for (let i = 0; i < pixelsPerLampCount; i++) {
    result[i] = pixels[idx + i] ?? 0;
  }

  return result;
}

function onchange(lamp, pixel, color) {
  pixelsPerLamp.value[lamp.value][pixel.value] = color.value;
}

</script>

<template>

    <div class="row">
      <div v-for="(pixels, lamp) in lamps" class="col">
        <lamp-body :idx="parseInt(lamp)" :pixels="pixels"/>
      </div>
    </div>

    <button @click="submit">Save</button>
</template>

