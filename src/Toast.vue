<script setup>
import { onMounted, ref } from 'vue';

const props = defineProps({
    fishDied: Boolean
})

const toasts = ref([]);

onMounted(() => {
    if (props.fishDied) {
        toasts.value.push({
            id: 'toast-died-fish',
            message: 'A fish has died because of contamination from other dead fishes in the aquarium. Try to remove all dead fishes from the aquarium as soon as possible.',
            type: 'warning'
        })
    }
})

function getToastClass(type) {
    return ['flex items-center w-full max-w-xs p-4 text-gray-500 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-800 border-l-4', 
        { 'border-orange-500': type == 'warning' },
        { 'border-red-500': type == 'error' }
    ];
}
function getToastIcon(type) {
    return type == 'warning' ? '⚠' : '❌';
}
</script>
<template>
    <div class="absolute right-0 top-0">
        <div v-for="toast in toasts" :key="toast.id" :id="toast.id" :class="getToastClass(toast.type)" role="alert">
            <div class="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 rounded-lg">{{ getToastIcon(toast.type) }}</div>
            <div class="ml-3 text-sm font-normal">{{ toast.message }}</div>
            <button type="button"
                class="ml-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700"
                :data-dismiss-target="`#${toast.id}`" aria-label="Close">
                <span class="sr-only">Close</span>
                <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
                    viewBox="0 0 14 14">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                </svg>
            </button>
        </div>
    </div>
</template>