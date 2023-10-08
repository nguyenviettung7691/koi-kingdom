<script setup>

const props = defineProps({
    fishLifeCycles: Array
});

</script>
<template>
    <div class="fish-list bg-white text-black p-2 bg-white text-black p-2 bg-cyan-800 max-md:h-5 overflow-y-scroll">
            <div class="text-xl">Fish List</div>
            
        </div>
</template>
<style scoped>
.fish-list {
    display: flex;
    flex-direction: column;
    flex-basis: 25%;
    gap: 20px;
    padding: 20px;
}
</style>