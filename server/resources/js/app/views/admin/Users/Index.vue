<script setup>

import {ref} from "vue";
import {ionSearch} from "@quasar/extras/ionicons-v7";
import {User} from "@app/models/User.js";

const rows = [
    {
        name: 'Frozen Yogurt',
        calories: 159,
        fat: 6.0,
        carbs: 24,
        protein: 4.0
    },
    {
        name: 'Ice cream sandwich',
        calories: 237,
        fat: 9.0,
        carbs: 37,
        protein: 4.3
    },
    {
        name: 'Eclair',
        calories: 262,
        fat: 16.0,
        carbs: 23,
        protein: 6.0
    },
    {
        name: 'Cupcake',
        calories: 305,
        fat: 3.7,
        carbs: 67,
        protein: 4.3
    },
    {
        name: 'Gingerbread',
        calories: 356,
        fat: 16.0,
        carbs: 49,
        protein: 3.9
    },
    {
        name: 'Jelly bean',
        calories: 375,
        fat: 0.0,
        carbs: 94,
        protein: 0.0
    },
    {
        name: 'Lollipop',
        calories: 392,
        fat: 0.2,
        carbs: 98,
        protein: 0
    },
    {
        name: 'Honeycomb',
        calories: 408,
        fat: 3.2,
        carbs: 87,
        protein: 6.5
    },
    {
        name: 'Donut',
        calories: 452,
        fat: 25.0,
        carbs: 51,
        protein: 4.9
    },
    {
        name: 'KitKat',
        calories: 518,
        fat: 26.0,
        carbs: 65,
        protein: 7
    }, {
        name: 'Frozen Yogurt',
        calories: 159,
        fat: 6.0,
        carbs: 24,
        protein: 4.0
    },
    {
        name: 'Ice cream sandwich',
        calories: 237,
        fat: 9.0,
        carbs: 37,
        protein: 4.3
    },
    {
        name: 'Eclair',
        calories: 262,
        fat: 16.0,
        carbs: 23,
        protein: 6.0
    },
    {
        name: 'Cupcake',
        calories: 305,
        fat: 3.7,
        carbs: 67,
        protein: 4.3
    },
    {
        name: 'Gingerbread',
        calories: 356,
        fat: 16.0,
        carbs: 49,
        protein: 3.9
    },
    {
        name: 'Jelly bean',
        calories: 375,
        fat: 0.0,
        carbs: 94,
        protein: 0.0
    },
    {
        name: 'Lollipop',
        calories: 392,
        fat: 0.2,
        carbs: 98,
        protein: 0
    },
    {
        name: 'Honeycomb',
        calories: 408,
        fat: 3.2,
        carbs: 87,
        protein: 6.5
    },
    {
        name: 'Donut',
        calories: 452,
        fat: 25.0,
        carbs: 51,
        protein: 4.9
    },
    {
        name: 'KitKat',
        calories: 518,
        fat: 26.0,
        carbs: 65,
        protein: 7
    }
]


const columns = [
    {
        name: 'desc',
        required: true,
        label: 'Dessert (100g serving)',
        align: 'left',
        field: row => row.name,
        format: val => `${val}`,
        sortable: true
    },
    {name: 'calories', align: 'center', label: 'Calories', field: 'calories', sortable: true},
    {name: 'fat', label: 'Fat (g)', field: 'fat', sortable: true},
    {name: 'carbs', label: 'Carbs (g)', field: 'carbs'},
    {name: 'protein', label: 'Protein (g)', field: 'protein'}
]

const pagination = ref({
    sortBy: 'desc',
    descending: false,
    page: 1,
    rowsPerPage: 3,
    rowsNumber: 10
})
const separator = ref('cell')
const visibleColumns = ref(['calories', 'desc', 'fat', 'carbs', 'protein', 'sodium', 'calcium', 'iron'])
const loading = ref(false)
const filter= ref('')

const user = new User().all()

console.log()


</script>

<template>
    <h2>Admin / Users / List</h2>

    <q-table
        title="Users"
        no-data-label="I didn't find anything for you"
        :dense="$q.screen.lt.md"
        :grid="$q.screen.xs"
        :rows="rows"
        row-key="id"
        :columns="columns"
        :visible-columns="visibleColumns"
        :pagination="pagination"
        :separator="separator"
        :loading="loading"
        :filter="filter"
        :virtual-scroll-sticky-size-start="48"
        binary-state-sort
        virtual-scroll
        flat bordered
        class="my-sticky-virtscroll-table"
        @request="onRequest"
    >
        <template v-slot:loading>
            <q-inner-loading showing color="primary"/>
        </template>
        <template v-slot:top>

            <q-btn color="primary" :disable="loading" label="Add User" @click="addRow"/>

            <q-space/>

            <q-input dense debounce="300" color="primary" v-model="filter">
                <template v-slot:append>
                    <q-btn :icon="ionSearch"/>
                </template>
            </q-input>


            <q-space/>

            <q-select
                v-model="visibleColumns"
                multiple
                outlined
                dense
                options-dense
                :display-value="$q.lang.table.columns"
                emit-value
                map-options
                :options="columns"
                option-value="name"
                options-cover
                style="min-width: 150px"
            />
        </template>

    </q-table>

</template>

<style scoped lang="sass">
</style>
