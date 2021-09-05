<script lang="ts">
import { AppListener } from "../../AppListener";
export default {
    methods: {
        reload() {
            window.location.reload();
        }
    }
};
</script>

<template>
    <div class="lstr-classic-disconnected">
        <div class="lstr-classic-disconnected-box d-flex flex-column">
            <b class="d-block">{{$filters.localizeText('disconnected.title')}}</b>
            <div class="w-100">{{$filters.localizeText('disconnected.message')}}</div>
            <div
                class="mt-auto align-self-end"
                @click="reload()"
            >{{$filters.localizeText('disconnected.reload')}}</div>
        </div>
    </div>
</template>