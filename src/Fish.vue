<script setup>
import { computed, onMounted, onBeforeUnmount, ref } from 'vue'
import config from './json/config.json'
import { useFishImagePath } from './composable/fish.js'

const props = defineProps({
    type: String,
    name: String,
    id: Number,
    alive: Boolean,
    lifetime: Number,//miliseconds
    remainLifetime: Number,//miliseconds
    birthtime: Number,//miliseconds
    feedtime: Number,//miliseconds
    remainLifetimeWhenFed: Number,//miliseconds
    feedCount: Number,
    feedBag: Number,
    aquariumHeight: Number,
    aquariumWidth: Number,
    focused: Boolean
});

const emit = defineEmits(['feed', 'feedEmpty', 'countdown', 'dead', 'clear', 'evolve']);

const lifetimeCountup = ref(0);
const lifetimeCountdown = ref(0);
const lifetimeTimeout = ref({});
const lifetimeInterval = ref({});
const swimTimeout = ref({});
const swimSpeed = ref('');
const swimDirection = ref([]);
const highlight = ref(false);

const { fishLifeCycles, feedConfig, rngConfig } = config;

const currentLifecycle = computed(() => {
    if (fishLifeCycles && props.alive) {
        for (let i = 0; i < fishLifeCycles.length; i++) {
            let lifecycle = fishLifeCycles[i];
            if (lifetimeCountup.value <= lifecycle.miniumLifetime) {
                lifecycle['stars'] = i;
                return lifecycle;
            }
        }
    }
    return null;
})
const lifetimeWarning = computed(() => {
    return (props.lifetime * 30) / 100;
})
const fishStyle = computed(() => {
    return {
        transitionDuration: swimSpeed.value,
        transform: swimDirection.value[0] ? `translate(${swimDirection.value[0]}px, ${swimDirection.value[1]}px)` : ''
    }
})
const fishImageSource = computed(() => {
    return useFishImagePath(props).path;
})
const fishImageStyle = computed(() => {
    return {
        transform: (currentLifecycle.value ? `scale(${currentLifecycle.value.size})` : '') + (swimDirection.value[0] < 0 ? ` scaleX(-1)` : '')
    }
})
const fishLifetimeBarStyle = computed(() => {
    return {
        backgroundColor: lifetimeCountdown.value > lifetimeWarning.value ? 'lime' : 'red',
        width: (lifetimeCountdown.value * 100) / props.lifetime + '%',
        height: '100%'
    }
})
const showFeedMe = computed(() => {
    return lifetimeCountdown.value < lifetimeWarning.value && props.alive && props.lifetime;
})

const xSwimDistance = computed(() => { return (props.aquariumWidth / 2) - 100; });
const ySwimDistance = computed(() => { return (props.aquariumHeight / 2) - 100; });

onMounted(() => {
    if (props.alive) {
        if (props.lifetime) {
            let passedTime = Date.now() - props.feedtime;
            let remainingLifetime = props.remainLifetimeWhenFed - passedTime;

            if (remainingLifetime > 0) {
                lifetimeCountdown.value = remainingLifetime;
                lifetimeCountup.value = (Date.now() - props.birthtime) / 1000;

                begineLifetimeCountdown(lifetimeCountdown.value);

                runRNG(rngConfig);

                highlightFish();

                lifetimeInterval.value = setInterval(() => {
                    lifetimeCountdown.value -= 500;
                    lifetimeCountup.value += 0.5;

                    emit('countdown', props.id, lifetimeCountdown.value);
                }, 500);

                setTimeout(() => {
                    beginSwim();
                }, 500);
            } else {
                emit('dead', props.id);
                beginSwim(true);
            }
        }
    } else {
        beginSwim(true);
    }
})

onBeforeUnmount(() => {
    clearTimeout(lifetimeTimeout.value);
    clearTimeout(swimTimeout.value);
    clearInterval(lifetimeInterval.value);
})

function runRNG(rngConfig) {
    //config
    const { feedCount, feedCountModifer } = rngConfig.evolving;
    const willFishEvolve = () => {
        let probability = 0;

        if (feedCount > 10) {
            probability += feedCount * feedCountModifer; // Increase by 1% for each count
        }

        const randomValue = Math.random();

        if (randomValue <= probability) {
            return true;
        } else {
            return false;
        }
    }

    if (willFishEvolve()) {
        emit('evolve', props.id);
    }
}

function tapFish() {
    if (props.alive) {
        if (props.feedBag) {
            const newRemainingLifetime = lifetimeCountdown.value + (feedConfig.increaseAmount * 1000);
            lifetimeCountdown.value = Math.min(newRemainingLifetime, props.lifetime);

            emit('feed', props.id, lifetimeCountdown.value);

            clearTimeout(lifetimeTimeout.value);
            begineLifetimeCountdown();

            highlightFish();
        } else {
            emit('feedEmpty');
        }
    } else {
        emit('clear', props.id);
    }
}

function begineLifetimeCountdown(remainLifetime) {
    lifetimeTimeout.value = setTimeout(() => {
        emit('dead', props.id);
        clearInterval(lifetimeInterval.value);
        beginSwim(true);
    }, remainLifetime ? remainLifetime : props.lifetime);
}

function beginSwim(up) {
    let duration = getRandomNumber(5, 15) * 1000,
        xCoor = getRandomNumber(-xSwimDistance.value, xSwimDistance.value),
        yCoor = up ? (-ySwimDistance.value - 50) : getRandomNumber(-ySwimDistance.value, ySwimDistance.value);
    swimSpeed.value = `${duration}ms`;
    swimDirection.value = [xCoor, yCoor];

    clearTimeout(swimTimeout.value);
    if (!up) {
        swimTimeout.value = setTimeout(() => {
            beginSwim();
        }, duration);
    }
}

function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

function highlightFish() {
    highlight.value = true;
    setTimeout(() => {
        highlight.value = false;
    }, 1000);
}

</script>

<template>
    <div :class="['fish', { 'highlight': highlight, 'focused': focused }]" :style="fishStyle" @click="tapFish">
        <img class="fish-img" :src="fishImageSource" :style="fishImageStyle">
        <div v-if="currentLifecycle" class="fish-lifecycle text-xs relative">
            <span v-for="s in currentLifecycle.stars">⭐</span>
        </div>
        <div v-if="name" class="fish-name rounded text-lg p-2">{{ name }}</div>
        <div v-if="lifetime && alive" class="fish-lifetime rounded">
            <div class="bar" :style="fishLifetimeBarStyle"></div>
            <div class="lifetime">{{ lifetime / 1000 }}</div>
        </div>
        <div v-show="showFeedMe" class="fish-feed-me rounded text-base font-bold p-2 text-red-500">FEED ME!</div>
    </div>
</template>

<style scoped>
.fish {
    position: relative;
    cursor: pointer;
    transition-property: transform;
    transition-duration: 10000ms;
}

.fish-img {
    height: 60px;
    transition-property: all;
    transition-duration: 1000ms;
}

.fish-name {
    background-color: rgba(255, 255, 255, 0.7);
    position: absolute;
    bottom: -40px;
    width: 100%;
    white-space: nowrap;
}

.fish-lifetime {
    height: 10px;
    width: 100%;
    position: absolute;
    bottom: -50px;
    background-color: rgba(255, 255, 255, 0.7);
}

.fish-lifetime .lifetime {
    position: absolute;
    top: 0;
    right: 0;
    font-size: 10px;
    line-height: 10px;
    font-weight: bold;
}

.fish-feed-me {
    background-color: rgba(255, 0, 0, 0.7);
    color: white;
    position: absolute;
    top: -40px;
    white-space: nowrap;
}

.highlight {
    background-blend-mode: screen;
    animation: highlight 1000ms ease-out;
}

.focused img {
    background-blend-mode: screen;
    animation: focused 1000ms ease-out;
    animation-iteration-count: infinite;
}

@keyframes highlight {
    0% {
        background-color: cyan;
    }

    100% {
        background-color: transparent;
    }
}

@keyframes focused {
    0% {
        filter: brightness(1);
    }

    50% {
        filter: brightness(5);
    }

    100% {
        filter: brightness(1);
    }
}
</style>
