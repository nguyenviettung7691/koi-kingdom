<script setup>
import { computed, ref } from 'vue';
import Fish from './Fish.vue';

defineProps({
    fishes: Array
});

const aquarium = ref(null);

const aquariumHeight = computed(() => { return aquarium.value.clientHeight; });
const aquariumWidth = computed(() => { return aquarium.value.clientWidth; });

const emit = defineEmits(['deadFish', 'clearFish']);


function feedHandler(id) {
    emit('feedFish', id);
}
function deadHandler(id) {
    emit('deadFish', id);
}
function clearHandler(id) {
    emit('clearFish', id);
}
</script>

<template>
    <div class="aquarium" ref="aquarium">
        <Fish v-for="fish in fishes" :key="fish.id" :type="fish.type" :name="fish.name" :id="fish.id" :alive="fish.alive"
            :lifetime="fish.lifetime" :birthtime="fish.birthtime" :aquarium-height="aquariumHeight"
            :aquarium-width="aquariumWidth" @feed="feedHandler" @dead="deadHandler" @clear="clearHandler"></Fish>
    </div>
</template>

<style scoped>
.aquarium {
    background: url('/bg.jpg');
    flex-basis: 75%;
    position: relative;
}

.aquarium .fish {
    position: absolute;
    top: 50%;
    left: 50%;
}
</style>
