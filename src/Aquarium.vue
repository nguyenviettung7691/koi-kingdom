<script setup>
import { computed, ref } from 'vue';
import Fish from './Fish.vue';
import { useTimeAgo } from '@vueuse/core';
import { ClockIcon, MagnifyingGlassMinusIcon, MagnifyingGlassPlusIcon } from '@heroicons/vue/24/solid';

const props = defineProps({
    fishes: Array,
    feedBag: Number,
    feedTimeLatest: Number,
    aquariumSelect: String,
    focusedFish: Number
});
const emit = defineEmits(['feedFish', 'feedEmpty', 'countdownFish', 'deadFish', 'clearFish', 'evolveFish', 'updateFeedBag', 'resetAquarium', 'toggleSize']);

const aquarium = ref(null);
const aquariumHeight = computed(() => { return aquarium.value.clientHeight; });
const aquariumWidth = computed(() => { return aquarium.value.clientWidth; });
const decreasePopup = ref(false);
const feedBagShow = ref(false);
const lastFeed = computed(() => { return props.feedTimeLatest ? useTimeAgo(props.feedTimeLatest) : 'Never' });

function feedHandler(id, countdown) {
    emit('feedFish', id, countdown);
    emit('updateFeedBag', props.feedBag - 1);
    popupFoodcan();
}
function feedEmptyHandler() {
    emit('feedEmpty');
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
function evolveHandler(id) {
    emit('evolveFish', id);
}

function popupFoodcan(){
    decreasePopup.value = true;
    setTimeout(() => {
        decreasePopup.value = false;
    }, 1000);
}

const zoomMin = 0.5;
const zoomMax = 1.5;
const zoomStep = 0.1;
const zoom = ref(1)
function zoomAquarium(zoomIn){
    if(zoomIn) { if(zoom.value < zoomMax) zoom.value += zoomStep }
    else if(zoom.value > zoomMin) zoom.value -= zoomStep
}

const aquariumStyle = computed(() => {
    return {
        backgroundImage: 'url(/aquarium-' + props.aquariumSelect + '.jpg)',
    }
})
</script>

<template>
    <div class="aquarium" :style="aquariumStyle" ref="aquarium">
        <Fish v-for="fish in fishes" :key="fish.id" :type="fish.type" :name="fish.name" :id="fish.id" :alive="fish.alive"
            :lifetime="fish.lifetime" :remain-lifetime="fish.remainLifetime" :birthtime="fish.birthtime"
            :feedtime="fish.feedtime" :remain-lifetime-when-fed="fish.remainLifetimeWhenFed" :feed-count="fish.feedCount"
            :feed-bag="feedBag" :aquarium-height="aquariumHeight" :aquarium-width="aquariumWidth" :zoom="zoom" :focused="fish.id == focusedFish"
            @feed="feedHandler" @feed-empty="feedEmptyHandler" @countdown="countdownHandler" @dead="deadHandler" @clear="clearHandler" @evolve="evolveHandler"></Fish>
        <div class="commands">
            <div>
                <div class="flex justify-between items-center">
                    <MagnifyingGlassMinusIcon class="w-7 h-7 bg-white rounded border-sky-500 border-2" @click="zoomAquarium(false)"></MagnifyingGlassMinusIcon>
                    <label for="fish-zoom" class="block text-sm font-medium text-white text-shadow-md text-shadow-sky-500">Fish zoom</label>
                    <MagnifyingGlassPlusIcon class="w-7 h-7 bg-white rounded border-sky-500 border-2" @click="zoomAquarium(true)"></MagnifyingGlassPlusIcon>
                </div>
                <input id="fish-zoom" type="range" v-model="zoom" :min="zoomMin" :max="zoomMax" :step="zoomStep" class="w-full h-1 md:h-2 range-sm bg-gray-200 border-2 border-sky-500 rounded-lg appearance-none cursor-pointer dark:bg-gray-700">
            </div>
            <button type="button" class="text-sm rounded bg-white p-1 text-blue-500 border-sky-500 border-2" @click="$emit('toggleSize')">Toggle panel ↔️</button>
            <button type="button" class="text-sm rounded bg-white p-1 text-red-500 border-sky-500 border-2" data-modal-target="reset-aquarium-modal"
                data-modal-toggle="reset-aquarium-modal">Reset aquarium ❌</button>
        </div>
        <div class="feed-bag">
            <div :class="['decrease-amount', {'popup': decreasePopup}]">-1🍥</div>
            <div class="absolute -top-9 text-2xl cursor-pointer bg-white rounded border-sky-500 border-2" @click="feedBagShow = !feedBagShow">🥫</div>
            <div v-show="feedBagShow">
                <div>Feed count:
                    <span
                        class="bg-red-100 text-red-800 text-xs font-medium inline-flex items-center px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-red-400 border border-red-400">
                        🍥 x {{ feedBag }}
                    </span>
                </div>
                <div>Last fed at:
                    <span
                        class="bg-blue-100 text-blue-800 text-xs font-medium inline-flex items-center px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-blue-400 border border-blue-400">
                        <ClockIcon class="w-3 h-3 mr-1.5" />
                        {{ lastFeed }}
                    </span>
                </div>
            </div>
        </div>
    </div>
    <div id="reset-aquarium-modal" tabindex="-1"
        class="fixed top-0 left-0 right-0 z-50 hidden p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full">
        <div class="relative w-full max-w-md max-h-full">
            <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
                <button type="button"
                    class="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                    data-modal-hide="reset-aquarium-modal">
                    <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
                        viewBox="0 0 14 14">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                    </svg>
                    <span class="sr-only">Close</span>
                </button>
                <div class="p-6 text-center">
                    <div class="text-7xl mb-3">🎣</div>
                    <h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">Are you sure you want to reset the
                        aquarium?</h3>
                    <button @click="$emit('resetAquarium')" data-modal-hide="reset-aquarium-modal" type="button"
                        class="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2">
                        Yes, I'm sure.
                    </button>
                    <button data-modal-hide="reset-aquarium-modal" type="button"
                        class="text-white bg-cyan-600 hover:bg-cyan-800 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-white-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600">No,
                        that was close!</button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.collapse-aquarium .aquarium {
    flex-basis: 25%;
}
.aquarium {
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
    bottom: 10px;
    right: 10px;
    display: flex;
    gap: 5px;
    flex-direction: column;
}

.aquarium .feed-bag {
    position: absolute;
    bottom: 0; left: 0;
    padding: 0px; margin: 20px;
    background: #fff;
    border: 1px solid skyblue;
    border-radius: 5px;
}

.decrease-amount {
    position: absolute;
    top: -66px;
    left: 20px;
    opacity: 0;
    transform: translateX(-50%);
    font-size: 30px;
    font-weight: bold;
    color: red;
    -webkit-text-stroke: 1px maroon;
    pointer-events: none;
    white-space: nowrap;
}

.decrease-amount.popup {
    animation: decreasePopup 1s ease-out forwards;
}

@keyframes decreasePopup {
  0% {
    opacity: 1;
    transform: translate(-50%, 0);
  }
  100% {
    opacity: 0;
    transform: translate(-50%, -40px);
  }
}
</style>
