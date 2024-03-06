<script setup>
import ModelView from "@app/models/ModelView.vue";
import {passwordValidation} from "@app/rules/password";
import {ref} from "vue";
import {
    ionPerson,
    ionEyeOffOutline,
    ionEyeOutline,
    ionFingerPrint,
    ionMailOutline,
    ionRefresh, ionCloseOutline, ionCheckmarkOutline
} from "@quasar/extras/ionicons-v7";
import {Model} from "@app/models/Model.js";

const props = defineProps({model: {type: Model, required: true, default: new Model({})}})
const showPass = ref(false);

</script>

<template>
    <model-view :model="model">
        <template v-slot="{ data }">

            <div class="row q-mt-md">
                <div class="col">
                    <q-input name="email"
                             label="E-Mail"
                             v-model="data['email']"
                             hint="The eMail you used for registration"
                             :error="model.errors().has('email')"
                             :error-message="model.errors().for('email')"
                             :rules="model.validation('email')"
                             @update:model="model.errors().reset()"
                    >
                        <template v-slot:prepend>
                            <q-icon :name="ionMailOutline"/>
                        </template>
                    </q-input>
                </div>
            </div>


            <div class="row items-start flex-column flex-wrap q-mt-xl">
                <div class="col-12 col-sm-6">
                    <q-input name="firstname"
                             label="First name"
                             v-model="data['firstname']"
                             hint="Name your account"
                             :error="model.errors().has('firstname')"
                             :error-message="model.errors().for('firstname')"
                             :rules="model.validation('firstname')"
                             class="q-pr-sm-sm"
                    >
                        <template v-slot:prepend>
                            <q-icon :name="ionPerson"/>
                        </template>
                    </q-input>
                </div>
                <div class="col-12 col-sm-6 q-pl-sm-xl q-pt-sm-none q-pt-xl">
                    <q-input name="lastname"
                             label="Last name"
                             v-model="data['lastname']"
                             :error="model.errors().has('lastname')"
                             :error-message="model.errors().for('lastname')"
                             :rules="model.validation('lastname')"
                    >
                        <template v-slot:prepend>
                            <q-icon :name="ionPerson"/>
                        </template>
                    </q-input>
                </div>
            </div>


            <div class="row items-start flex-column flex-wrap q-mt-xl">
                <div class="col-12 col-sm-6">
                    <div class="row">
                        <div class="col">
                            <q-input name="password"
                                     label="Password"
                                     v-model="data['password']"
                                     :type="showPass?'text':'password'"
                                     :error="model.errors().has('password')"
                                     :error-message="model.errors().for('password')"
                                     :rules="model.validation('password')"
                                     class="col-6"
                            >
                                <template v-slot:prepend>
                                    <q-icon :name="ionFingerPrint"/>
                                </template>
                                <template v-slot:append>
                                    <q-icon v-if="!showPass" title="Show password" :name="ionEyeOutline"
                                            @click.prevent="showPass=!showPass"/>
                                    <q-icon v-if="showPass" title="Hide password"
                                            :name="ionEyeOffOutline"
                                            @click.prevent="showPass=!showPass"/>
                                </template>
                            </q-input>
                        </div>
                    </div>

                    <div class="row q-mt-xl q-mt-sm-xl">
                        <div class="col">

                            <q-input name="password_confirmation"
                                     label="Confirm password"
                                     type="password"
                                     v-model="data['password_confirmation']"
                                     :error="model.errors().has('password_confirmation')"
                                     :error-message="model.errors().for('password_confirmation')"
                                     :rules="model.validation('password_confirmation')"
                                     class=""
                            >
                                <template v-slot:prepend>
                                    <q-icon :name="ionRefresh"/>
                                </template>
                                <template v-slot:append>
                                </template>
                            </q-input>

                        </div>
                    </div>
                </div>

                <div class="col-12 col-sm-6 q-pl-sm-xl q-pt-lg q-pt-sm-none">
                    <q-card class="my-card q-pa-sm">
                        <div class="text-subtitle1 q-mb-md">Password Criteria</div>
                        <div v-if="passwordValidation.hasLength" class="q-mb-sm">
                            <q-icon v-if="passwordValidation.length"
                                    :name="ionCheckmarkOutline"
                                    color="positive"/>
                            <q-icon v-else
                                    :name="ionCloseOutline"
                                    color="negative"
                                    size="15px"/>
                            Must be at least {{ passwordValidation.hasLength }} characters long.
                        </div>
                        <div v-if="passwordValidation.hasCapital" class="q-mb-sm">
                            <q-icon v-if="passwordValidation.capital" :name="ionCheckmarkOutline"
                                    color="positive"/>
                            <q-icon v-else :name="ionCloseOutline" color="negative"/>
                            Must contain at least one capital letter.
                        </div>
                        <div v-if="passwordValidation.hasNumber" class="q-mb-sm">
                            <q-icon v-if="passwordValidation.number" :name="ionCheckmarkOutline"
                                    color="positive"/>
                            <q-icon v-else :name="ionCloseOutline" color="negative"/>
                            Must contain at least one number.
                        </div>
                        <div v-if="passwordValidation.hasSymbol" class="q-mb-sm">
                            <q-icon v-if="passwordValidation.symbol" :name="ionCheckmarkOutline"
                                    color="positive"/>
                            <q-icon v-else :name="ionCloseOutline" color="negative"/>
                            Must contain at least one symbol.
                        </div>
                    </q-card>
                </div>
            </div>


            <div class="row q-mt-xl q-mt-sm-xl">
                <div class="col">
                    <q-field
                        name="accepted"
                        v-model="data['accepted']"
                        :rules="model.validation('accepted')"
                    >
                        <q-option-group :options="[{ label: 'AGB', value: 'agb'},{ label: 'Marketing', value: 'ads'}]"
                                        v-model="data['accepted']"
                                        label="Notifications"
                                        type="checkbox"
                        />
                    </q-field>
                </div>
            </div>
        </template>
    </model-view>

</template>
