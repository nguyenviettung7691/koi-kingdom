<script setup>
import { useFishCurrentLifecycle, useFishTotalLifetime, useFishImagePath } from '../composable/fish.js';
import { useTimeAgo, useDateFormat } from '@vueuse/core';
import { ClockIcon, CalendarIcon } from '@heroicons/vue/24/solid';
import { computed, ref } from 'vue';

const columnNames = [
    'ID',
    'Name',
    'Type',
    'Status',
    'Birthtime',
    'Lifetime(remain/maximum)',
    'Total lifetime',
    'Last fed',
    'Lifetime when fed',
    'Feed count'
];

const props = defineProps({
    fishes: Array,
    fishLifeCycles: Array
});

const columnModel = ref(columnNames);
const showFilter = ref(false);

const columnSelections = computed(() => {
    return columnModel.value.sort((a, b) => columnNames.indexOf(a) - columnNames.indexOf(b));
});

function getRowClass(index) {
    return ['border-b hover:bg-gray-300', index % 2 == 0 ? 'bg-white' : 'bg-gray-100'];
}

function getCellClass(col){
    return ['px-2 py-1 whitespace-nowrap'];
}

function mstoHour(ms) {
    return Math.round(ms / 1000 / 60 / 60);
}

function getLifetimePercent(remainLifetime, lifetime) {
    return (remainLifetime * 100) / lifetime;
}

function getLifecycle(f) {
    let totalLifetime = useFishTotalLifetime(f.birthtime).totalLifetime;
    return useFishCurrentLifecycle(f.alive, totalLifetime, props.fishLifeCycles).lifecycle;
}

</script>
<template>
    <div class="fish-list-container bg-white text-black bg-cyan-800 max-md:h-5 overflow-y-scroll max-md:py-2 px-5 py-20">
        <div class="text-xl">Fish List</div>
        <div v-if="fishes.length == 0">
            <div id="alert-additional-content-1"
                class="p-4 mb-4 text-blue-800 border border-blue-300 rounded-lg bg-blue-50 dark:bg-gray-800 dark:text-blue-400 dark:border-blue-800"
                role="alert">
                <div class="flex items-center">
                    <svg class="flex-shrink-0 w-4 h-4 mr-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor" viewBox="0 0 20 20">
                        <path
                            d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
                    </svg>
                    <span class="sr-only">Info</span>
                    <h3 class="text-lg font-medium">No fishes in the aquarium.</h3>
                </div>
                <div class="mt-2 mb-4 text-sm">
                    How about add your first fish? All of your fishes will be listed here.
                </div>
                <div class="flex">
                    <a href="#/" type="button"
                        class="text-white bg-blue-800 hover:bg-blue-900 focus:ring-4 focus:outline-none focus:ring-blue-200 font-medium rounded-lg text-xs px-3 py-1.5 mr-2 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                        Add fish
                    </a>
                </div>
            </div>
        </div>
        <div v-else class="fish-list relative">
            <button @click="showFilter = !showFilter" type="button" class="absolute right-0 -top-10 text-blue-700">
                <svg class="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
                    <path d="M18.85 1.1A1.99 1.99 0 0 0 17.063 0H2.937a2 2 0 0 0-1.566 3.242L6.99 9.868 7 14a1 1 0 0 0 .4.8l4 3A1 1 0 0 0 13 17l.01-7.134 5.66-6.676a1.99 1.99 0 0 0 .18-2.09Z"/>
                </svg>
            </button>
            <div v-show="showFilter" class="flex flex-wrap p-3 mb-3 block bg-white border border-gray-200 rounded-lg shadow">
                <div class="flex items-center mr-4" v-for="col in columnNames">
                    <input :id="`inline-checkbox-${col}`" type="checkbox" :value="col" v-model="columnModel" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2">
                    <label :for="`inline-checkbox-${col}`" class="ml-2 text-sm font-medium text-gray-900">{{ col }}</label>
                </div>
            </div>
            <div class="relative overflow-x-auto">
                <table class="shadow-md sm:rounded-lg w-full text-sm text-left text-gray-500">
                    <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" :class="getCellClass(col)" v-for="col in columnSelections">{{col}}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(f, index) in fishes" :key="f.id" :class="getRowClass(index)">
                            <td scope="row" :class="getCellClass(col)" v-for="col in columnSelections">
                                <span v-if="col == 'ID'" class="font-medium text-gray-900 whitespace-nowrap">{{ f.id }}</span>
                                <span v-else-if="col == 'Name'">{{ f.name }}</span>
                                <div v-else-if="col == 'Type'" class="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                                    <img class="w-5 mr-1 inline-block" :src="`${useFishImagePath(f).path}`" :alt="f.type">
                                    <span>{{ f.type }}</span>
                                </div>
                                <template v-else-if="col == 'Status'">
                                    <div class="flex items-center mb-1">
                                        <div v-if="f.alive" class="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded">
                                            <span class="text-xs" v-for="s in getLifecycle(f).stars">⭐</span>
                                            <span class="ml-1">{{ getLifecycle(f).name }}</span>
                                        </div>
                                    </div>
                                    <div class="flex items-center">
                                        <div v-if="f.alive"
                                            class="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                                            Alive</div>
                                        <div v-else
                                            class="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded">
                                            Dead</div>
                                    </div>
                                </template>
                                <span v-else-if="col == 'Birthtime'" class="bg-blue-100 text-blue-800 text-xs font-medium inline-flex items-center px-2.5 py-0.5 rounded border border-blue-400">
                                    <CalendarIcon class="w-3 h-3 mr-1.5" />
                                    {{ useDateFormat(f.birthtime, 'DD-MM-YYYY HH:mm:ss') }}
                                </span>
                                <template v-else-if="col == 'Lifetime(remain/maximum)'">
                                    <div class="flex justify-between">
                                        <span class="text-sm font-medium text-blue-700 dark:text-white">{{
                                            mstoHour(f.remainLifetime) }} hours</span>
                                        <span class="text-sm font-medium text-blue-700 dark:text-white">{{ mstoHour(f.lifetime) }}
                                            hours</span>
                                    </div>
                                    <div class="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                                        <div class="bg-blue-600 h-2.5 rounded-full"
                                            :style="`width: ${getLifetimePercent(f.remainLifetime, f.lifetime)}%`"></div>
                                    </div>
                                </template>
                                <div v-else-if="col == 'Total lifetime'">
                                    <span class="text-sm font-medium text-blue-700">{{mstoHour(useFishTotalLifetime(f.birthtime).totalLifetime) }} hours</span>
                                </div>
                                <div v-else-if="col == 'Last fed'"
                                    class="bg-blue-100 text-blue-800 text-xs font-medium inline-flex items-center px-2.5 py-0.5 rounded border border-blue-400">
                                    <ClockIcon class="w-3 h-3 mr-1.5" />
                                    {{ useTimeAgo(f.feedtime) }}
                                </div>
                                <div v-else-if="col == 'Lifetime when fed'">
                                    <span class="text-sm font-medium text-blue-700">{{mstoHour(f.remainLifetimeWhenFed) }} hours</span>
                                </div>
                                <div v-else-if="col == 'Feed count'">
                                    <span class="text-sm font-medium text-blue-700">{{ f.feedCount }}</span>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>
<style scoped>
.collapse-aquarium .fish-list-container {
    flex-basis: 75%;
}
.fish-list-container {
    display: flex;
    flex-direction: column;
    flex-basis: 25%;
    gap: 20px;
}</style>