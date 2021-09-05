<script lang="ts">
import store from "../utils/store";
import { AppListener } from "./AppListener";
import Authenticate from "./views/authenticate/Authenticate.vue";
import Disconnected from "./views/disconnected/Disconnected.vue";
import Loading from "./views/loading/Loading.vue";
import Main from "./views/main/Main.vue";

export default {
    components: { Loading, Main, Disconnected, Authenticate },
    mounted() {
        //@ts-ignore
        if (NitroConfig.sso) AppListener.getInstance();
        else {
            store.state.app.login = true;
        }
    }
};
</script>

<template>
    <Loading v-if="!$store.state.app.isReady" />
    <Main v-if="$store.state.app.isReady" />
    <Disconnected v-if="$store.state.app.isError" />
    <Authenticate v-if="$store.state.app.texts" />
</template>
