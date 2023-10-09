<script setup>
import { computed, ref } from 'vue';
import Fish from './Fish.vue';
import { useTimestampToString } from './composable/date.js';

const props = defineProps({
    fishes: Array,
    fishLifeCycles: Array,
    feedBag: Number,
    feedTimeLatest: Number,
    feedConfig: Object
});

const aquarium = ref(null);

const aquariumHeight = computed(() => { return aquarium.value.clientHeight; });
const aquariumWidth = computed(() => { return aquarium.value.clientWidth; });
const lastFeed = computed(() => { return useTimestampToString(props.feedTimeLatest).string });

const emit = defineEmits(['feedFish', 'countdownFish', 'deadFish', 'clearFish', 'updateFeedBag', 'resetAquarium']);


function feedHandler(id, countdown) {
    emit('feedFish', id, countdown);
    emit('updateFeedBag', props.feedBag - 1);
}
function countdownHandler(id, countdown) {
    emit('countdownFish', id, countdown);
}
function deadHandler(id) {
    emit('deadFish', id);
}
function clearHandler(id) {
    emit('clearFish', id);
}
</script>

<template>
    <div class="aquarium" ref="aquarium">
        <Fish v-for="fish in fishes" :key="fish.id" :type="fish.type" :name="fish.name" :id="fish.id" :alive="fish.alive"
            :lifetime="fish.lifetime" :remain-lifetime="fish.remainLifetime" :birthtime="fish.birthtime" :feedtime="fish.feedtime"
            :feed-bag="feedBag" :feed-config="feedConfig" :fish-life-cycles="fishLifeCycles" :aquarium-height="aquariumHeight" :aquarium-width="aquariumWidth"
            @feed="feedHandler" @countdown="countdownHandler" @dead="deadHandler" @clear="clearHandler"></Fish>
        <div class="commands">
            <button type="button" class="text-lg rounded bg-red-500 p-2 text-white" data-modal-target="reset-aquarium-modal" data-modal-toggle="reset-aquarium-modal">Reset aquarium 🗙</button>
        </div>
        <div class="feed-bag">
            <div>Feed bag<span v-if="feedBag > 59"> (full)</span>: 🍥 x {{ feedBag }}</div>
            <div>Last feed at: {{ lastFeed }}</div>
        </div>
    </div>
    <div id="reset-aquarium-modal" tabindex="-1" class="fixed top-0 left-0 right-0 z-50 hidden p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full">
        <div class="relative w-full max-w-md max-h-full">
            <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
                <button type="button" class="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="reset-aquarium-modal">
                    <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                    </svg>
                    <span class="sr-only">Close</span>
                </button>
                <div class="p-6 text-center">
                    <div class="text-7xl mb-3">🎣</div>
                    <h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">Are you sure you want to reset the aquarium?</h3>
                    <button @click="$emit('resetAquarium')" data-modal-hide="reset-aquarium-modal" type="button" class="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2">
                        Yes, I'm sure.
                    </button>
                    <button data-modal-hide="reset-aquarium-modal" type="button" class="text-white bg-cyan-600 hover:bg-cyan-800 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-white-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600">No, that was close!</button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.aquarium {
    background: url('/bg.jpg');
    flex-basis: 75%;
    position: relative;
    background-size: cover;
    overflow: hidden;
}

.aquarium .fish {
    position: absolute;
    top: 50%;
    left: 50%;
}
.aquarium .commands {
    position: absolute;
    bottom: 10px; right: 10px;
}
.aquarium .feed-bag {
    position: absolute;
    bottom: 10px; left: 10px;
    color: white;
}
</style>
