<script setup>
import Aquarium from './Aquarium.vue';
import FishForm from './FishForm.vue';
import { ref, watch, onMounted } from 'vue';

const idSeed = ref(0);
const fishes = ref([]);

const fishLifeCycles = [
    { name: 'fry', miniumLifetime: 90, size: 0.3 },
    { name: 'fingerling', miniumLifetime: 800, size: 0.7 },
    { name: 'juvenile', miniumLifetime: 7000, size: 1 },
    { name: 'smolt', miniumLifetime: 60000, size: 2 },
    { name: 'adult', miniumLifetime: 500000, size: 3 },
    { name: 'spawning', miniumLifetime: 4000000, size: 3.3 }
];

onMounted(() => {
    if(localStorage) {
        const fishes_ls = JSON.parse(localStorage.getItem("fishes") || '[]');
        if(fishes_ls) fishes.value = fishes_ls;

        const idSeed_ls = localStorage.getItem("idSeed");
        if(idSeed_ls) idSeed.value = idSeed_ls;
    }
})

watch(fishes, (newFishes) => {
    if(localStorage) {
        localStorage.setItem("fishes", JSON.stringify(newFishes));
    }
}, { deep: true })
watch(idSeed, (newIdSeed) => {
    if(localStorage) {
        localStorage.setItem("idSeed", newIdSeed);
    }
})

function addFishHandler(type, name, miniumLifetime){
    let id = Number(idSeed.value),
        alive = true,
        lifetime = miniumLifetime * 1000,
        birthtime = Date.now();

    fishes.value.push({ type, name, id, alive, lifetime, birthtime, feedtime: birthtime });
    idSeed.value++;
}

function feedFishHandler(id){
    fishes.value.find((f) => f.id == id).feedtime = Date.now();
}
function deadFishHandler(id){
    fishes.value.find((f) => f.id == id).alive = false;
}

function clearFishHandler(id){
    fishes.value.splice(fishes.value.indexOf(fishes.value.find((f) => f.id == id)), 1);
}

function resetAquariumHandler(){
    fishes.value = [];
    idSeed.value = 0;
}
</script>
<template>
<div class="flex h-full max-md:flex-col-reverse">
    <FishForm :fish-life-cycles="fishLifeCycles" @add-fish="addFishHandler" @reset-aquarium="resetAquariumHandler"></FishForm>
    <Aquarium :fishes="fishes" :fish-life-cycles="fishLifeCycles" @feed-fish="feedFishHandler" @dead-fish="deadFishHandler" @clear-fish="clearFishHandler"></Aquarium>
</div>
</template>
