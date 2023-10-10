<script setup>
import { useFishCurrentLifecycle, useFishTotalLifetime } from '../composable/fish.js';
import { useTimeAgo, useDateFormat } from '@vueuse/core';
import { ClockIcon, CalendarIcon } from '@heroicons/vue/24/solid';

const props = defineProps({
    fishes: Array,
    fishLifeCycles: Array
});

const cellClass = "px-2 py-1 whitespace-nowrap";

function getRowClass(index) {
    return index % 2 == 0 ? 'bg-white border-b dark:bg-gray-800 dark:border-gray-700' : 'border-b bg-gray-50 dark:bg-gray-800 dark:border-gray-700';
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
    <div
        class="fish-list-container bg-white text-black p-2 bg-white text-black p-2 bg-cyan-800 max-md:h-5 overflow-y-scroll">
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
        <div v-else class="fish-list relative overflow-x-auto shadow-md sm:rounded-lg">
            <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" :class="cellClass">
                            ID
                        </th>
                        <th scope="col" :class="cellClass">
                            Name
                        </th>
                        <th scope="col" :class="cellClass">
                            Type
                        </th>
                        <th scope="col" :class="cellClass">
                            Status
                        </th>
                        <th scope="col" :class="cellClass">
                            Birthtime
                        </th>
                        <th scope="col" :class="cellClass">
                            Lifetime (remain / maximum)
                        </th>
                        <th scope="col" :class="cellClass">
                            Last fed
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(f, index) in fishes" :key="f.id" :class="getRowClass(index)">
                        <th scope="row" :class="cellClass">
                            <span class="font-medium text-gray-900 whitespace-nowrap dark:text-white">{{ f.id }}</span>
                        </th>
                        <td :class="cellClass">
                            {{ f.name }}
                        </td>
                        <td :class="cellClass">
                            <div
                                class="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">
                                <img class="w-5 mr-1 inline-block" :src="`/${f.type}.png`" :alt="f.type">
                                <span>{{ f.type }}</span>
                            </div>
                        </td>
                        <td :class="cellClass">
                            <div class="flex items-center mb-1">
                                <div v-if="f.alive"
                                    class="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-gray-900 dark:text-gray-300">
                                    <span class="text-xs" v-for="s in getLifecycle(f).stars">⭐</span>
                                    <span class="ml-1">{{ getLifecycle(f).name }}</span>
                                </div>
                            </div>
                            <div class="flex items-center">
                                <div v-if="f.alive"
                                    class="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300">
                                    Alive</div>
                                <div v-else
                                    class="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300">
                                    Dead</div>
                            </div>
                        </td>
                        <td :class="cellClass">
                            <span
                                class="bg-blue-100 text-blue-800 text-xs font-medium inline-flex items-center px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-blue-400 border border-blue-400">
                                <CalendarIcon class="w-3 h-3 mr-1.5" />
                                {{ useDateFormat(f.birthtime, 'DD-MM-YYYY HH:mm:ss') }}
                            </span>
                        </td>
                        <td :class="cellClass">
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
                        </td>
                        <td :class="cellClass">
                            <div
                                class="bg-blue-100 text-blue-800 text-xs font-medium inline-flex items-center px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-blue-400 border border-blue-400">
                                <ClockIcon class="w-3 h-3 mr-1.5" />
                                {{ useTimeAgo(f.feedtime) }}
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>
<style scoped>
.fish-list-container {
    display: flex;
    flex-direction: column;
    flex-basis: 25%;
    gap: 20px;
    padding: 20px;
}</style>