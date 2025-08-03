<script setup>
import fishNames from '../json/fishNames.json';
import config from '../json/config.json';
import Fish from '../Fish.vue';
import { ref, watch, onMounted } from 'vue';
import { initTooltips, initAccordions } from 'flowbite';
import { ClockIcon, MagnifyingGlassMinusIcon, MagnifyingGlassPlusIcon } from '@heroicons/vue/24/solid';

const fishTypes = config.defaultFishTypes;

const props = defineProps({
    fishLifeCycles: Array,
    maximumLifetime: Object
});

const fishTypeModel = ref('');
const fishNameModel = ref('');
const maximumLifetimeModel = ref(90);

onMounted(() => {
    initTooltips();
    initAccordions();
});

watch(maximumLifetimeModel, (newMaxLifetime) => {
    maximumLifetimeModel.value = Math.min(Math.max(newMaxLifetime, props.maximumLifetime.min), props.maximumLifetime.max);
});

const emit = defineEmits(['addFish', 'formValidationError']);

function addFish(e) {
    const form = e.target;
    if (form.checkValidity()) {
        emit('addFish', fishTypeModel.value, fishNameModel.value, Number(maximumLifetimeModel.value));
        fishNameModel.value = '';
    } else {
        emit('formValidationError');
    }
}

function randomFishType() {
    const randomIndex = Math.floor(Math.random() * fishTypes.length);
    fishTypeModel.value = fishTypes[randomIndex];
}

const generateFishName = () => {
    // Generate a random index to pick a name from the array
    const randomIndex = Math.floor(Math.random() * fishNames.length);

    // Set the generated fish name
    fishNameModel.value = fishNames[randomIndex];
};

const setLifecycle = (lifecycle) => {
    maximumLifetimeModel.value = lifecycle.miniumLifetime;
};

function getFishTooltipId(type) {
    return 'tooltip-fish-' + type;
}

</script>
<template>
    <form class="fish-form bg-cyan-800 max-md:h-5 overflow-y-scroll max-md:py-2 px-5 py-20" @submit.prevent="addFish">
        <div>
            <div class="flex gap-2">
                <h3 class="text-white font-bold text-xl">Fish type</h3>
                <button type="button" class="text-sm rounded bg-white p-1" @click="randomFishType">🎲 Random</button>
            </div>
            <div class="max-md:h-24 max-md:whitespace-nowrap overflow-x-auto overflow-y-hidden">
                <label v-for="(fishType, index) in fishTypes" class="fish-type-select" :key="index" :data-tooltip-target="getFishTooltipId(fishType)">
                    <input type="radio" name="fish-type" required :id="'fish-type' + index" :value="fishType"
                        v-model="fishTypeModel">
                    <Fish :type="fishType"></Fish>
                </label>
                <div v-for="(fishType, index) in fishTypes" :id="getFishTooltipId(fishType)" role="tooltip" class="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip">
                    {{fishType}}
                    <div class="tooltip-arrow" data-popper-arrow></div>
                </div>
            </div>
        </div>
        <div>
            <div class="flex gap-2">
                <h3 class="text-white font-bold text-xl">Fish name</h3>
                <button type="button" class="text-sm rounded bg-white p-1" @click="generateFishName">🎲 Random</button>
            </div>
            <input type="text" class="rounded text-2xl p-3" required v-model="fishNameModel">
        </div>
        <div>
            <h4 class="text-white font-bold text-lg">Maximum lifetime <small>(min: {{ maximumLifetime.min }} secs -> max: {{ maximumLifetime.max }} secs)</small></h4>
            <div class="flex flex-wrap gap-1">
                <button type="button" class="text-sm rounded bg-white p-1" v-for="(lifecycle, index) in fishLifeCycles"
                    :key="lifecycle.name" @click="setLifecycle(lifecycle)">{{ lifecycle.name }} {{ index ? "⭐".repeat(index) : '' }} ({{ lifecycle.miniumLifetime}}s)</button>
            </div>
            <input type="number" class="rounded text-xl p-2" required v-model="maximumLifetimeModel" :min="maximumLifetime.min" :max="maximumLifetime.max">
        </div>
        <div>
            <button type="submit" class="text-2xl rounded bg-blue-500 p-5 text-white">Add fish ➕</button>
        </div>

        <div id="tutorial" data-accordion="open">
            <h2 id="tutorial-heading-1">
                <button type="button" class="flex items-center justify-between w-full p-3 font-medium text-sky-500 border border-sky-200 rounded-t-md focus:ring-2 focus:ring-sky-200 bg-white gap-2" data-accordion-target="#tutorial-body-1" aria-expanded="false" aria-controls="tutorial-body-1">
                    <span>💡 First time? Check this tutorial below!</span>
                    <svg data-accordion-icon class="w-3 h-3 rotate-180 shrink-0" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5 5 1 1 5"/>
                    </svg>
                </button>
            </h2>
            <div id="tutorial-body-1" class="hidden" aria-labelledby="tutorial-heading-1">
                <div class="p-5 border border-gray-200">
                    <p class="mb-2 text-white"><strong>How should I add a fish?</strong></p>
                    <p class="text-white">
                        <ul class="text-white">
                            <li>* You can choose any beginning fish type you like, it's only for aesthetics purpose.</li>
                            <li>* How often you want to play will determine the maximum lifetime you choose. Maximum lifetime is like the max HP of your fish, and
                                overtime your fish will lose HP, so the more HP, the longer you can leave your fish unattended. If you don't have a lot of free time throughout the day,
                                you can set your fish max lifetime higher, so you can enjoy the leisure of feeding and caring your fish at an easier pace.
                            </li>
                            <li>* So why should you choose shorter max lifetime? Because it requires more of your attention the shorter the fish max lifetime, it comes with benefits.
                                The main fun of this game is there's a random chance that your fish will evolve when you starts up the game. It has a lot of different parameters,
                                and one of them is the fish max lifetime. The shorter it is, the more chance your fish will evolve. So if you focus on caring for your fish throughout the day,
                                there's a high chance your fish will evolve faster instead of playing the long game.
                            </li>
                            <li>* You can input your own max lifetime number (in seconds), or you can select from the pre-defined sets of lifetime above. For example: if you select "juvenile (7000)",
                                it means the fish would have max lifetime of 7000 seconds, and it is also the time required for the fish to reached the "juvenile" stage.
                                You can check these values to know the required lifetime for the fish to matured to a certain stage.
                            </li>
                        </ul>
                    </p>
                    <p class="mb-2 text-white"><strong>How do I care a fish?</strong></p>
                    <p class="text-white">
                        <ul>
                            <li>* After adding a fish, the max lifetime (green HP bar <div class="inline-block bg-lime-400 w-6 h-2"></div>) will decreases overtime. Click on it to feed it (replenish HP).
                                Check your feeding bag by clicking on the food can 🥫 in the lower left of the aquarium.
                            </li>
                            <li>* The lower right of aquarium is where you can zoom out/in <MagnifyingGlassMinusIcon class="w-7 h-7 inline-block bg-white text-black rounded border-sky-500 border-2"></MagnifyingGlassMinusIcon> <MagnifyingGlassPlusIcon class="w-7 h-7 inline-block bg-white text-black rounded border-sky-500 border-2"></MagnifyingGlassPlusIcon> the fishes,
                                    toggle ↔️ the size of the left panel, as well as reset ❌ all of the aquarium state (destructive action!)</li>
                            <li>* For more details on how to continue playing, check out the <a href="/#/guide" class="text-sky-600 hover:underline">Playing Guide</a>.</li>
                        </ul>
                    </p>
                </div>
            </div>
        </div>
    </form>
</template>
<style scoped>
.collapse-aquarium .fish-form {
    flex-basis: 75%;
}
.fish-form {
    display: flex;
    flex-direction: column;
    flex-basis: 25%;
    gap: 20px;
}

.fish-form>div {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.fish-type-select {
    display: inline-block;
    cursor: pointer;
    margin: 5px;
    position: relative;
    min-height: 60px;
}

.fish-type-select input {
    opacity: 0;
    width: 1px;
    height: 1px;
    pointer-events: none;
    position: absolute;
    bottom: 0;
}

.fish-type-select input:checked~.fish {
    filter: drop-shadow(3px 1px 0 lime) drop-shadow(-3px -1px 0 lime);
}
</style>
