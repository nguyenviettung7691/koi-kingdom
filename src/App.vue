<script setup>
import config from './json/config.json';
import { useFishTotalLifetime } from "./composable/fish.js";
import fishNames from './json/fishNames.json';

import Aquarium from './Aquarium.vue';
import FishForm from './views/FishForm.vue';
import FishList from './views/FishList.vue';
import HowToPlay from './views/HowToPlay.vue';
import AquariumList from './views/AquariumList.vue';
import Toasts from './Toasts.vue';

import { ref, watch, computed, onMounted } from 'vue';
import { initFlowbite } from 'flowbite';

const idSeed = ref(0);
const fishes = ref([]);
const feedBag = ref(config.defaultFeedBagCount);
const feedTimeLatest = ref(0);
const feedBagStreak = ref(0);
const aquariumUnlocks = ref(["3d"]);
const aquariumSelect = ref("3d");

const toastList = ref([]);
const collapseAquarium = ref(false);
const focusedFish = ref(-1);

const currentPath = ref(window.location.hash)

const { fishLifeCycles, maximumLifetime, feedConfig, rngConfig, aquariumConfig } = config;

const routes = {
    '/': FishForm,
    '/form': FishForm,
    '/list': FishList,
    '/howto': HowToPlay,
    '/aquarium': AquariumList,
}

onMounted(() => {
    initFlowbite();

    if (localStorage) {
        initFromLocalStorage();

        replenishFeedBag();

        runRNG(rngConfig);
    }
})

watch(fishes, (newFishes) => {
    if (localStorage) {
        localStorage.setItem("fishes", JSON.stringify(newFishes));
    }
}, { deep: true })
watch(idSeed, (newIdSeed) => {
    if (localStorage) {
        localStorage.setItem("idSeed", newIdSeed);
    }
})
watch(feedBag, (newFeedBag) => {
    if (localStorage) {
        localStorage.setItem("feedBag", newFeedBag);
    }
})
watch(feedTimeLatest, (newFeedTime) => {
    if (localStorage) {
        localStorage.setItem("feedTimeLatest", newFeedTime);
    }
})
watch(feedBagStreak, (newFeedBagStreak) => {
    if (localStorage) {
        localStorage.setItem("feedBagStreak", newFeedBagStreak);
    }
})
watch(aquariumUnlocks, (newAquariumUnlocks) => {
    if (localStorage) {
        localStorage.setItem("aquariumUnlocks", JSON.stringify(newAquariumUnlocks));
    }
}, { deep: true })
watch(aquariumSelect, (newAquariumSelect) => {
    if (localStorage) {
        localStorage.setItem("aquariumSelect", newAquariumSelect);
    }
})

const currentView = computed(() => {
    return routes[currentPath.value.slice(1) || '/']
})

window.addEventListener('hashchange', () => {
    currentPath.value = window.location.hash
})

function initFromLocalStorage() {
    const fishes_ls = JSON.parse(localStorage.getItem("fishes") || '[]');
    if (fishes_ls) fishes.value = fishes_ls;
    const idSeed_ls = localStorage.getItem("idSeed");
    if (idSeed_ls) idSeed.value = Number(idSeed_ls);
    const feedTimeLatest_ls = localStorage.getItem("feedTimeLatest");
    if (feedTimeLatest_ls) feedTimeLatest.value = Number(feedTimeLatest_ls);
    const feedBagStreak_ls = localStorage.getItem("feedBagStreak");
    if (feedBagStreak_ls) feedBagStreak.value = Number(feedBagStreak_ls);
    const feedBag_ls = localStorage.getItem("feedBag");
    if (feedBag_ls) feedBag.value = Number(feedBag_ls);
    const aquariumUnlocks_ls = JSON.parse(localStorage.getItem("aquariumUnlocks") || '["3d"]');
    if (aquariumUnlocks_ls) aquariumUnlocks.value = aquariumUnlocks_ls;
    const aquariumSelect_ls = localStorage.getItem("aquariumSelect") || "3d";
    if (aquariumSelect_ls) aquariumSelect.value = aquariumSelect_ls;
}

function replenishFeedBag() {
    if (feedTimeLatest.value) {
        const replenishInterval = feedConfig.replenishInterval;
        const noFeedTime = Date.now() - feedTimeLatest.value;
        const timeDifference = Math.floor(noFeedTime / replenishInterval);
        const feedBagReplenish = (timeDifference - feedBagStreak.value) * feedConfig.replenishAmount;
        if (feedBagReplenish > 0) {
            updateFeedBagHandler(feedBag.value + feedBagReplenish);
            feedBagStreak.value = feedBagReplenish;
        }
    }
}

async function runRNG(rngConfig) {
    if (willFishDie(rngConfig)) {
        const fish = fishes.value[Math.floor(Math.random() * fishes.value.length)];
        fish.alive = false;

        toastList.value.push({
            id: 'died-fish',
            message: `The fish named ${fish.name} has died because of contamination from other dead fishes in the aquarium. Try to remove all dead fishes from the aquarium as soon as possible.`,
            type: 'warning'
        })
    }

    if(willAddElementFish(rngConfig)){
        const { elementFishTypes, elementFishLifetime } = rngConfig.spawning;
        const elementFishType = elementFishTypes[Math.floor(Math.random() * elementFishTypes.length)];
        const fishName = fishNames[Math.floor(Math.random() * fishNames.length)];
        
        addFishHandler(elementFishType, fishName, elementFishLifetime);

        toastList.value.push({
            id: 'element-fish',
            message: `An elemental fish named ${fishName} with type ${elementFishType} just joined your aquarium! Good job!.`,
            type: 'success'
        })
    }

    if(willAddMythicalFish(rngConfig)){
        const { mythicalFishTypes, mythicalFishLifetime } = rngConfig.spawning;
        const mythicalFishType = mythicalFishTypes[Math.floor(Math.random() * mythicalFishTypes.length)];
        const fishName = fishNames[Math.floor(Math.random() * fishNames.length)];

        addFishHandler(mythicalFishType, fishName, mythicalFishLifetime);

        toastList.value.push({
            id: 'mythical-fish',
            message: `A mythical fish named ${fishName} with type ${mythicalFishType} just joined your aquarium! Congratulations! And try to take care of it!`,
            type: 'success'
        })
    }
}

function willFishDie(rngConfig) {
    // config
    const { deadFishModifer, aliveFishModifer, durationInHoursModifer } = rngConfig.contamination;
    // parameters
    const numDeadFish = fishes.value.filter((f) => f.alive == false).length;
    const numAliveFish = fishes.value.filter((f) => f.alive == true).length;
    const durationInHours = (Date.now() - feedTimeLatest.value) / (1000 * 60 * 60);
    // Base probability of a fish dying
    let probability = 0;

    // Adjust the probability based on the given parameters
    if (numDeadFish > 0) {
        probability += numDeadFish * deadFishModifer; // Increase by 5% for each dead fish
        probability += numAliveFish * aliveFishModifer; // Increase by 2% for each alive fish
        probability += durationInHours * durationInHoursModifer; // Increase by 1% for each hour
    }

    // Generate a random number between 0 and 1
    const randomValue = Math.random();

    // Check if the random number is less than or equal to the adjusted probability
    if (randomValue <= probability) {
        return true; // A fish will die
    } else {
        return false; // No fish will die
    }
}

function willAddElementFish(rngConfig){
    const { spawningModifer } = rngConfig.spawning;
    const spawningLifecycle = fishLifeCycles.find((lc) => lc.name == 'spawning');

    const numSpawning = fishes.value.filter((f) => useFishTotalLifetime(f.birthtime).totalLifetime > spawningLifecycle.miniumLifetime * 1000).length;

    let probability = 0;

    if (numSpawning > 0) {
        probability += numSpawning * spawningModifer; // Increase by 5% for each spawning fish
    }

    const randomValue = Math.random();

    if (randomValue <= probability) {
        return true;
    } else {
        return false;
    }
}

function willAddMythicalFish(rngConfig){
    const { spawningModifer, lifetimeInHoursBase, lifetimeInHoursModifier } = rngConfig.spawning;
    const spawningLifecycle = fishLifeCycles.find((lc) => lc.name == 'spawning');

    const spawningFishes = fishes.value.filter((f) => useFishTotalLifetime(f.birthtime).totalLifetime > spawningLifecycle.miniumLifetime * 1000);
    const numSpawning = spawningFishes.length;

    let probability = 0;

    if (numSpawning > 0) {
        const spawningFishesBelowBaseHour = spawningFishes.filter((f) => Math.round(f.lifetime / 1000 / 60 / 60) < lifetimeInHoursBase);
        const numSpawningBelowBaseHour = spawningFishesBelowBaseHour.length;

        if(numSpawningBelowBaseHour > 0){
            probability += numSpawningBelowBaseHour * spawningModifer; // Increase by 1% for each spawning fish below the base lifetime
            spawningFishesBelowBaseHour.forEach((f) => {
                probability += lifetimeInHoursModifier / Math.round(f.lifetime / 1000 / 60 / 60); // Increase by 1% for each hours below the base lifetime
            })
        }
    }

    const randomValue = Math.random();

    if (randomValue <= probability) {
        return true;
    } else {
        return false;
    }
}

function addFishHandler(type, name, miniumLifetime) {
    let id = Number(idSeed.value),
        alive = true,
        lifetime = miniumLifetime * 1000,
        birthtime = Date.now();

    fishes.value.push({ type, name, id, alive, lifetime, birthtime, remainLifetime: lifetime, feedtime: birthtime, remainLifetimeWhenFed: lifetime, feedCount: 0 });
    idSeed.value++;
}

function formValidationErrorHandler(e){
    toastList.value.push({
        id: 'form-validation',
        message: 'Please select a type of fish, input a name, and input a maximum lifetime.',
        type: 'error'
    })
}

function unlockAquariumHandler(aquarium){
    aquariumUnlocks.value.push(aquarium);

    toastList.value.push({
        id: 'aquarium-unlock-validation',
        message: `Unlocked aquarium ${aquarium}.`,
        type: 'success'
    })
}

function selectAquariumHandler(aquarium){
    aquariumSelect.value = aquarium;

    toastList.value.push({
        id: 'aquarium-change-validation',
        message: `Changed to aquarium ${aquarium}.`,
        type: 'success'
    })
}

function focusFishHandler(fish) {
    focusedFish.value = fish.id;
}
function blurFishHandler() {
    focusedFish.value = -1;
}

function feedFishHandler(id, countdown) {
    let fish = fishes.value.find((f) => f.id == id);
    fish.remainLifetime = countdown;
    fish.remainLifetimeWhenFed = countdown;
    fish.feedtime = Date.now();
    fish.feedCount += 1;

    feedTimeLatest.value = Date.now();
    feedBagStreak.value = 0;
}
function feedEmptyHandler() {
    toastList.value.push({
        id: 'feed-empty',
        message: `The feed bag is empty. Wait for refill.`,
        type: 'warning'
    })
}
function updateFeedBagHandler(count) {
    feedBag.value = count < 1 ? 0 : count;
}

function countdownFishHandler(id, countdown) {
    let fish = fishes.value.find((f) => f.id == id);
    fish.remainLifetime = countdown;
}
function deadFishHandler(id) {
    const fish = fishes.value.find((f) => f.id == id);
    fish.alive = false;

    toastList.value.push({
        id: 'died-fish',
        message: `The fish named ${fish.name} has died. Please remove from the aquarium.`,
        type: 'warning'
    })
}
function clearFishHandler(id) {
    const fish = fishes.value.find((f) => f.id == id);
    fishes.value.splice(fishes.value.indexOf(fish), 1);

    toastList.value.push({
        id: 'cleared-fish',
        message: `The fish named ${fish.name} has been removed from the aquarium. RIP.`,
        type: 'info'
    })
}
function evolveFishHandler(id) {
    const fishTypes = rngConfig.evolving.evolveFishTypes;
    const randomIndex = Math.floor(Math.random() * fishTypes.length);
    const evolvedFishType = fishTypes[randomIndex];
    const fish = fishes.value.find((f) => f.id == id);
    fish.type = evolvedFishType;

    toastList.value.push({
        id: 'evolved-fish',
        message: `The fish named ${fish.name} has been evolved into type <strong>${evolvedFishType}</strong> <img class="w-5 ml-1 inline-block" src="/${evolvedFishType}.png" alt="${evolvedFishType}">!`,
        type: 'info'
    })
}

function resetAquariumHandler() {
    fishes.value = [];
    idSeed.value = 0;
    feedBag.value = 5;
    feedTimeLatest.value = 0;
    feedBagStreak.value = 0;
    aquariumUnlocks.value = ["3d"];
    aquariumSelect.value = "3d";
}

function toggleSizeHandler(){
    collapseAquarium.value = !collapseAquarium.value;
}
</script>
<template>
    <nav class="bg-gradient-to-b from-indigo-500 absolute top-0 flex w-full z-10">
        <div class="max-w-screen-xl flex items-start justify-between mx-auto p-4">
            <button data-collapse-toggle="navbar-default" type="button"
                class="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-white rounded-lg md:hidden hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-200"
                aria-controls="navbar-default" aria-expanded="false">
                <span class="sr-only">Open main menu</span>
                <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M1 1h15M1 7h15M1 13h15" />
                </svg>
            </button>
            <div class="hidden w-full md:block md:w-auto" id="navbar-default">
                <ul class="font-medium flex flex-col min-md:p-4 min-md:mt-4 rounded-lg md:flex-row md:space-x-8 md:mt-0">
                    <li>
                        <a href="#/" class="block py-2 pl-3 pr-4 text-white rounded hover:bg-sky-600">Add Fish</a>
                    </li>
                    <li>
                        <a href="#/list" class="block py-2 pl-3 pr-4 text-white rounded hover:bg-sky-600">Fish List</a>
                    </li>
                    <li>
                        <a href="#/aquarium" class="block py-2 pl-3 pr-4 text-white rounded hover:bg-sky-600">Aquarium List</a>
                    </li>
                    <li>
                        <a href="#/howto" class="block py-2 pl-3 pr-4 text-white rounded hover:bg-sky-600">How to play</a>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
    <div :class="['flex h-full max-md:flex-col-reverse', {'collapse-aquarium': collapseAquarium}]">
        <component :is="currentView" :fishes="fishes" :fish-life-cycles="fishLifeCycles" :maximum-lifetime="maximumLifetime"
            :feed-config="feedConfig" :aquarium-config="aquariumConfig" :aquarium-unlocks="aquariumUnlocks" :aquarium-select="aquariumSelect"
            @add-fish="addFishHandler" @form-validation-error="formValidationErrorHandler" @unlock-aquarium="unlockAquariumHandler" @select-aquarium="selectAquariumHandler"
            @focus-fish="focusFishHandler" @blur-fish="blurFishHandler" />
        <Aquarium :fishes="fishes" :feed-bag="feedBag" :feed-time-latest="feedTimeLatest" :aquarium-select="aquariumSelect" :focused-fish="focusedFish"
            @feed-fish="feedFishHandler" @feed-empty="feedEmptyHandler" @countdown-fish="countdownFishHandler"
            @dead-fish="deadFishHandler" @clear-fish="clearFishHandler" @evolve-fish="evolveFishHandler" @update-feed-bag="updateFeedBagHandler"
            @reset-aquarium="resetAquariumHandler" @toggle-size="toggleSizeHandler">
        </Aquarium>
        <Toasts :toasts="toastList"></Toasts>
    </div>
</template>

<style scoped>
nav {
    text-transform: uppercase;
}
</style>