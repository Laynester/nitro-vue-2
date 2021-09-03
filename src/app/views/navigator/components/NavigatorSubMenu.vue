<script>
import { Nitro, DesktopViewComposer } from "@nitrots/nitro-renderer";
import { NavigatorListener } from "../NavigatorListener";

export default {
    data() {
        return {
            search: null,
        };
    },
    mounted() {
        this.search = this.$filters.localizeText("navigator.search.info");
    },
    methods: {
        hotelview() {
            if (Nitro.instance.roomSessionManager.getSession(-1)) {
                Nitro.instance.communication.connection.send(
                    new DesktopViewComposer()
                );

                Nitro.instance.roomSessionManager.removeSession(-1);
            }
        },
        selectTab(tab) {
            this.$store.state.navigator.selectedTab = tab;

            if (tab == "search") {
                NavigatorListener.getInstance().clearSearch();
                return;
            }

            NavigatorListener.getInstance().setCurrentContextByCode(
                "myworld_view"
            );
            NavigatorListener.getInstance().clearSearch();
        },
    },
    computed: {
        selectedTab() {
            return this.$store.state.navigator.selectedTab;
        },
    },
};
</script>

<template>
    <div
        class="classic-navigator-sub-menu-tabs d-flex flex-row"
        v-if="$store.state.navigator.topLevelContext.code !== 'official_view'"
        :class="{'menuEnabled': selectedTab}"
    >
        <div
            class="classic-navigator-sub-menu-tab w-100 d-flex flex-row hasMenu"
            :class="{'active': selectedTab == 'search'}"
            @click="selectTab('search')"
        >
            <div class="tab-icon search" />
            {{$filters.localizeText('navigator.tab.search')}}
        </div>
        <div
            class="classic-navigator-sub-menu-tab w-100 d-flex flex-row hasMenu"
            :class="{'active': selectedTab == 'myworld_view'}"
            @click="selectTab('myworld_view')"
        >
            <div class="tab-icon my" />
            {{$filters.localizeText('navigator.searchcode.title.my')}}
        </div>
    </div>
    <Border
        skin="2"
        class="classic-navigator-sub-menu classic-navigator-sub-padding"
        v-if="$store.state.navigator.topLevelContext.code !== 'official_view' && selectedTab"
    >
        <div v-if="selectedTab == 'search'">
            <input v-model="search" class="w-100" />
        </div>
        <div v-if="selectedTab == 'myworld_view'" class="d-flex flex-row">
            <div class="w-100"></div>
            <div class="nav-icon rom" />
        </div>
    </Border>
    <Border
        skin="2"
        class="classic-navigator-sub"
        v-if="!$store.state.app.hotelview && !selectedTab"
        @click="hotelview()"
        :class="{'classic-navigator-sub-padding': $store.state.navigator.topLevelContext.code == 'hotel_view'}"
    >
        <div class="classic-navigator-sub-text d-flex flex-row">
            <div class="classic-navigator-arrow-left wide" />
            {{$filters.localizeText('toolbar.icon.label.exitroom.hotelview')}}
        </div>
    </Border>
</template>