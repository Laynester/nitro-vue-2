<script lang="ts">
import {
    Nitro,
    RoomEngineEvent,
    RoomId,
    RoomSessionEvent,
} from "@nitrots/nitro-renderer";
import RoomView from "./RoomView.vue";
export default {
    components: { RoomView },
    data() {
        return {
            roomSession: null,
        };
    },
    mounted() {
        Nitro.instance.roomEngine.events.addEventListener(
            RoomEngineEvent.INITIALIZED,
            this.onRoomEngineEvent.bind(this)
        );
        Nitro.instance.roomEngine.events.addEventListener(
            RoomEngineEvent.DISPOSED,
            this.onRoomEngineEvent.bind(this)
        );
        //
        Nitro.instance.roomSessionManager.events.addEventListener(
            RoomSessionEvent.CREATED,
            this.onRoomSessionEvent.bind(this)
        );
        Nitro.instance.roomSessionManager.events.addEventListener(
            RoomSessionEvent.ENDED,
            this.onRoomSessionEvent.bind(this)
        );
    },
    unmounted() {
        Nitro.instance.roomEngine.events.removeEventListener(
            RoomEngineEvent.INITIALIZED,
            this.onRoomEngineEvent.bind(this)
        );
        Nitro.instance.roomEngine.events.removeEventListener(
            RoomEngineEvent.DISPOSED,
            this.onRoomEngineEvent.bind(this)
        );
    },
    methods: {
        onRoomEngineEvent(event: RoomEngineEvent) {
            if (RoomId.isRoomPreviewerId(event.roomId)) return;

            const session =
                Nitro.instance.roomEngine.roomSessionManager.getSession(-1);

            if (!session) return;

            switch (event.type) {
                case RoomEngineEvent.INITIALIZED:
                    Nitro.instance.roomEngine.setActiveRoomId(event.roomId);
                    this.roomSession = session;
                    return;
                case RoomEngineEvent.DISPOSED:
                    this.roomSession = null;
                    return;
            }
        },
        onRoomSessionEvent(event: RoomSessionEvent) {
            switch (event.type) {
                case RoomSessionEvent.CREATED:
                    Nitro.instance.roomEngine.roomSessionManager.startSession(
                        event.session
                    );
                    return;
                case RoomSessionEvent.ENDED:
                    this.roomSession = null;
                    return;
            }
        },
    },
};
</script>

<template>
    <div class="classic-room w-100 h-100 overflow-hidden">
        <RoomView :roomSession="roomSession" v-if="roomSession" />
    </div>
</template>