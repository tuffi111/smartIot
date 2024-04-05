<script setup>
import Default from "@app/layouts/Default.vue";
import {
    ionConstructOutline,
    ionFingerPrintOutline,
    ionHardwareChipOutline,
    ionLockOpenOutline,
    ionPeopleOutline,
    ionVideocamOutline
} from "@quasar/extras/ionicons-v7";



</script>

<template>
    <default>

        <!-- SIDEBAR -->
        <template v-slot:sidebar>
            <q-list>
                <q-item-label header>User</q-item-label>

                <q-item to="/admin/users" v-close-popup>
                    <q-item-section avatar>
                        <q-avatar :icon="ionPeopleOutline"/>
                    </q-item-section>
                    <q-item-section>
                        <q-item-label>List</q-item-label>
                    </q-item-section>
                    <q-item-section side></q-item-section>
                </q-item>


                <q-item to="/admin/users/permissions">
                    <q-item-section avatar>
                        <q-avatar :icon="ionLockOpenOutline"/>
                    </q-item-section>
                    <q-item-section>
                        <q-item-label>Permissions</q-item-label>
                    </q-item-section>
                    <q-item-section side></q-item-section>
                </q-item>

                <q-item to="/admin/users/roles">
                    <q-item-section avatar>
                        <q-avatar :icon="ionVideocamOutline"/>
                    </q-item-section>
                    <q-item-section>
                        <q-item-label>Roles</q-item-label>
                    </q-item-section>
                    <q-item-section side></q-item-section>
                </q-item>


                <q-separator inset spaced/>

                <q-item-label header>System</q-item-label>
                <q-item to="/admin/system">
                    <q-item-section avatar>
                        <q-avatar :icon="ionConstructOutline"/>
                    </q-item-section>
                    <q-item-section>
                        <q-item-label>Dashboard</q-item-label>
                    </q-item-section>
                    <q-item-section side>
                    </q-item-section>
                </q-item>

                <q-item to="/admin/system/oauth">
                    <q-item-section avatar>
                        <q-avatar :icon="ionFingerPrintOutline"/>
                    </q-item-section>
                    <q-item-section>
                        <q-item-label>OAuth</q-item-label>
                    </q-item-section>
                    <q-item-section side>
                    </q-item-section>
                </q-item>

                <q-item to="/admin/examples">
                    <q-item-section avatar>
                        <q-avatar :icon="ionHardwareChipOutline"/>
                    </q-item-section>
                    <q-item-section>
                        <q-item-label>Examples</q-item-label>
                    </q-item-section>
                    <q-item-section side>
                    </q-item-section>
                </q-item>
            </q-list>
        </template>


        <!-- FOOTER -->
        <template v-slot:footer>
        </template>

        <!-- CONTENT -->
        <router-view/>

    </default>
</template>

