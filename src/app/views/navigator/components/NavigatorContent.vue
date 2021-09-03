<script>
import { ResultCode } from "../../../../utils/functions";
import NavigatorCategory from "./NavigatorCategory.vue";
import NavigatorCategoryItem from "./NavigatorCategoryItem.vue";
export default {
    components: { NavigatorCategory, NavigatorCategoryItem },
    methods: {
        resultCode(res) {
            return ResultCode(res);
        },
        spliced() {
            return this.$store.state.navigator.lastSearchResults.slice(1);
        },
    },
};
</script>

<template>
    <div
        v-if="$store.state.navigator.topLevelContext.code == 'official_view'"
        class="h-100 d-flex flex-column overflow-hidden"
    >
        <b
            v-if="$store.state.navigator.topLevelContext.code == 'official_view'"
            class="classic-navigator-category-title"
        >{{$filters.localizeText(resultCode($store.state.navigator.lastSearchResults[0]))}}</b>
        <div class="classic-navigator-category overflow-y-scroll h-100">
            <NavigatorCategory
                v-for="(r,i) in $store.state.navigator.lastSearchResults"
                :result="r"
                :key="i"
                :index="i"
                :tab="$store.state.navigator.topLevelContext.code"
            />
        </div>
    </div>
    <div
        v-else-if="$store.state.navigator.topLevelContext.code == 'hotel_view'"
        class="h-100 d-flex flex-column overflow-hidden"
    >
        <NavigatorCategory
            :result="$store.state.navigator.lastSearchResults[0]"
            :index="0"
            :tab="$store.state.navigator.topLevelContext.code"
        />
        <div class="overflow-y-scroll classic-navigator-category h-100">
            <NavigatorCategory
                v-for="(r,i) in spliced()"
                :result="r"
                :key="i"
                :index="i + 1"
                :tab="$store.state.navigator.topLevelContext.code"
            />
        </div>
    </div>
    <div
        v-else-if="$store.state.navigator.topLevelContext.code == 'myworld_view'"
        class="h-100 d-flex flex-column overflow-hidden"
    >
        <div class="overflow-y-scroll classic-navigator-category h-100">
            <NavigatorCategory
                v-for="(r,i) in $store.state.navigator.lastSearchResults"
                :result="r"
                :key="i"
                :index="i + 1"
                :tab="$store.state.navigator.topLevelContext.code"
            />
        </div>
    </div>
</template>