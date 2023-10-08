<script setup>
import Aquarium from './Aquarium.vue';
import FishForm from './FishForm.vue';
import { ref, watch, onMounted } from 'vue';
import { initFlowbite } from 'flowbite';

const idSeed = ref(0);
const fishes = ref([]);
const feedBag = ref(5);
const feedTimeLatest = ref(0);
const feedBagStreak = ref(0);

const fishLifeCycles = [
    { name: 'fry', miniumLifetime: 90, size: 0.3 },
    { name: 'fingerling', miniumLifetime: 800, size: 0.7 },
    { name: 'juvenile', miniumLifetime: 7000, size: 1.2 },
    { name: 'smolt', miniumLifetime: 60000, size: 1.8 },
    { name: 'adult', miniumLifetime: 500000, size: 2.5 },
    { name: 'spawning', miniumLifetime: 4000000, size: 3 }
];

onMounted(() => {
    initFlowbite();

    if (localStorage) {
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

        const millisecondsPerDay = 24 * 60 * 60 * 1000; // Number of milliseconds in a day
        const timeDifference = Date.now() - feedTimeLatest.value;
        const daysDifference = Math.floor(timeDifference / millisecondsPerDay);
        const feedBagReplenish = daysDifference - feedBagStreak.value;
        if (feedBagReplenish > 0) {
            updateFeedBagHandler(feedBag.value + feedBagReplenish);
            feedBagStreak.value = feedBagReplenish;
        }
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
    feedBagStreak.value = 0;
})
watch(feedBagStreak, (newFeedBagStreak) => {
    if (localStorage) {
        localStorage.setItem("feedBagStreak", newFeedBagStreak);
    }
})

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
}
</script>
<template>
    <div class="flex h-full max-md:flex-col-reverse">
        <FishForm :fish-life-cycles="fishLifeCycles" @add-fish="addFishHandler"></FishForm>
        <Aquarium :fishes="fishes" :fish-life-cycles="fishLifeCycles" :feed-bag="feedBag" :feed-time-latest="feedTimeLatest"
            @feed-fish="feedFishHandler" @countdown-fish="countdownFishHandler" @dead-fish="deadFishHandler"
            @clear-fish="clearFishHandler" @update-feed-bag="updateFeedBagHandler" @reset-aquarium="resetAquariumHandler">
        </Aquarium>
    </div>
</template>
