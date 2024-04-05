<!-- todo: Issue: left drawer expands to top of screen on "devices < pad" (=mobile) devices.
        This overlaps the header menu and makes drawer closing impossible if left drawer is
        expanded to/beyond is max width in viewport.
        -> reduce left drawer top to menu bottom; as in all other views (>mobile = pad/desktop/screen).
        -> reduce left drawer width to max viewport width - resize-handle-width
-->
<script setup>
import {onMounted, ref, useSlots} from 'vue'
import {useRouter} from "vue-router"
import {logout, can, isAuth} from "@/auth.js"
import System from "@app/services/System.js";
import {useQuasar} from "quasar";

import {
    ionAddCircleOutline,
    ionContrastOutline,
    ionHomeOutline,
    ionInformationCircleOutline,
    ionMailOutline,
    ionMenuOutline,
    ionPowerOutline,
    ionRefreshCircleOutline,
    ionRemoveCircleOutline,
    ionSettingsOutline,
    ionWarningOutline
} from "@quasar/extras/ionicons-v7"


// Should be set in a component and not in main.js because: useQuasar() returns null in main.js
const system = System.setup(useQuasar()).load()


const router = useRouter()
const slots = useSlots()
const leftDrawerOpen = ref(false)
const rightDrawerOpen = ref(false)
const leftDrawerWidth = ref(300)
let drawerWidth = leftDrawerWidth
let initialLeftDrawerWidth

function toggleLeftDrawer() {
    leftDrawerOpen.value = !leftDrawerOpen.value
}

function toggleRightDrawer() {
    rightDrawerOpen.value = !rightDrawerOpen.value
}

function closeRightDrawer() {
    rightDrawerOpen.value = false
}


function resizeDrawer(ev) {
    if (ev.isFirst === true) {
        initialLeftDrawerWidth = leftDrawerWidth.value
    }
    leftDrawerWidth.value = initialLeftDrawerWidth + ev.offset.x
}

async function sendLogout() {

    logout()
        .then((data) => {
            console.debug('Logout successful', data);
        })
        .catch((error) => {
            console.error('Logout error', error);
        })
        .finally(() => {
            router.push('/login')
        })
}

onMounted(() => {

})


</script>


<template>
    <q-layout view="hHh LpR fFr">

        <q-header bordered class="bg-primary text-white shadow-0" height-hint="98">
            <q-toolbar>

                <q-btn flat to="/">
                    <q-avatar :icon="ionHomeOutline" size="26px"/>
                </q-btn>

                <q-btn v-if="slots.sidebar" dense flat round auto-close :icon="ionMenuOutline"
                       @click="toggleLeftDrawer"/>

                <div v-if="slots.menu">
                    <slot name="menu"/>
                </div>
                <q-space/>

                <div v-if="isAuth()" class="">
                    <q-btn v-if="can('notifications')"
                           round flat
                           class="q-ma-lg"
                           style="margin-left: 0;margin-top: 0;margin-bottom: 0;"
                    >
                        <q-avatar :icon="ionMailOutline" size="26px">
                            <q-badge color="red" floating transparent>
                                3
                            </q-badge>
                        </q-avatar>


                        <q-menu auto-close
                                transition-show="jump-down"
                                transition-hide="jump-up"
                                style="margin: 0; padding: 0;"
                        >

                            <q-list class="">
                                <q-item-label header>
                                    Notifications
                                </q-item-label>
                                <q-item v-for="n in 3" :key="`x.${n}`" clickable v-close-popup tabindex="0" class="">
                                    <q-item-section avatar>
                                        <q-avatar :icon="ionWarningOutline" color="warning"/>
                                    </q-item-section>
                                    <q-item-section>
                                        <q-item-label>
                                            [{{ n }}/3] Warning !
                                        </q-item-label>
                                        <q-item-label caption style="max-width: 550px;">
                                            <strong>February 22, 2016 22:33:44</strong> |
                                            Error message here Error message here
                                            Error message here Error message here
                                            Error message here Error message here
                                            Error message here Error message here
                                            Error message here Error message here
                                            Error message here Error message here
                                            Error message here Error message here
                                            Error message here Error message here
                                            Error message here Error message here
                                            Error message here Error message here
                                            Error message here Error message here
                                            Error message here Error message here
                                            Error message here Error message here
                                            Error message here Error message here
                                        </q-item-label>
                                    </q-item-section>
                                </q-item>
                            </q-list>
                        </q-menu>
                    </q-btn>

                    <q-btn dense flat round auto-close @click="toggleRightDrawer">
                        <q-avatar size="38px">
                            <img src="../assets/avatar4.jpg" alt="Avatar">
                        </q-avatar>
                    </q-btn>
                </div>

                <div v-else>
                    <q-btn label="Login" to="/login" stretch flat/>
                    <q-btn label="Logout" @click="sendLogout" stretch flat/>
                    <q-btn label="Register" to="/register" stretch flat/>
                </div>
            </q-toolbar>

        </q-header>

        <!-- LEFT drawer content -->
        <q-drawer v-if="slots.sidebar" v-model="leftDrawerOpen" :width="drawerWidth" side="left" show-if-above bordered>
            <slot name="sidebar"/>
            <div v-touch-pan.preserveCursor.prevent.mouse.horizontal="resizeDrawer" class="q-drawer__resizer"></div>
        </q-drawer>

        <!-- RIGHT drawer content -->
        <q-drawer
            v-model="rightDrawerOpen"
            auto-close
            v-close-popup
            side="right"
            overlay
            bordered
        >
            <q-scroll-area style="height: calc(100% - 150px);">
                <q-list padding>
                    <q-item>
                        <q-item-section avatar>
                            <q-avatar size="38px" title="User avatar">
                                <img src="../assets/avatar4.jpg" alt="Avatar">
                            </q-avatar>
                        </q-item-section>
                        <q-item-section>
                            <q-item-label>John Doe</q-item-label>
                            <q-item-label caption>
                                Admin
                            </q-item-label>
                        </q-item-section>
                    </q-item>

                    <q-item>

                        <q-item-section>
                            <q-btn title="Toggle dark/light mode" :icon="ionContrastOutline"
                                   @click="system.toggleTheme()"/>
                        </q-item-section>

                        <q-item-section>
                            <q-btn title="Decrease fontsize" :icon="ionRemoveCircleOutline"
                                   @click="system.stepFontSize(-1)"/>
                        </q-item-section>
                        <q-item-section>
                            <q-btn title="Reset fontsize" :icon="ionRefreshCircleOutline"
                                   @click="system.setFontSize(System.defaultFontsize())"></q-btn>
                        </q-item-section>

                        <q-item-section>
                            <q-btn title="Increase fontsize" :icon="ionAddCircleOutline"
                                   @click="system.stepFontSize(1)"/>
                        </q-item-section>


                    </q-item>

                    <q-separator/>

                    <q-item v-if="can('settings')" clickable v-ripple to="/admin">
                        <q-item-section avatar>
                            <q-icon title="Settings" :name="ionSettingsOutline"/>
                        </q-item-section>
                        <q-item-section>
                            Settings
                        </q-item-section>
                    </q-item>

                    <q-item v-if="can('about')" clickable v-ripple to="/about">
                        <q-item-section avatar>
                            <q-icon title="About" :name="ionInformationCircleOutline"/>
                        </q-item-section>
                        <q-item-section>
                            About
                        </q-item-section>
                    </q-item>

                    <q-separator></q-separator>

                    <q-item clickable v-ripple
                            @click="sendLogout">
                        <q-item-section avatar>
                            <q-icon title="Logout" :name="ionPowerOutline"/>
                        </q-item-section>

                        <q-item-section>
                            Logout
                        </q-item-section>
                    </q-item>

                </q-list>
            </q-scroll-area>
        </q-drawer>

        <!-- PAGE CONTENT-->
        <q-page-container class="q-ma-md" @click="closeRightDrawer">
            <slot @click="closeRightDrawer"></slot>
        </q-page-container>


        <!-- FOOTER-->
        <q-footer v-if="slots.footer" elevated class="bg-grey-10 text-white" @click="closeRightDrawer">
            <slot name="footer" @click="closeRightDrawer"/>
        </q-footer>
    </q-layout>
</template>


<style lang="sass">
a.q-tab.q-tab--active
    .q-tab__content
        color: $accent

    .q-tab__indicator
        background: $accent
</style>

<style scoped lang="sass">
.q-drawer__resizer
    position: absolute
    top: 0
    bottom: 0
    right: -2px
    width: 1px
    background-color: $dark
    cursor: ew-resize

    &:after
        content: ''
        position: absolute
        top: 50%
        height: 30px
        left: -10px
        right: -10px
        transform: translateY(-50%)
        background-color: inherit
        border-radius: 10px
</style>
