<script setup>
import Aquarium from './Aquarium.vue';
import FishForm from './FishForm.vue';
import FishList from './FishList.vue';
import HowToPlay from './HowToPlay.vue';
import { ref, watch, computed, onMounted } from 'vue';
import { initFlowbite } from 'flowbite';

const idSeed = ref(0);
const fishes = ref([]);
const feedBag = ref(5);
const feedTimeLatest = ref(0);
const feedBagStreak = ref(0);

const fishDied = ref(false);
const currentPath = ref(window.location.hash)

const fishLifeCycles = [
    { name: 'fry', miniumLifetime: 90, size: 0.3 },
    { name: 'fingerling', miniumLifetime: 800, size: 0.7 },
    { name: 'juvenile', miniumLifetime: 7000, size: 1.2 },
    { name: 'smolt', miniumLifetime: 50000, size: 1.8 },
    { name: 'adult', miniumLifetime: 400000, size: 2.5 },
    { name: 'spawning', miniumLifetime: 2000000, size: 3 }
];
const maximumLifetime = {
    min: 90, //seconds
    max: 2000000 //seconds
}
const feedConfig = {
    increaseAmount: 6000, //seconds
    replenishInterval: 6 * 60 * 60 * 1000, //ms
    replenishAmount: 1
}

const routes = {
  '/': FishForm,
  '/form': FishForm,
  '/list': FishList,
  '/howto': HowToPlay
}

const currentView = computed(() => {
  return routes[currentPath.value.slice(1) || '/']
})

onMounted(() => {
    initFlowbite();

    if (localStorage) {
        initFromLocalStorage();

        replenishFeedBag();

        runRNG();
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
}

function replenishFeedBag() {
    if(feedTimeLatest.value) {
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

function runRNG() {
    const willFishDie = (numDeadFish, numAliveFish, durationInHours) => {
        // Base probability of a fish dying
        let probability = 0;

        // Adjust the probability based on the given parameters
        if (numDeadFish > 0) {
            probability += numDeadFish * 0.05; // Increase by 5% for each dead fish
            probability += numAliveFish * 0.02; // Increase by 2% for each alive fish
            probability += durationInHours * 0.01; // Increase by 1% for each hour
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

    if (willFishDie(
        fishes.value.filter((f) => f.alive == false).length,
        fishes.value.filter((f) => f.alive == true).length,
        (Date.now() - feedTimeLatest.value) / (1000 * 60 * 60)
    )) {
        fishes.value[Math.floor(Math.random() * fishes.value.length)].alive = false;
        fishDied.value = true;
    }
}

function addFishHandler(type, name, miniumLifetime) {
    let id = Number(idSeed.value),
        alive = true,
        lifetime = miniumLifetime * 1000,
        birthtime = Date.now();

    fishes.value.push({ type, name, id, alive, lifetime, birthtime, remainLifetime: lifetime, feedtime: birthtime });
    idSeed.value++;
}

function feedFishHandler(id, countdown) {
    let fish = fishes.value.find((f) => f.id == id);
    fish.remainLifetime = countdown;
    fish.feedtime = Date.now();

    feedTimeLatest.value = Date.now();
    feedBagStreak.value = 0;
}
function updateFeedBagHandler(count) {
    feedBag.value = count < 1 ? 0 : count;
}

function countdownFishHandler(id, countdown) {
    let fish = fishes.value.find((f) => f.id == id);
    fish.remainLifetime = countdown;
}
function deadFishHandler(id) {
    fishes.value.find((f) => f.id == id).alive = false;
}
function clearFishHandler(id) {
    fishes.value.splice(fishes.value.indexOf(fishes.value.find((f) => f.id == id)), 1);
}

function resetAquariumHandler() {
    fishes.value = [];
    idSeed.value = 0;
    feedBag.value = 5;
    feedTimeLatest.value = 0;
    feedBagStreak.value = 0;
}
</script>
<template>
    <nav class="bg-gradient-to-b from-indigo-500 absolute top-0 flex w-full z-10">
        <div class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
            <button data-collapse-toggle="navbar-default" type="button"
                class="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                aria-controls="navbar-default" aria-expanded="false">
                <span class="sr-only">Open main menu</span>
                <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M1 1h15M1 7h15M1 13h15" />
                </svg>
            </button>
            <div class="hidden w-full md:block md:w-auto" id="navbar-default">
                <ul
                    class="font-medium flex flex-col p-4 md:p-0 mt-4 rounded-lg md:flex-row md:space-x-8 md:mt-0">
                    <li>
                        <a href="#/"
                            class="block py-2 pl-3 pr-4 text-white bg-blue-700 rounded md:bg-transparent md:p-0"
                            aria-current="page">Add Fish</a>
                    </li>
                    <li>
                        <a href="#/list"
                            class="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">Fish
                            List</a>
                    </li>
                    <li>
                        <a href="#/howto"
                            class="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">How
                            to play</a>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
    <div class="flex h-full max-md:flex-col-reverse">
        <component :is="currentView" :fishes="fishes" :fish-life-cycles="fishLifeCycles" :maximum-lifetime="maximumLifetime" :feed-config="feedConfig" @add-fish="addFishHandler" />
        <Aquarium :fishes="fishes" :fish-life-cycles="fishLifeCycles" :feed-bag="feedBag" :feed-time-latest="feedTimeLatest" :feed-config="feedConfig"
            @feed-fish="feedFishHandler" @countdown-fish="countdownFishHandler" @dead-fish="deadFishHandler"
            @clear-fish="clearFishHandler" @update-feed-bag="updateFeedBagHandler" @reset-aquarium="resetAquariumHandler">
        </Aquarium>
        <div class="absolute right-0 top-0">
            <div v-if="fishDied" id="toast-died-fish"
                class="flex items-center w-full max-w-xs p-4 text-gray-500 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-800"
                role="alert">
                <div
                    class="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-orange-500 bg-orange-100 rounded-lg dark:bg-orange-700 dark:text-orange-200">
                    <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor"
                        viewBox="0 0 20 20">
                        <path
                            d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM10 15a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm1-4a1 1 0 0 1-2 0V6a1 1 0 0 1 2 0v5Z" />
                    </svg>
                    <span class="sr-only">Warning icon</span>
                </div>
                <div class="ml-3 text-sm font-normal">A fish has died because of contamination from other dead fishes in the
                    aquarium. Try to remove all dead fishes from the aquarium as soon as possible.</div>
                <button type="button"
                    class="ml-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700"
                    data-dismiss-target="#toast-died-fish" aria-label="Close">
                    <span class="sr-only">Close</span>
                    <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
                        viewBox="0 0 14 14">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                    </svg>
                </button>
            </div>
        </div>
    </div>
</template>
