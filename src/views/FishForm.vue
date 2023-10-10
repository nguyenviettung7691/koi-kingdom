<script setup>
import fishNames from '../json/fishNames.json';
import Fish from '../Fish.vue';
import { ref, watch } from 'vue';

const fishTypes = ['golden-purple-fish', 'goldfish', 'guppie', 'tropical-fish', 'tuna', 'orange', 'koi', 'clown', 'blue', 'royal-angelfish'];

const props = defineProps({
    fishLifeCycles: Array,
    maximumLifetime: Object
});

const fishTypeModel = ref('');
const fishNameModel = ref('');
const maximumLifetimeModel = ref(90);

watch(maximumLifetimeModel, (newMaxLifetime) => {
    maximumLifetimeModel.value = Math.min(Math.max(newMaxLifetime, props.maximumLifetime.min), props.maximumLifetime.max);
});

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
            <h4 class="text-white font-bold text-lg">Maximum lifetime <small>({{ maximumLifetime.min }} ~ {{ maximumLifetime.max }} seconds)</small></h4>
            <div class="flex flex-wrap gap-1">
                <button type="button" class="text-sm rounded bg-white p-1" v-for="lifecycle in fishLifeCycles"
                    :key="lifecycle.name" @click="setLifecycle(lifecycle)">{{ lifecycle.name }} ({{ lifecycle.miniumLifetime
                    }})</button>
            </div>
            <input type="number" class="rounded text-xl p-2" required v-model="maximumLifetimeModel" :min="maximumLifetime.min" :max="maximumLifetime.max">
        </div>
        <div>
            <button type="submit" class="text-2xl rounded bg-blue-500 p-5 text-white">Add fish ＋</button>
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
