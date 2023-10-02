<script setup>
import { computed, onMounted, onBeforeUnmount, ref } from 'vue'

const props = defineProps({
    type: String,
    name: String,
    id: Number,
    alive: Boolean,
    lifetime: Number,//miliseconds
    birthtime: Number,//miliseconds
    aquariumHeight: Number,
    aquariumWidth: Number
});

const emit = defineEmits(['feed', 'dead', 'clear']);

const lifetimeCountdown = ref(0);
const lifetimeTimeout = ref({});
const lifetimeInterval = ref({});
const swimTimeout = ref({});
const swimSpeed = ref('');
const swimDirection = ref([]);

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
    return props.lifetime ? (props.alive ? `/${props.type}.png` : `/dead.png`) : `/${props.type}.png`;
})
const fishImageStyle = computed(() => {
    return {
        transform: swimDirection.value[0] < 0 ? `scaleX(-1)` : ''
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
    if(props.alive){
        if(props.lifetime){
            let remainLifetime = props.birthtime ? (props.birthtime + props.lifetime) - Date.now() : props.lifetime;

            if(remainLifetime > 0) {
                lifetimeCountdown.value = remainLifetime;

                begineLifetimeCountdown(remainLifetime);

                lifetimeInterval.value = setInterval(() => {
                    lifetimeCountdown.value -= 500;
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

function tapFish(){
    if(props.alive){
        emit('feed', props.id);
        lifetimeCountdown.value = props.lifetime;

        clearTimeout(lifetimeTimeout.value);
        begineLifetimeCountdown();
    } else {
        emit('clear', props.id);
    }
}

function begineLifetimeCountdown(remainLifetime){
    lifetimeTimeout.value = setTimeout(() => {
        emit('dead', props.id);
        clearInterval(lifetimeInterval.value);
        beginSwim(true);
    }, remainLifetime ? remainLifetime : props.lifetime);
}

function beginSwim(up){
    let duration = (Math.random() + 10) * 1000,
        xCoor = getRandomNumber(-xSwimDistance.value, xSwimDistance.value),
        yCoor = up ? (-ySwimDistance.value - 100) : getRandomNumber(-ySwimDistance.value, ySwimDistance.value);
    swimSpeed.value = `${duration}ms`;
    swimDirection.value = [xCoor, yCoor];

    clearTimeout(swimTimeout.value);
    if(!up){
        swimTimeout.value = setTimeout(() => {
            beginSwim();
        }, duration);
    }
}

function getRandomNumber(min, max){
    return Math.floor(Math.random() * (max - min + 1) + min)
}

</script>

<template>
    <div class="fish" :style="fishStyle" @click="tapFish">
        <img class="fish-img" :src="fishImageSource" :style="fishImageStyle">
        <div v-if="name" class="fish-name rounded text-lg p-2">{{ name }}</div>
        <div v-if="lifetime" class="fish-lifetime rounded">
            <div class="bar" :style="fishLifetimeBarStyle"></div>
        </div>
        <div v-show="showFeedMe" class="fish-feed-me rounded text-base p-2 text-red-500">FEED ME!</div>
    </div>
</template>

<style scoped>
.fish{
    position: relative;
    cursor: pointer;
    transition-property: transform;
    transition-duration: 10000ms;
}
.fish-img {
    width: 100px;
    height: 60px;
    transition-property: all;
    transition-duration: 1000ms;
}
.fish-name {
    background-color: rgba(255,255,255,0.7);
    position: absolute;
    bottom: -40px;
    width: 100%;
}
.fish-lifetime {
    height: 10px;
    width: 100%;
    position: absolute;
    bottom: -50px;
}
.fish-feed-me {
    background-color: rgba(255,255,255,0.7);
    position: absolute;
    top: -40px;
}
</style>
