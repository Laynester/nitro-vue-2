<script lang="ts">
import { IConfigurationManager, Nitro } from "@nitrots/nitro-renderer";
import { ConfigManager } from "../../../utils/functions";

export default {
    data() {
        return {
            backgroundColour: "#000",
            background: null,
            sun: null,
            drape: null,
            left: null,
            rightRepeat: null,
            right: null,
        };
    },
    mounted() {
        let images = Nitro.instance.getConfiguration("hotelview")["images"];
        let config = ConfigManager();
        this.backgroundColour = images["background.colour"];
        this.background = config.interpolate(images["background"]);
        this.sun = config.interpolate(images["sun"]);
        this.drape = config.interpolate(images["drape"]);
        this.left = config.interpolate(images["left"]);
        this.rightRepeat = config.interpolate(images["right.repeat"]);
        this.right = config.interpolate(images["right"]);
    },
};
</script>

<template>
    <div class="classic-hotelview" :style="{'background-color': backgroundColour}">
        <div
            v-if="background"
            class="background position-absolute"
            :style="`background-image:url(${background})`"
        ></div>
        <img v-if="sun" class="sun position-absolute" :src="sun" />
        <img v-if="drape" class="drape position-absolute" :src="drape" />
        <img v-if="left" class="left position-absolute" :src="left" />
        <img v-if="rightRepeat" class="rightRepeat position-absolute" :src="rightRepeat" />
        <img v-if="right" class="right position-absolute" :src="right" />
    </div>
</template>