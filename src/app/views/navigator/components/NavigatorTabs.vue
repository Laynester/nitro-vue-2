<script lang="ts">
import { NavigatorListener } from "../NavigatorListener";
export default {
    methods: {
        selectTab(code) {
            NavigatorListener.getInstance().setCurrentContextByCode(code);
            NavigatorListener.getInstance().clearSearch();
            this.$store.state.navigator.selectedCategory = null;
            this.$store.state.navigator.selectedTab = null;
        }
    }
};
</script>

<template>
    <div class="d-flex">
        <div
            class="lstr-classic-tabs w-100"
            size="lg"
            :class="{'active':$store.state.navigator.topLevelContext.code == 'official_view'}"
            @click="selectTab('official_view')"
        >
            <div class="tab-icon public" />
            <span>{{$filters.localizeText('navigator.searchcode.title.official-root')}}</span>
        </div>
        <div
            class="lstr-classic-tabs w-100"
            size="lg"
            :class="{'active':$store.state.navigator.topLevelContext.code == 'hotel_view'}"
            @click="selectTab('hotel_view')"
        >
            <div class="tab-icon guest" />
            <span>{{$filters.localizeText('navigator.toplevelview.hotel_view')}}</span>
        </div>
    </div>
</template>