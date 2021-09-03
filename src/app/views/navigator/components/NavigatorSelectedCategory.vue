<script>
import NavigatorCategoryItem from "./NavigatorCategoryItem.vue";
export default {
    components: { NavigatorCategoryItem },
};
</script>

<template>
    <Border
        skin="2"
        class="classic-navigator-sub h-100 d-flex flex-column overflow-hidden"
        v-if="$store.state.navigator.selectedCategory"
        :class="{'hasSubmenu isSubCategory': $store.state.navigator.selectedTab,'classic-navigator-sub-padding': $store.state.app.hotelview && $store.state.navigator.topLevelContext.code !== 'official_view' && !$store.state.navigator.selectedTab}"
    >
        <div
            class="classic-navigator-sub-text d-flex flex-row"
            @click="$store.state.navigator.selectedCategory = null"
        >
            <div class="classic-navigator-arrow-left wide" />
            {{ $filters.localizeText(`navigator.toplevelview.${$store.state.navigator.topLevelContext.code}`) }}
        </div>
        <Border skin="1" class="h-100 classic-navigator-body d-flex flex-column overflow-hidden">
            <div class="classic-navigator-category h-100 overflow-y-scroll">
                <NavigatorCategoryItem
                    v-for="(r,i) in $store.state.navigator.selectedCategory.rooms"
                    :key="i"
                    :room="r"
                />
            </div>
        </Border>
    </Border>
</template>