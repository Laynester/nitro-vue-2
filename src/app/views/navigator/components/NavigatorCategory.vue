<script lang="ts">
import { ResultCode } from "../../../../utils/functions";
import NavigatorCategoryItem from "./NavigatorCategoryItem.vue";
export default {
    components: { NavigatorCategoryItem },
    props: ["index", "result", "tab"],
    methods: {
        selectCategory() {
            this.$store.state.navigator.selectedCategory = this.result;
        }
    },
    computed: {
        resultCode() {
            return ResultCode(this.result);
        },
        colour() {
            let obj = this.result.rooms;

            let users = 0;

            let max = 0;

            obj.forEach(e => {
                users += e.userCount;
                max += e.maxUserCount;
            });

            const num = 100 * (users / max);

            let colour = "dark";

            if (num >= 92) {
                colour = "red";
            } else if (num >= 80) {
                colour = "orange";
            } else if (num >= 50) {
                colour = "yellow";
            } else if (num > 0) {
                colour = "green";
            }

            return colour;
        }
    }
};
</script>

<template>
    <div class="d-flex flex-column" v-if="tab == 'official_view'">
        <template v-if="index == '0'">
            <NavigatorCategoryItem v-for="(r,i) in result.rooms" :key="i" :room="r" />
        </template>
        <Border skin="3" class="d-flex dark" v-else @click="selectCategory()" :class="colour">
            <div class="w-100">{{$filters.localizeText(resultCode)}}</div>
            <div class="lstr-classic-navigator-arrow-right wide" />
        </Border>
    </div>
    <div v-else-if="tab == 'hotel_view' || tab == 'myworld_view'" class="d-flex-flex-column">
        <template v-if="index == '0'">
            <b class="lstr-classic-navigator-category-title">{{$filters.localizeText(resultCode)}}</b>
            <div class="overflow-y-scroll lstr-classic-navigator-single-category">
                <NavigatorCategoryItem v-for="(r,i) in result.rooms" :key="i" :room="r" />
            </div>
        </template>
        <Border skin="3" class="d-flex dark" v-else @click="selectCategory()" :class="colour">
            <div class="w-100">{{$filters.localizeText(resultCode)}}</div>
            <div class="lstr-classic-navigator-arrow-right wide" />
        </Border>
    </div>
    <div v-else class="d-flex flex-column">
        <NavigatorCategoryItem v-for="(r,i) in result.rooms" :key="i" :room="r" />
    </div>
</template>