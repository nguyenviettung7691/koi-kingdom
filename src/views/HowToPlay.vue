<script setup>

const props = defineProps({
    fishLifeCycles: Array,
    maximumLifetime: Object,
    feedConfig: Object
});

</script>
<template>
    <div class="howto bg-white text-black bg-cyan-800 max-md:h-5 overflow-y-scroll max-md:py-2 px-5 py-20">
        <div class="text-xl">How to play:</div>
        <div>🐟 To add a fish: select a basic fish type, name the fish, and select the maximum lifetime of the fish. The
            maximum lifetime of a fish must be between <span class="underline">{{ maximumLifetime.min }}</span> seconds and <span class="underline">{{ maximumLifetime.max }}</span>
            seconds. The
            fish will die if you don't feed it after the fish's maximum lifetime has passed.</div>
        <div>🐟 Tap on the fish to feed it. Each feed will increase <span class="underline">{{ feedConfig.increaseAmount }}</span> seconds of lifetime. You
            can't feed the fish beyond
            its maximum lifetime.</div>
        <div>🐟 You have a feed bag that contains a finite number of fish feed. Every <span class="underline">{{ feedConfig.replenishInterval / (60
            * 60 * 1000) }}</span> hours since the last time you feed
            you will get <span class="underline">{{ feedConfig.replenishAmount }}</span> fish feed.</div>
        <div>🐟 The fish will grow in size after entering a new lifecycle stage based on its total lifetime:
            <ul>
                <li v-for="(lc, index) in fishLifeCycles" :key="lc.name">{{ lc.name }} (⭐x{{ index }}): <span class="underline">{{ lc.miniumLifetime
                }}</span> sec</li>
            </ul>
        </div>
        <div>🐟 The fish will display its information including: name, remaining lifetime (as healthbar), lifecycle stage
            (as stars), and maximum lifetime (as number of seconds).</div>
        <div>🐡 If the fish died, click on it to remove from the aquarium.</div>
        <div>🐡 You can reset the whole aquarium (if you're heartless enough)</div>
        <div>🐡 The more dead fishes you have in the aquarium, the more chance other fishes will die because of
            contamination.</div>
        <div>🐠 When the number of times a fish is fed reached a certain threshold, it may evolve into a <i>gemstone</i>
            fish!</div>
        <div>🐠 The more spawning fishes you have in the aquarium, the more chance an <i>elemental</i> fish will join the
            aquarium!</div>
        <div>🐠 Even better: the shorter lifetime those fishes have, the more chance you may have a
            <strong>mythical</strong> fish join the aquarium!</div>
        <div>♒ You can unlock new aquarium appearances by clearing the required conditions. You can check the details in the "Aquarium List" tab.</div>
    </div>
</template>
<style scoped>
.collapse-aquarium .howto {
    flex-basis: 75%;
}
.howto {
    display: flex;
    flex-direction: column;
    flex-basis: 25%;
    gap: 20px;
}</style>