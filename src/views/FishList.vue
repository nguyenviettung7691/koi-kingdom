<script setup>
import { useTimestampToString } from '../composable/date.js';

const props = defineProps({
    fishes: Array
});

const cellClass = "px-2 py-1";

function getRowClass(index){
    return index % 2 == 0 ? 'bg-white border-b dark:bg-gray-800 dark:border-gray-700' : 'border-b bg-gray-50 dark:bg-gray-800 dark:border-gray-700';
}

function mstoHour(ms){
    return Math.round(ms / 1000 / 60 / 60);
}

</script>
<template>
    <div
        class="fish-list-container bg-white text-black p-2 bg-white text-black p-2 bg-cyan-800 max-md:h-5 overflow-y-scroll">
        <div class="text-xl">Fish List</div>
        <div class="fish-list relative overflow-x-auto shadow-md sm:rounded-lg">
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
                            <span>{{ f.type }}</span>
                            <img class="w-5" :src="`/${f.type}.png`" :alt="f.type">
                        </td>
                        <td :class="cellClass">
                            <div class="flex items-center">
                                <template v-if="f.alive">
                                    <div class="h-2.5 w-2.5 rounded-full bg-green-500 mr-2"></div> Alive
                                </template>
                                <template v-else>
                                    <div class="h-2.5 w-2.5 rounded-full bg-red-500 mr-2"></div> Dead
                                </template>
                            </div>
                        </td>
                        <td :class="cellClass">
                            {{ useTimestampToString(f.birthtime).string }}
                        </td>
                        <td :class="cellClass">
                            {{ mstoHour(f.remainLifetime) }} hours / {{ mstoHour(f.lifetime) }} hours
                        </td>
                        <td :class="cellClass">
                            {{ useTimestampToString(f.feedtime).string }}
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
}
</style>