
<script lang="ts">
import NavigatorCategory from "./components/NavigatorCategory.vue";
import { NavigatorListener } from "./NavigatorListener";
import NavigatorContent from "./components/NavigatorContent.vue";
import { ResultCode } from "../../../utils/functions";
import NavigatorCategoryItem from "./components/NavigatorCategoryItem.vue";
import NavigatorTabs from "./components/NavigatorTabs.vue";
import NavigatorSubMenu from "./components/NavigatorSubMenu.vue";
import NavigatorSelectedCategory from "./components/NavigatorSelectedCategory.vue";
export default {
    components: {
        NavigatorCategory,
        NavigatorContent,
        NavigatorCategoryItem,
        NavigatorTabs,
        NavigatorSubMenu,
        NavigatorSelectedCategory,
    },
    mounted() {
        if (!this.$store.state.navigator.isLoaded)
            NavigatorListener.getInstance().loadNavigator();

        NavigatorListener.getInstance().search();
    },
    methods: {
        resultCode(res) {
            return ResultCode(res);
        },
    },
};
</script>

<template>
    <Card
        skin="0"
        :text="$filters.localizeText('navigator.title')"
        center="false"
        class="classic-navigator"
        v-if="$store.state.navigator.topLevelContext && $store.state.uiVisible.navigator"
        @clicked="$store.state.uiVisible.navigator = false;"
    >
        <NavigatorTabs />
        <NavigatorSubMenu />
        <Border
            skin="1"
            class="h-100 classic-navigator-body d-flex flex-column overflow-hidden"
            v-if="$store.state.navigator.lastSearchResults.length && !$store.state.navigator.selectedCategory"
            :class="{'hasSubmenu': ($store.state.navigator.selectedTab || $store.state.app.hotelview && $store.state.navigator.topLevelContext.code !== 'official_view')}"
        >
            <NavigatorContent />
        </Border>
        <NavigatorSelectedCategory />
        <Border skin="2" class="classic-navigator-info">
            <div class="classic-navigator-info-content"></div>
        </Border>
    </Card>
</template>