<script setup>
import Fish from './Fish.vue';
import { ref } from 'vue';

const fishTypes = ['golden-purple-fish', 'goldfish', 'guppie', 'tropical-fish', 'tuna', 'orange', 'koi', 'clown', 'blue', 'royal-angelfish'];
const fishNames = ["Nemo", "Dory", "Bubbles", "Finny", "Splash", "Flounder", "Ariel", "Sebastian"];

const props = defineProps({
    fishLifeCycles: Array
});

const fishTypeModel = ref('');
const fishNameModel = ref('');
const maximumLifetimeModel = ref(30);

const emit = defineEmits(['addFish']);

function addFish(e) {
    const form = e.target;
    if (form.checkValidity()) {
        emit('addFish', fishTypeModel.value, fishNameModel.value, Number(maximumLifetimeModel.value));
        fishNameModel.value = '';
    }
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

</script>
<template>
    <form class="fish-form bg-cyan-800 max-md:h-5 overflow-y-scroll" @submit.prevent="addFish">
        <div>
            <h3 class="text-white font-bold text-xl">Fish type</h3>
            <div class="max-md:h-24 max-md:whitespace-nowrap overflow-x-auto overflow-y-hidden">
                <label v-for="(fishType, index) in fishTypes" class="fish-type-select" :key="index">
                    <input type="radio" name="fish-type" required :id="'fish-type' + index" :value="fishType"
                        v-model="fishTypeModel">
                    <Fish :type="fishType"></Fish>
                </label>
            </div>
        </div>
        <div>
            <div class="flex gap-2">
                <h3 class="text-white font-bold text-xl">Fish name</h3>
                <button type="button" class="text-sm rounded bg-white p-1" @click="generateFishName">Random name</button>
            </div>
            <input type="text" class="rounded text-2xl p-3" required v-model="fishNameModel">
        </div>
        <div>
            <h4 class="text-white font-bold text-lg">Maximum lifetime (seconds)</h4>
            <div class="flex flex-wrap gap-1">
                <button type="button" class="text-sm rounded bg-white p-1" v-for="lifecycle in fishLifeCycles"
                    :key="lifecycle.name" @click="setLifecycle(lifecycle)">{{ lifecycle.name }} ({{ lifecycle.miniumLifetime
                    }})</button>
            </div>
            <input type="number" class="rounded text-xl p-2" required v-model="maximumLifetimeModel">
        </div>
        <div>
            <button type="submit" class="text-2xl rounded bg-blue-500 p-5 text-white">Add fish ＋</button>
        </div>
        <div class="bg-white text-black p-2">
            <div class="text-xl">How to play:</div>
            <div>🐟 To add a fish: select a basic fish type, name the fish, and select the maximum lifetime of the fish. The fish will die if you don't feed it after the fish's maximum lifetime has passed.</div>
            <div>🐟 Tap on the fish to feed it. Each feed will increase 6000 seconds of lifetime. You can't feed the fish beyond its maximum lifetime.</div>
            <div>🐟 You have a feed bag that contains a finite number of fish feed. Every 6 hours since the last time you feed you will get 1 fish feed.</div>
            <div>🐟 The fish will grow in size after entering a new lifecycle stage based on its total lifetime:
                <ul>
                    <li v-for="(lc, index) in fishLifeCycles" :key="lc.name">{{ lc.name }} (⭐x{{ index }}): {{ lc.miniumLifetime }} sec</li>
                </ul>
            </div>
            <div>🐟 The fish will display its information including: name, remaining lifetime (as healthbar), lifecycle stage (as stars), and maximum lifetime (as number of seconds).</div>
            <div>🐡 If the fish died, click on it to remove from the aquarium.</div>
            <div>🐡 You can reset the whole aquarium (if you're heartless enough)</div>
            <div>🐡 The more dead fishes you have in the aquarium, the more chance other fishes will die because of contamination.</div>
            <div>🐠 When the number of times a fish is fed reached a certain threshold, it may evolve into a new type of fish!</div>
            <div>🐠 The more spawning fishes you have in the aquarium, the more chance a new special type of fish will join the aquarium!</div>
            <div>🐠 Even better: the shorter lifetime those fishes have, the more chance you may have a mythical fish join the aquarium!</div>
        </div>
    </form>
</template>
<style scoped>
.fish-form {
    display: flex;
    flex-direction: column;
    flex-basis: 25%;
    gap: 20px;
    padding: 20px;
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
}

.fish-type-select input {
    display: none;
}

.fish-type-select input:checked~.fish {
    filter: drop-shadow(3px 1px 0 lime) drop-shadow(-3px -1px 0 lime);
}
</style>
