<script setup>
import Fish from './Fish.vue';
import { ref } from 'vue';

const fishTypes = ['golden-purple-fish', 'goldfish', 'guppie', 'tropical-fish', 'tuna'];

const fishTypeModel = ref('');
const fishNameModel = ref('');

const emit = defineEmits(['addFish']);

function addFish(){
    if(fishTypeModel.value && fishNameModel.value)
    emit('addFish', fishTypeModel.value, fishNameModel.value);
    fishTypeModel.value = '';
    fishNameModel.value = '';
}

</script>
<template>
    <div class="fish-form bg-cyan-800">
        <h3 class="text-white font-bold text-xl">Fish type</h3>
        <div>
            <label v-for="(fishType, index) in fishTypes" class="fish-type-select" :key="index">
                <input type="radio" name="fish-type" :id="'fish-type' + index" :value="fishType" v-model="fishTypeModel">
                <Fish :type="fishType"></Fish>
            </label>
        </div>
        <h3 class="text-white font-bold text-xl">Fish name</h3>
        <input type="text" class="rounded text-2xl p-3" v-model="fishNameModel">
        <button type="button" class="text-2xl rounded bg-red-500 p-5 text-white" @click="addFish">Add fish</button>
    </div>
</template>
<style scoped>
.fish-form {
    display: flex;
    flex-direction: column;
    flex-basis: 25%;
    gap: 20px;
    padding: 20px;
}
.fish-type-select {
    display: inline-block;
    cursor: pointer;
    margin: 5px;
}
.fish-type-select input{
    display: none;
}
.fish-type-select input:checked ~ .fish{
    filter: drop-shadow(3px 1px 0 cyan) drop-shadow(-3px -1px 0 cyan);
}
</style>
