<script lang="ts">
import { AppListener } from "./AppListener";
import Loading from "./views/loading/Loading.vue";
import Main from "./views/main/Main.vue";

export default {
    components: { Loading, Main },
    mounted() {
        AppListener.getInstance();
    },
};
</script>

<template>
    <div class="nitro-classic">
        <Loading v-if="!$store.state.app.isReady" />
        <Main v-if="$store.state.app.isReady" />
    </div>
</template>
