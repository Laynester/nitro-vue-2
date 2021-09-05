<script lang="ts">
import { Nitro } from "@nitrots/nitro-renderer";
export default {
    data() {
        return {
            hasAd: false,
            ad: "",
            selectedAd: ""
        };
    },
    mounted() {
        let visible = Nitro.instance.getConfiguration("interstitials")[
            "image.visibility"
        ];
        let rand = Math.floor(Math.random() * visible) + 1;
        this.hasAd = rand == visible;
        let ads = Nitro.instance.getConfiguration("interstitials")["images"];
        this.selectedAd = ads[Math.floor(Math.random() * ads.length)];

        this.ad =
            Nitro.instance.core.configuration.interpolate(
                Nitro.instance.getConfiguration("interstitials")["image.dir"]
            ) + this.selectedAd.image;
    },
    methods: {
        openUrl() {
            if (!this.selectedAd) return;

            if (this.selectedAd.url.startsWith("http")) {
                window.open(this.selectedAd.url);
            }
        }
    }
};
</script>

<template>
    <div class="interstitial-view">
        <div class="lstr-classic-frame" skin="0" v-if="$store.state.room.info">
            <div class="lstr-classic-frame-content">
                <div class="lstr-classic-frame-body text-center p-3">
                    <div
                        class="interstitial-image"
                        :style="{'background-image': `url(${ad})`}"
                        v-if="hasAd"
                        @click="openUrl()"
                    />
                    <span
                        v-html="$filters.localizeText('room.loading',['room'],[$store.state.room.info.data.roomName])"
                    />
                </div>
            </div>
        </div>
    </div>
</template>