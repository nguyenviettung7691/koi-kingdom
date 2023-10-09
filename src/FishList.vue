<script setup>

const props = defineProps({
    fishes: Array
});

</script>
<template>
    <div class="fish-list-container bg-white text-black p-2 bg-white text-black p-2 bg-cyan-800 max-md:h-5 overflow-y-scroll">
            <div class="text-xl">Fish List</div>
            <div class="fish-list">
                <div v-for="f in fishes" :key="f.id">
                    {{ f.name }}
                </div>
            </div>
        </div>
</template>
<style scoped>
.fish-list-container {
    display: flex;
    flex-direction: column;
    flex-basis: 25%;
    gap: 20px;
    padding: 20px;
}
</style>