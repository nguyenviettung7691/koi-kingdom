<script setup>
import { useFishLifecycle } from '../composable/fish.js';

const props = defineProps({
    fishes: Array,
    fishLifeCycles: Array,
    aquariumConfig: Array,
    aquariumUnlocks: Array,
    aquariumSelect: String
});

const emit = defineEmits(['unlockAquarium', 'selectAquarium']);

function getUnlockStatus(aquarium){
    return props.aquariumUnlocks.includes(aquarium.name);
}
function getSelectStatus(aquarium){
    return props.aquariumSelect === aquarium.name;
}

function getClass(aquarium){
    return ['aquarium max-w-sm bg-white border border-gray-200 rounded-lg shadow', {
        'unlocked': getUnlockStatus(aquarium),
        'selected': getSelectStatus(aquarium)
    }];
}

function getUnlockButtonClass(aquarium){
    return ['items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300', {
        'cursor-not-allowed bg-gray-700': !isAquariumUnlockCondtionMet(aquarium)
    }];
}

function isUnlockConditionMet(unlock){
    if(unlock.lifecycle){
        return props.fishes.filter(f => useFishLifecycle(f, props.fishLifeCycles).lifecycle.name == unlock.lifecycle).length >= unlock.count;
    } else if(unlock.fishType){
        return props.fishes.filter(f => f.type == unlock.fishType).length >= unlock.count;
    } else {
        return false;
    }
}

function getUnlockDescription(unlock){
    if(unlock.lifecycle) {
        return `Have at least <strong>${unlock.count}</strong> <em>${unlock.lifecycle}</em> fish.`;
    } else if(unlock.fishType) {
        return `Have at least <strong>${unlock.count}</strong> <em>${unlock.fishType}</em> fish.`;
    } else {
        return '';
    }
}

function isAquariumUnlockCondtionMet(aquarium){
    for(const unlock of aquarium.unlock){
        const result = isUnlockConditionMet(unlock);
        if(!result){
            return false;
        }
    }
    return true;
}

function unlockAquarium(aquarium){
    if(isAquariumUnlockCondtionMet(aquarium)) emit('unlockAquarium', aquarium.name)
}

function selectAquarium(aquarium){
    if(getUnlockStatus(aquarium)) emit('selectAquarium', aquarium.name)
}

</script>
<template>
    <div class="aquarium-list bg-white text-black bg-cyan-800 max-md:h-5 overflow-y-scroll max-md:py-2 px-5 py-20">
        <div class="flex flex-wrap gap-5">
            <div v-for="aquarium in props.aquariumConfig" :key="aquarium.name" :class="getClass(aquarium)">
                <button @click="selectAquarium(aquarium)" :disabled="!getUnlockStatus(aquarium)" type="button">
                    <img class="rounded-t-lg h-[220px] object-cover" :src="`/aquarium-${aquarium.name}.jpg`" :alt="aquarium.name" />
                </button>
                <div class="px-5 py-2">
                    <button @click="selectAquarium(aquarium)" :disabled="!getUnlockStatus(aquarium)" class="flex items-center" type="button">
                        <h5 class="text-2xl font-bold tracking-tight text-gray-900 uppercase">{{aquarium.name}}</h5>
                        <span v-show="getSelectStatus(aquarium)">✅</span>
                    </button>
                    <p v-if="aquarium.basic" class="mb-3 font-normal text-gray-700">This aquarium is unlock by default.</p>
                    <p v-else v-show="!getUnlockStatus(aquarium)" class="mb-3 font-normal text-gray-700 flex flex-col gap-2">
                        <div>Unlock conditions:</div>
                        <ul class="text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg">
                            <li v-for="(unlock, index) in aquarium.unlock" :key="index" class="w-full border-b border-gray-200 rounded-t-lg">
                                <div class="flex items-center pl-3">
                                    <input :checked="isUnlockConditionMet(unlock)" type="checkbox" disabled class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500">
                                    <label class="w-full py-3 ml-2 text-sm font-medium text-gray-900" v-html="getUnlockDescription(unlock)"></label>
                                </div>
                            </li>
                        </ul>
                        <button @click="unlockAquarium(aquarium)" :disabled="!isAquariumUnlockCondtionMet(aquarium)" type="button" :class="getUnlockButtonClass(aquarium)">
                            Unlock 🔓
                        </button>
                    </p>
                </div>
            </div>

        </div>
    </div>
</template>
<style scoped>
.collapse-aquarium .aquarium-list {
    flex-basis: 75%;
}
.aquarium-list {
    display: flex;
    flex-direction: column;
    flex-basis: 25%;
    gap: 20px;
}
.aquarium-list .aquarium:hover img {
    height: auto;
}
.aquarium-list .aquarium img {
    filter: grayscale(100%);
}
.aquarium-list .aquarium.unlocked img {
    filter: grayscale(0);
}
</style>