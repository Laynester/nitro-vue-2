<script lang="ts">
import { PurseListener } from "./PurseListener";
import store from "../../../utils/store";
import { Nitro } from "@nitrots/nitro-renderer";
import Fly from "./Fly.vue";
export default {
    components: { Fly },
    mounted() {
        PurseListener.getInstance();
    },
    computed: {
        coins() {
            let dec =
                store.state.user.credits /
                Nitro.instance.getConfiguration("purse")["coin.worth"];

            return parseInt(dec.toFixed(1));
        }
    }
};
</script>

<template>
    <Card
        :text="$filters.localizeText('purse.title')"
        :center="true"
        skin="purse"
        class="lstr-classic-purse"
        v-if="$store.state.uiVisible.purse"
        @clicked="$store.state.uiVisible.purse = false"
    >
        <div class="lstr-classic-purse-content">
            <div
                class="lstr-classic-purse-have"
                v-html="$filters.localizeText('purse.you.have',['credits'],[$store.state.user.credits])"
            />
            <div
                class="lstr-classic-purse-inner"
                :class="{'lstr-classic-purse-overflow': coins > 121}"
            >
                <span>{{ $filters.localizeText('purse.spend') }}</span>
                <div class="lstr-classic-purse-grid">
                    <template v-if="coins <= 121">
                        <div class="lstr-classic-purse-coin" v-for="(r,i) in coins" :key="i" />
                    </template>
                    <Fly fly="1" frames="4" v-if="!coins" />
                    <Fly fly="2" frames="4" v-if="!coins" />
                    <Fly fly="3" frames="4" v-if="!coins" />
                </div>
            </div>
            <Border
                skin="3"
                class="brown lstr-classic-purse-secondary text-center"
            >{{ $store.state.user.currencies.get(0) }} {{ $filters.localizeText('purse.secondary') }}</Border>
        </div>
    </Card>
</template>