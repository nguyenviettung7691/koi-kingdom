<script setup>
import { ClockIcon, MagnifyingGlassMinusIcon, MagnifyingGlassPlusIcon } from '@heroicons/vue/24/solid';

const props = defineProps({
    fishLifeCycles: Array,
    maximumLifetime: Object,
    feedConfig: Object
});

</script>
<template>
    <div class="guide bg-white text-black bg-cyan-800 max-md:h-5 overflow-y-scroll max-md:py-2 px-5 py-20">
        <div class="text-xl">Playing guide:</div>
        <div>🐟 To add a fish: select a beginning fish type, name the fish, and select the maximum lifetime of the fish.
            You can choose any beginning fish type you like, it's only for aesthetics purpose. The purpose of the game is to evolve the fish from its beginning type to a more beautiful type.
            The maximum lifetime of a fish must be between <span class="underline">{{ maximumLifetime.min }}</span> seconds and <span class="underline">{{ maximumLifetime.max }}</span>
            seconds. The fish will die if you don't feed it after the fish's maximum lifetime has passed
            (which means the max lifetime (green HP bar <div class="inline-block bg-lime-400 w-6 h-2"></div>) will decreases overtime).</div>
        <div>🐟 You can input your own max lifetime number (in seconds), or you can select from the pre-defined sets of lifetime.
            For example: if you select <div class="inline-block text-sm rounded bg-white p-1 border-sky-400 border-2">juvenile {{ "⭐".repeat(2) }} (7000s)</div>, it means the fish would have max lifetime of <span class="underline">7000</span> seconds,
            and it is also the time required for the fish to reached the "juvenile" stage.
            The fish will grow in size after entering a new lifecycle stage based on its total lifetime:
            <div class="relative overflow-x-auto">
                <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" class="px-6 py-3">
                                Stage
                            </th>
                            <th scope="col" class="px-6 py-3">
                                Rarity
                            </th>
                            <th scope="col" class="px-6 py-3">
                                Lifetime (seconds)
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(lc, index) in fishLifeCycles" :key="lc.name" class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200">
                            <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                {{ lc.name }}
                            </th>
                            <td class="px-6 py-4">
                                {{ index ? `${"⭐".repeat(index)}` : 'N/A' }}
                            </td>
                            <td class="px-6 py-4">
                                <span class="underline">{{ lc.miniumLifetime}}</span> 
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

        </div>
        <div>🐟 Tap on the fish to feed it. Each feed will increase <span class="underline">{{ feedConfig.increaseAmount }}</span> seconds of lifetime <div class="inline-block bg-lime-400 w-6 h-2"></div>. You
            can't feed the fish beyond its maximum lifetime.
            You have a food can (which you can check by clicking on the food can 🥫 in the lower left of the aquarium) that contains a finite number of fish feed 🍥. Every <span class="underline">{{ feedConfig.replenishInterval / (60
            * 60 * 1000) }}</span> hours since the last time you feed <ClockIcon class="w-3 h-3 inline-block text-blue-600" />
            you will get <span class="underline">{{ feedConfig.replenishAmount }}</span> fish feed.</div>
        <div>🐟 The fish <img class="w-10 inline-block" src="/fish/blue.png"></img> will display its information including: name <div class="inline-block rounded text-md p-1 bg-gray-200">Nemo</div>, remaining lifetime (as healthbar <div class="inline-block bg-lime-400 w-6 h-2"></div>), lifecycle stage
            (as stars ⭐), and maximum lifetime (as number of seconds <div class="inline-block bg-lime-400 w-16 h-4 font-bold text-sm text-right">200000</div>).</div>
        <div>🐡 If the fish died, click on it <img class="w-10 inline-block bg-black" src="/dead.png"></img> to remove from the aquarium.
            The more dead fishes you have in the aquarium, the more chance other fishes will die because of
            contamination.</div>
        <div>🐡 You can reset the whole aquarium including all fishes, food can, aquarium list
            by clicking <div class="inline-block text-sm rounded bg-white p-1 text-red-500 border-sky-500 border-2">Reset aquarium ❌</div> in the lower right of the aquarium.</div>
        <div>🐠 When the number of times a fish is fed reached a certain threshold, it may evolve into a random <img class="w-10 inline-block" src="/fish/gemstone/gemstone-pearl.png"></img> <i>gemstone</i>
            fish!</div>
        <div>🐠 The more spawning fishes you have in the aquarium, the more chance a random <img class="w-10 inline-block" src="/fish/element/element-fire.png"></img> <i>elemental</i> fish will join the
            aquarium!</div>
        <div>🐠 Even better: the shorter lifetime those fishes have, the more chance you may have a random
            <img class="w-10 inline-block" src="/fish/mythical/mythical-koinobori.png"></img> <strong>mythical</strong> fish join the aquarium!</div>
        <div>♒ You can unlock 🔓 new aquarium appearances by clearing the required conditions. You can check the details in the "Aquarium List" tab.</div>
        <div>♒ The lower right of aquarium is where you can zoom out/in <MagnifyingGlassMinusIcon class="w-7 h-7 inline-block bg-white text-black rounded border-sky-500 border-2"></MagnifyingGlassMinusIcon> <MagnifyingGlassPlusIcon class="w-7 h-7 inline-block bg-white text-black rounded border-sky-500 border-2"></MagnifyingGlassPlusIcon> the fishes,
            toggle ↔️ the size of the left panel.</div>
    </div>
</template>
<style scoped>
.collapse-aquarium .guide {
    flex-basis: 75%;
}
.guide {
    display: flex;
    flex-direction: column;
    flex-basis: 25%;
    gap: 20px;
}
</style>