<script setup>

const props = defineProps({
    fishLifeCycles: Array,
    maximumLifetime: Object,
    feedConfig: Object
});

</script>
<template>
    <div class="howto bg-white text-black p-2 bg-cyan-800 max-md:h-5 overflow-y-scroll">
        <div class="text-xl">How to play:</div>
        <div>🐟 To add a fish: select a basic fish type, name the fish, and select the maximum lifetime of the fish. The
            maximum lifetime of a fish must be between {{ maximumLifetime.min }} seconds and {{ maximumLifetime.max }}
            seconds. The
            fish will die if you don't feed it after the fish's maximum lifetime has passed.</div>
        <div>🐟 Tap on the fish to feed it. Each feed will increase {{ feedConfig.increaseAmount }} seconds of lifetime. You
            can't feed the fish beyond
            its maximum lifetime.</div>
        <div>🐟 You have a feed bag that contains a finite number of fish feed. Every {{ feedConfig.replenishInterval / (60
            * 60 * 1000) }} hours since the last time you feed
            you will get {{ feedConfig.replenishAmount }} fish feed.</div>
        <div>🐟 The fish will grow in size after entering a new lifecycle stage based on its total lifetime:
            <ul>
                <li v-for="(lc, index) in fishLifeCycles" :key="lc.name">{{ lc.name }} (⭐x{{ index }}): {{ lc.miniumLifetime
                }} sec</li>
            </ul>
        </div>
        <div>🐟 The fish will display its information including: name, remaining lifetime (as healthbar), lifecycle stage
            (as stars), and maximum lifetime (as number of seconds).</div>
        <div>🐡 If the fish died, click on it to remove from the aquarium.</div>
        <div>🐡 You can reset the whole aquarium (if you're heartless enough)</div>
        <div>🐡 The more dead fishes you have in the aquarium, the more chance other fishes will die because of
            contamination.</div>
        <div>🐠 When the number of times a fish is fed reached a certain threshold, it may evolve into a new type of fish!
        </div>
        <div>🐠 The more spawning fishes you have in the aquarium, the more chance a new special type of fish will join the
            aquarium!</div>
        <div>🐠 Even better: the shorter lifetime those fishes have, the more chance you may have a mythical fish join the
            aquarium!</div>
    </div>
</template>
<style scoped>
.howto {
    display: flex;
    flex-direction: column;
    flex-basis: 25%;
    gap: 20px;
    padding: 20px;
}</style>