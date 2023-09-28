<script setup>
import Aquarium from './Aquarium.vue';
import FishForm from './FishForm.vue';
import {ref} from 'vue';

const idSeed = ref(0);
const fishes = ref([]);

function addFishHandler(type, name){
    let id = idSeed.value,
        alive = true,
        lifetime = (Math.random() + 30) * 1000;

    fishes.value.push({ type, name, id, alive, lifetime });
    idSeed.value++;
}

function deadFishHandler(id){
    fishes.value.find((f) => f.id == id).alive = false;
}
function clearFishHandler(id){
    fishes.value.splice(fishes.value.indexOf(fishes.value.find((f) => f.id == id)), 1);
}
</script>
<template>
<div class="flex h-full">
    <FishForm @add-fish="addFishHandler"></FishForm>
    <Aquarium :fishes="fishes" @dead-fish="deadFishHandler" @clear-fish="clearFishHandler"></Aquarium>
</div>
</template>
