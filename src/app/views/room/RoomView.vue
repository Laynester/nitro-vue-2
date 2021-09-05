<script lang="ts">
import {
    EventDispatcher,
    Nitro,
    NitroRectangle,
    RoomGeometry,
    RoomVariableEnum,
    RoomZoomEvent,
    Vector3d
} from "@nitrots/nitro-renderer";
import { RoomWidgetHandlerManager } from "./handlers";
import { DispatchMouseEvent } from "../../../utils/functions";
import { RoomWidgetChatHandler, RoomWidgetChatInputHandler } from "./handlers";
import RoomWidgets from "./widgets/RoomWidgets.vue";
import { RoomWidgetUpdateRoomViewEvent } from "./events";
import RoomLoader from "./widgets/loader/RoomLoader.vue";
import store from "../../../utils/store";

export default {
    components: { RoomWidgets, RoomLoader },
    props: ["roomSession"],
    data() {
        return {
            roomCanvas: null,
            canvasId: null,
            widgetHandler: null,
            ready: false
        };
    },
    mounted() {
        this.load();
    },
    beforeUnmount() {
        //
    },
    methods: {
        load() {
            if (this.$store.state.room.widgetHandler) {
                this.$store.state.room.widgetHandler.dispose();
                this.$store.state.room.widgetHandler = null;
            }

            const widgetHandlerManager = new RoomWidgetHandlerManager(
                this.roomSession,
                new EventDispatcher()
            );

            widgetHandlerManager.registerHandler(new RoomWidgetChatHandler());

            widgetHandlerManager.registerHandler(
                new RoomWidgetChatInputHandler()
            );

            this.widgetHandler = widgetHandlerManager;

            this.$store.state.room.widgetHandler = widgetHandlerManager;

            let width = this.$refs["roomContainer"].offsetWidth;
            let height = this.$refs["roomContainer"].offsetHeight;

            Nitro.instance.renderer.resize(width, height);

            const canvasId = 1;

            const displayObject = Nitro.instance.roomEngine.getRoomInstanceDisplay(
                this.roomSession.roomId,
                canvasId,
                Nitro.instance.width,
                Nitro.instance.height,
                RoomGeometry.SCALE_ZOOMED_IN
            );

            if (!displayObject) return;

            const geometry = Nitro.instance.roomEngine.getRoomInstanceGeometry(
                this.roomSession.roomId,
                canvasId
            ) as RoomGeometry;

            if (geometry) {
                const minX =
                    Nitro.instance.roomEngine.getRoomInstanceVariable<number>(
                        this.roomSession.roomId,
                        RoomVariableEnum.ROOM_MIN_X
                    ) || 0;
                const maxX =
                    Nitro.instance.roomEngine.getRoomInstanceVariable<number>(
                        this.roomSession.roomId,
                        RoomVariableEnum.ROOM_MAX_X
                    ) || 0;
                const minY =
                    Nitro.instance.roomEngine.getRoomInstanceVariable<number>(
                        this.roomSession.roomId,
                        RoomVariableEnum.ROOM_MIN_Y
                    ) || 0;
                const maxY =
                    Nitro.instance.roomEngine.getRoomInstanceVariable<number>(
                        this.roomSession.roomId,
                        RoomVariableEnum.ROOM_MAX_Y
                    ) || 0;

                let x = (minX + maxX) / 2;
                let y = (minY + maxY) / 2;

                const offset = 20;

                x = x + (offset - 1);
                y = y + (offset - 1);

                const z =
                    Math.sqrt(offset * offset + offset * offset) *
                    Math.tan((30 / 180) * Math.PI);

                geometry.location = new Vector3d(x, y, z);
            }

            const stage = Nitro.instance.stage;

            if (!stage) return;

            stage.addChild(displayObject);

            const canvas = Nitro.instance.renderer.view;

            if (!canvas) return;

            canvas.onclick = event =>
                DispatchMouseEvent(this.roomSession.roomId, canvasId, event);
            canvas.onmousemove = event =>
                DispatchMouseEvent(this.roomSession.roomId, canvasId, event);
            canvas.onmousedown = event =>
                DispatchMouseEvent(this.roomSession.roomId, canvasId, event);
            canvas.onmouseup = event =>
                DispatchMouseEvent(this.roomSession.roomId, canvasId, event);

            window.onresize = () => {
                Nitro.instance.renderer.resize(width, height);
                Nitro.instance.roomEngine.initializeRoomInstanceRenderingCanvas(
                    this.roomSession.roomId,
                    canvasId,
                    width,
                    height
                );
                const bounds = canvas.getBoundingClientRect();
                const rectangle = new NitroRectangle(
                    bounds.x || 0,
                    bounds.y || 0,
                    bounds.width || 0,
                    bounds.height || 0
                );
                widgetHandlerManager.eventDispatcher.dispatchEvent(
                    new RoomWidgetUpdateRoomViewEvent(
                        RoomWidgetUpdateRoomViewEvent.SIZE_CHANGED,
                        rectangle
                    )
                );
                Nitro.instance.render();
            };

            setTimeout(() => {
                if (stage.width >= width - 100) {
                    Nitro.instance.roomEngine.events.dispatchEvent(
                        new RoomZoomEvent(this.roomSession.roomId, 0.5, false)
                    );
                }
            }, 30);

            if (Nitro.instance.getConfiguration("interstitials")["enabled"]) {
                setTimeout(() => {
                    this.ready = true;
                    store.state.room.info = null;
                }, Nitro.instance.getConfiguration("interstitials")["delay.seconds"] * 1000);
            } else {
                this.ready = true;
            }

            this.roomCanvas = canvas;
            this.$refs["roomContainer"].appendChild(canvas);
        }
    }
};
</script>

<template>
    <div class="lstr-classic-room-view h-100 position-relative">
        <div ref="roomContainer" class="lstr-classic-room-container h-100" />
        <RoomWidgets v-if="widgetHandler" :roomSession="roomSession" />
    </div>
    <RoomLoader v-if="!ready" />
</template>