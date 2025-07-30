<script setup>
import { inject, ref, computed } from 'vue';
import config from '../json/config.json';

const rng = inject('rng');
const aquarium = inject('aquarium');
const store = inject('store');
const { rngConfig, aquariumConfig } = config;

const evolveFishTrigger = ref()
const evolveFishSimulate = ref()
const unlockAquarium = ref()
const feedbagCount = ref()

const normalFishes = computed(() => store.fishes?.value?.filter(f => !['gemstone-','element-','mythical-'].some(prefix => f.type.startsWith(prefix))))

</script>
<template>
    <div class="fish-form bg-cyan-800 max-md:h-5 overflow-y-scroll max-md:py-2 px-5 py-20">
        <div>
            <div class="flex gap-2">
                <h3 class="text-white font-bold text-xl">RNG Trigger Events</h3>
            </div>
            <div class="flex flex-col gap-2">
                <button type="button" class="text-sm rounded bg-white p-1" @click="rng.fishDie">Fish Die</button>
                <button type="button" class="text-sm rounded bg-white p-1" @click="rng.addElementFish">Add Element Fish</button>
                <button type="button" class="text-sm rounded bg-white p-1" @click="rng.addMythicalFish">Add Mythical Fish</button>
                <div class="flex gap-1">
                    <button type="button" class="text-sm rounded bg-white p-1" @click="rng.evolveFishHandler(evolveFishTrigger)">Evolve to Gemstone Fish</button>
                    <select name="evolve-fish-trigger" id="evolve-fish-trigger" class="text-sm rounded" v-model="evolveFishTrigger">
                        <option v-for="fish in normalFishes" :key="fish.id" :value="fish.id">{{ fish.name }}</option>
                    </select>
                </div>
            </div>
        </div>
        <div>
            <div class="flex gap-2">
                <h3 class="text-white font-bold text-xl">RNG Simulate Events (in console)</h3>
            </div>
            <div class="flex flex-col gap-2">
                <button type="button" class="text-sm rounded bg-white p-1" @click="rng.willFishDie(rngConfig)">Fish Die</button>
                <button type="button" class="text-sm rounded bg-white p-1" @click="rng.willAddElementFish(rngConfig)">Add Element Fish</button>
                <button type="button" class="text-sm rounded bg-white p-1" @click="rng.willAddMythicalFish(rngConfig)">Add Mythical Fish</button>
                <div class="flex gap-1">
                    <button type="button" class="text-sm rounded bg-white p-1" @click="rng.willFishEvolve(evolveFishSimulate)">Evolve to Gemstone Fish</button>
                    <select name="evolve-fish-simulate" id="evolve-fish-simulate" class="text-sm rounded" v-model="evolveFishSimulate">
                        <option v-for="fish in normalFishes" :key="fish.id" :value="fish.feedCount">{{ fish.name }}</option>
                    </select>
                </div>
            </div>
        </div>
        <div>
            <div class="flex gap-2">
                <h3 class="text-white font-bold text-xl">Aquarium Trigger Events</h3>
            </div>
            <div class="flex flex-col gap-2">
                <div class="flex gap-1">
                    <button type="button" class="text-sm rounded bg-white p-1" @click="aquarium.unlockAquariumHandler(unlockAquarium)">Unlock aquarium</button>
                    <select name="unlock-aquarium" id="unlock-aquarium" class="text-sm rounded" v-model="unlockAquarium">
                        <option v-for="aquarium in aquariumConfig" :key="aquarium.name" :value="aquarium.name">{{ aquarium.name }}</option>
                    </select>
                </div>
                <div class="flex gap-1">
                    <button type="button" class="text-sm rounded bg-white p-1" @click="aquarium.updateFeedBagHandler(feedbagCount)">Set feedbag</button>
                    <input type="number" name="feedbag-count" id="feedbag-count" class="text-sm rounded" v-model="feedbagCount">
                </div>
            </div>
        </div>
        <div>
            <div class="flex gap-2">
                <h3 class="text-white font-bold text-xl">Aquarium Simulate Events (in console)</h3>
            </div>
            <div class="flex flex-col gap-2">
                <button type="button" class="text-sm rounded bg-white p-1" @click="aquarium.willReplenishFeedBag()">Replenish feedbag</button>
            </div>
        </div>
    </div>
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
</style>
