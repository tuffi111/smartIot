<!-- todo: Issue: left drawer expands to top of screen on "devices < pad" (=mobile) devices.
        This overlaps the header menu and makes drawer closing impossible if left drawer is
        expanded to/beyond is max width in viewport.
        -> reduce left drawer top to menu bottom; as in all other views (>mobile = pad/desktop/screen).
        -> reduce left drawer width to max viewport width - resize-handle-width
-->
<template>
    <q-layout view="hHh LpR fFr">

        <q-header bordered class="bg-primary text-white shadow-0" height-hint="98">
            <q-toolbar>

                <q-btn flat to="/">
                    <q-avatar icon="home" size="26px"/>
                </q-btn>

                <q-btn v-if="slots.sidebar" dense flat round auto-close icon="menu" @click="toggleLeftDrawer"/>

                <div v-if="slots.menu">
                    <slot name="menu"/>
                </div>
                <q-space/>

                <div v-if="isAuth" class="">
                    <q-btn round flat
                           class="q-ma-lg"
                           style="margin-left: 0;margin-top: 0;margin-bottom: 0;"
                    >
                        <q-avatar icon="email" size="26px">
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
                                        <q-avatar icon="warning" color="warning"/>
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

                    <q-btn dense flat round @click="toggleRightDrawer">
                        <q-avatar size="38px">
                            <img src="../assets/avatar4.jpg" alt="Avatar">
                        </q-avatar>
                    </q-btn>


                </div>
                <div v-else>
                    <q-btn label="Login" to="/login" stretch flat/>
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
                            <q-avatar size="38px">
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
                            <q-btn icon="light_mode" @click="toggleTheme"/>
                        </q-item-section>

                        <q-item-section>
                            <q-btn icon="text_increase" @click="stepFontSize(1)"/>
                        </q-item-section>

                        <q-item-section>
                            <q-btn @click="setFontSize(defaultFontsize)">1</q-btn>
                        </q-item-section>

                        <q-item-section>
                            <q-btn icon="text_decrease" @click="stepFontSize(-1)"/>
                        </q-item-section>
                    </q-item>

                    <q-separator/>

                    <q-item clickable v-ripple to="/settings">
                        <q-item-section avatar>
                            <q-icon name="settings"/>
                        </q-item-section>
                        <q-item-section>
                            Settings
                        </q-item-section>
                    </q-item>

                    <q-item clickable v-ripple to="/about">
                        <q-item-section avatar>
                            <q-icon name="info"/>
                        </q-item-section>
                        <q-item-section>
                            About
                        </q-item-section>
                    </q-item>

                    <q-separator></q-separator>

                    <q-item clickable v-ripple>
                        <q-item-section avatar>
                            <q-icon name="power_settings_new"/>
                        </q-item-section>

                        <q-item-section>
                            Logout
                        </q-item-section>
                    </q-item>

                </q-list>
            </q-scroll-area>
        </q-drawer>

        <!-- PAGE CONTENT-->
        <q-page-container class="q-ma-md">
            <slot></slot>
        </q-page-container>


        <!-- FOOTER-->
        <q-footer elevated class="bg-grey-10 text-white">
            <q-tabs align="center" stretch>
                <q-route-tab to="/devices" label="Devices" icon="devices"/>
                <q-route-tab to="/examples" label="Examples" icon="home"/>
                <q-route-tab to="/scenarios" label="Scenarios" icon="settings"/>
            </q-tabs>
        </q-footer>

    </q-layout>
</template>

<script>
import {useSlots, ref, onBeforeMount, onMounted} from 'vue'
import {useQuasar, setCssVar, getCssVar} from "quasar";
import {useStore} from "vuex";


export default {
    setup() {
        const slots = useSlots()
        const q = useQuasar();
        const store = useStore();
        const leftDrawerOpen = ref(false)
        const rightDrawerOpen = ref(false)
        let initialLeftDrawerWidth
        const leftDrawerWidth = ref(300)
        let defaultFontsize = 11;

        if (store.state.themeMode === undefined) {
            q.dark.set("auto")
            store.state.themeMode = q.dark.isActive
        } else {
            q.dark.set(store.state.themeMode)
        }

        function getContainerElements(selector = null) {
            return document.querySelectorAll(selector ?? ".q-page-container")
        }

        onMounted(() => {
            const list = getContainerElements();
            for (let index = 0; index < list.length; ++index) {
                const element = list[index]
                if (!store.state.fontsize) {
                    const compStyles = window.getComputedStyle(element)
                    let fontsize = parseInt(compStyles.getPropertyValue("font-size").replace(/\D/g, ''));
                    fontsize = (isNaN(fontsize) ? 0 : fontsize)
                    store.state.fontsize = fontsize
                    defaultFontsize = fontsize
                }
                element.style.fontSize = store.state.fontsize + "px"
            }
        })


        return {
            isAuth: true,
            leftDrawerOpen,
            toggleLeftDrawer() {
                leftDrawerOpen.value = !leftDrawerOpen.value
            },
            rightDrawerOpen,
            slots,
            toggleRightDrawer() {
                rightDrawerOpen.value = !rightDrawerOpen.value
            },
            drawerWidth: leftDrawerWidth,
            defaultFontsize,
            resizeDrawer(ev) {
                if (ev.isFirst === true) {
                    initialLeftDrawerWidth = leftDrawerWidth.value
                }
                leftDrawerWidth.value = initialLeftDrawerWidth + ev.offset.x
            },
            toggleTheme() {
                q.dark.set(!store.state.themeMode)
                store.state.themeMode = q.dark.isActive
            },
            stepFontSize(step = 1) {
                this.setFontSize(store.state.fontsize + step)
            },

            setFontSize(set) {
                store.state.fontsize = set
                const list = getContainerElements()
                for (let index = 0; index < list.length; ++index) {
                    list[index].style.fontSize = set + "px"
                }
            }
        }
    }
}
</script>


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
