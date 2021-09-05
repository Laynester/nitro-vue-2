<script lang="ts">
import { Nitro, RoomSessionEvent } from "@nitrots/nitro-renderer";
import Hotelview from "../hotelview/Hotelview.vue";
import Toolbar from "../toolbar/Toolbar.vue";
import Room from "../room/Room.vue";
import Navigator from "../navigator/Navigator.vue";
import { NavigatorListener } from "../navigator/NavigatorListener";
import Purse from "../purse/Purse.vue";

export default {
    components: { Hotelview, Toolbar, Room, Navigator, Purse },
    mounted() {
        Nitro.instance.roomSessionManager.events.addEventListener(
            RoomSessionEvent.CREATED,
            this.handler.bind(this)
        );

        Nitro.instance.roomSessionManager.events.addEventListener(
            RoomSessionEvent.ENDED,
            this.handler.bind(this)
        );

        NavigatorListener.getInstance();

        Nitro.instance.communication.connection.onReady();
    },
    methods: {
        handler(event: RoomSessionEvent) {
            switch (event.type) {
                case RoomSessionEvent.CREATED:
                    this.$store.state.app.hotelview = false;
                    return;
                case RoomSessionEvent.ENDED:
                    this.$store.state.app.hotelview = true;
                    return;
            }
        }
    }
};
</script>

<template>
    <div class="lstr-classic-main d-flex h-100 justify-content-between flex-column">
        <Hotelview v-if="$store.state.app.hotelview" />
        <Room />
        <Navigator />
        <Purse />
        <Toolbar :hotelview="$store.state.app.hotelview" />
    </div>
</template>
