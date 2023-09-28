<script setup>
import { computed, onMounted, ref } from 'vue'

const props = defineProps({
    type: String,
    name: String,
    id: Number,
    alive: Boolean,
    lifetime: Number,
    aquariumHeight: Number,
    aquariumWidth: Number
});

const emit = defineEmits(['dead', 'clear']);

const lifetimeCountdown = ref(0);
const lifetimeTimeout = ref({});
const lifetimeInterval = ref({});
const swimTimeout = ref({});
const swimSpeed = ref('');
const swimDirection = ref('');

const fishStyle = computed(() => {
    return { 
        backgroundImage: props.lifetime ? (props.alive ? `url('/${props.type}.png')` : `url('/dead.png')`) : `url('/${props.type}.png')`,
        transitionDuration: swimSpeed.value,
        transform: swimDirection.value ? `translate(${swimDirection.value})` : ''
    }
})
const fishLifetimeBarStyle = computed(() => {
    return {
        backgroundColor: lifetimeCountdown.value > 3000 ? 'lime' : 'red',
        width: (lifetimeCountdown.value * 100) / props.lifetime + '%',
        height: '100%'
    }
})
const showFeedMe = computed(() => {
    return lifetimeCountdown.value < 3000 && props.alive && props.lifetime
})

const xSwimDistance = computed(() => { return (props.aquariumWidth / 2) - 100; });
const ySwimDistance = computed(() => { return (props.aquariumHeight / 2) - 100; });

onMounted(() => {
  if(props.lifetime){
    lifetimeCountdown.value = props.lifetime;

    begineLifetimeCountdown();

    lifetimeInterval.value = setInterval(() => {
        lifetimeCountdown.value -= 100;
    }, 100);

    setTimeout(() => {
        beginSwim();
    }, 500);
  }
})

function tapFish(){
    if(props.alive){
        lifetimeCountdown.value = props.lifetime;

        clearTimeout(lifetimeTimeout.value);
        begineLifetimeCountdown();
    } else {
        emit('clear', props.id);
    }
}

function begineLifetimeCountdown(){
    lifetimeTimeout.value = setTimeout(() => {
        emit('dead', props.id);
        clearInterval(lifetimeInterval.value);
        beginSwim(true);
    }, props.lifetime);
}

function beginSwim(up){
    let duration = (Math.random() + 10) * 1000,
        xCoor = getRandomNumber(-xSwimDistance.value, xSwimDistance.value),
        yCoor = up ? (-ySwimDistance.value - 100) : getRandomNumber(-ySwimDistance.value, ySwimDistance.value);
    swimSpeed.value = `${duration}ms`;
    swimDirection.value = `${xCoor}px, ${yCoor}px`;

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
        <div v-if="name" class="fish-name rounded text-lg p-2">{{ name }}</div>
        <div v-if="lifetime" class="fish-lifetime rounded">
            <div class="bar" :style="fishLifetimeBarStyle"></div>
        </div>
        <div v-show="showFeedMe" class="fish-feed-me rounded text-base p-2 text-red-500">FEED ME!</div>
    </div>
</template>

<style scoped>
.fish{
    width: 100px;
    height: 60px;
    background-size: contain;
    background-repeat: no-repeat;
    position: relative;
    cursor: pointer;
    transition-property: transform;
    transition-duration: 10000ms;
}
.fish-name {
    background-color: rgba(255,255,255,0.5);
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
