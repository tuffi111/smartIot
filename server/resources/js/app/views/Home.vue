<script setup>
import Default from "@app/layouts/Default.vue";
import {
    ionAppsOutline, ionChevronDownOutline,
    ionDocumentOutline,
    ionFolderOutline,
    ionHardwareChipOutline,
    ionHelpCircleOutline,
    ionSearchCircleOutline
} from "@quasar/extras/ionicons-v7";
import {reactive} from "vue";

const permissions = reactive([]);


</script>

<template>
    <default>

        <!-- SIDEBAR -->
        <template v-slot:sidebar>
            <q-list>
                <q-item-label header>Folders</q-item-label>
                <q-item v-for="n in 3" :key="`x.${n}`" clickable v-close-popup tabindex="0">
                    <q-item-section avatar>
                        <q-avatar :icon="ionFolderOutline" color="secondary" text-color="white"/>
                    </q-item-section>
                    <q-item-section>
                        <q-item-label>Photos</q-item-label>
                        <q-item-label caption>February 22, 2016</q-item-label>
                    </q-item-section>
                    <q-item-section side>
                        <q-icon :name="ionHelpCircleOutline"/>
                    </q-item-section>
                </q-item>
                <q-separator inset spaced/>
                <q-item-label header>Files</q-item-label>
                <q-item v-for="n in 3" :key="`y.${n}`" clickable v-close-popup tabindex="0">
                    <q-item-section avatar>
                        <q-avatar :icon="ionDocumentOutline" color="primary" text-color="white"/>
                    </q-item-section>
                    <q-item-section>
                        <q-item-label>Vacation</q-item-label>
                        <q-item-label caption>February 22, 2016</q-item-label>
                    </q-item-section>
                    <q-item-section side>
                        <q-icon :name="ionHelpCircleOutline"/>
                    </q-item-section>
                </q-item>
            </q-list>
        </template>


        <!-- MENU DROPDOWN -->
        <template v-slot:menu>
            <q-btn-dropdown label="Home"
                            stretch
                            flat
                            transition-show="jump-down"
                            transition-hide="jump-down"
                            style="margin-right: 0; "
                            :dropdown-icon="ionChevronDownOutline"

            >
                <q-list>
                    <q-item-label header>Folders</q-item-label>
                    <q-item v-for="n in 3" :key="`x.${n}`" clickable v-close-popup tabindex="0">
                        <q-item-section avatar>
                            <q-avatar :icon="ionFolderOutline" color="secondary" text-color="white"/>
                        </q-item-section>
                        <q-item-section>
                            <q-item-label>Photos</q-item-label>
                            <q-item-label caption>February 22, 2016</q-item-label>
                        </q-item-section>
                        <q-item-section side>
                            <q-icon :name="ionHelpCircleOutline"/>
                        </q-item-section>
                    </q-item>
                    <q-separator inset spaced/>
                    <q-item-label header>Files</q-item-label>
                    <q-item v-for="n in 3" :key="`y.${n}`" clickable v-close-popup tabindex="0">
                        <q-item-section avatar>
                            <q-avatar :icon="ionDocumentOutline" color="primary" text-color="white"/>
                        </q-item-section>
                        <q-item-section>
                            <q-item-label>Vacation</q-item-label>
                            <q-item-label caption>February 22, 2016</q-item-label>
                        </q-item-section>
                        <q-item-section side>
                            <q-icon :name="ionHelpCircleOutline"/>
                        </q-item-section>
                    </q-item>
                </q-list>
            </q-btn-dropdown>
        </template>

        <!-- FOOTER -->
        <template v-slot:footer>
            <q-tabs align="center" stretch>
                <q-route-tab to="/devices" label="Devices" :icon="ionHardwareChipOutline"/>
                <q-route-tab to="/examples" label="Examples" :icon="ionSearchCircleOutline"/>
                <q-route-tab to="/scenarios" label="Scenarios" :icon="ionAppsOutline"/>
            </q-tabs>

        </template>

        <!-- CONTENT -->
        <router-view/>

    </default>
</template>

