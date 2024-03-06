<script setup>
import ModelView from "@app/models/ModelView.vue";
import {ref} from "vue";
import {
    ionEyeOffOutline,
    ionEyeOutline,
    ionFingerPrint,
    ionMailOutline,
} from "@quasar/extras/ionicons-v7";

const props = defineProps({model: {}})
const showPass = ref(false);

</script>

<template>
    <model-view :model="model">
        <template v-slot="{ data }">
            <q-input name="email"
                     label="E-Mail"
                     hint="The eMail you used for registration"
                     v-model="data['email']"
                     :error="model.errors().has('email')"
                     :error-message="model.errors().for('email')"
                     :rules="model.validation('email')"
                     lazy-rules
                     class="q-pt-lg"
            >
                <template v-slot:prepend>
                    <q-icon :name="ionMailOutline"/>
                </template>
            </q-input>

            <q-input name="password"
                     label="Password"
                     :type="showPass?'text':'password'"
                     v-model="data['password']"
                     :error="model.errors().has('password')"
                     :error-message="model.errors().for('password')"
                     :rules="model.validation('password')"
                     lazy-rules
                     class="q-pt-lg"
            >
                <template v-slot:prepend>
                    <q-icon :name="ionFingerPrint"/>
                </template>
                <template v-slot:append>
                    <q-icon v-if="!showPass" title="Show password" :name="ionEyeOutline"
                            @click="showPass=!showPass"/>
                    <q-icon v-if="showPass" title="Hide password" :name="ionEyeOffOutline"
                            @click="showPass=!showPass"/>
                </template>
            </q-input>
        </template>
    </model-view>

</template>
