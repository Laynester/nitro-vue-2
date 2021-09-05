<script lang="ts">
import {
    Nitro,
    NitroEvent,
    RoomEngineTriggerWidgetEvent,
    RoomObjectVariable
} from "@nitrots/nitro-renderer";
import { RoomWidgetRoomObjectUpdateEvent } from "../../../events";
import { FurnitureStickieData } from "./FurnitureStickieData";
import store from "../../../../../../utils/store";
import { getStickieColourName, STICKIE_COLORS } from "./FurnitureStickieUtils";
export default {
    data() {
        return {
            stickieData: "",
            colours: STICKIE_COLORS
        };
    },
    mounted() {
        Nitro.instance.roomEngine.events.addEventListener(
            RoomEngineTriggerWidgetEvent.REQUEST_STICKIE,
            this.onNitroEvent.bind(this)
        );
        store.state.room.widgetHandler.eventDispatcher.addEventListener(
            RoomWidgetRoomObjectUpdateEvent.FURNI_REMOVED,
            this.onNitroEvent.bind(this)
        );
    },
    beforeUnmount() {},
    methods: {
        onNitroEvent(event: NitroEvent) {
            switch (event.type) {
                case RoomEngineTriggerWidgetEvent.REQUEST_STICKIE: {
                    const widgetEvent = event as RoomEngineTriggerWidgetEvent;

                    const roomObject = Nitro.instance.roomEngine.getRoomObject(
                        widgetEvent.roomId,
                        widgetEvent.objectId,
                        widgetEvent.category
                    );

                    if (!roomObject) return;

                    const data = roomObject.model.getValue<string>(
                        RoomObjectVariable.FURNITURE_ITEMDATA
                    );

                    if (data.length < 6) return;

                    let color: string = null;
                    let text: string = null;

                    if (data.indexOf(" ") > 0) {
                        color = data.slice(0, data.indexOf(" "));
                        text = data.slice(data.indexOf(" ") + 1, data.length);
                    } else {
                        color = data;
                    }

                    this.stickieData = new FurnitureStickieData(
                        widgetEvent.objectId,
                        widgetEvent.category,
                        color,
                        text,
                        Nitro.instance.roomSessionManager.getSession(-1)
                            .isRoomOwner ||
                            Nitro.instance.sessionDataManager.isModerator,
                        false
                    );
                    return;
                }
                case RoomWidgetRoomObjectUpdateEvent.FURNI_REMOVED: {
                    const widgetEvent = event as RoomWidgetRoomObjectUpdateEvent;

                    this.stickieData = null;
                    return;
                }
            }
        },
        processAction(type: string, value: string = null) {
            switch (type) {
                case "close":
                    this.stickieData = null;
                    return;
                case "trash":
                    Nitro.instance.roomEngine.deleteRoomObject(
                        this.stickieData.objectId,
                        this.stickieData.category
                    );
                    this.stickieData = null;
                    return;
                case "changeColour":
                    this.stickieData = new FurnitureStickieData(
                        this.stickieData.objectId,
                        this.stickieData.category,
                        value,
                        this.stickieData.text,
                        this.stickieData.canModify
                    );
                    Nitro.instance.roomEngine.modifyRoomObjectData(
                        this.stickieData.objectId,
                        this.stickieData.category,
                        this.stickieData.color,
                        this.stickieData.text
                    );
                    return;
                case "changeText":
                    this.stickieData = new FurnitureStickieData(
                        this.stickieData.objectId,
                        this.stickieData.category,
                        this.stickieData.color,
                        this.stickieData.text,
                        this.stickieData.canModify
                    );
                    Nitro.instance.roomEngine.modifyRoomObjectData(
                        this.stickieData.objectId,
                        this.stickieData.category,
                        this.stickieData.color,
                        this.stickieData.text
                    );
                    return;
                case "editMode":
                    console.log(this.stickieData);
                    if (!this.stickieData.canModify) return;
                    this.stickieData = new FurnitureStickieData(
                        this.stickieData.objectId,
                        this.stickieData.category,
                        this.stickieData.color,
                        this.stickieData.text,
                        this.stickieData.canModify,
                        true
                    );
                    console.log("editing");
                    return;
            }
        }
    },
    computed: {
        getColour() {
            return getStickieColourName(this.stickieData.color);
        }
    }
};
</script>

<template>
    <Card
        skin="stickie"
        class="lstr-classic-stickie lstr-classic-stickie-image"
        :class="`lstr-classic-stickie-image lstr-classic-stickie-${getColour}`"
        v-if="stickieData"
        @clicked="processAction('close')"
    >
        <template v-slot:title>
            <div class="lstr-classic-stickie-image lstr-classic-stickie-trash" />
            <div
                v-for="(c,i) in colours"
                :key="i"
                class="lstr-classic-stickie-color"
                :style="{'background': `#${c}`}"
                @click="processAction('changeColour',c)"
            />
        </template>
        <div class="lstr-classic-stickie-context">
            <div
                class="lstr-classic-stickie-context"
                @click="processAction('editMode')"
                v-if="!stickieData.isEditing"
            >{{stickieData.text}}</div>
            <textarea
                v-else
                class="lstr-classic-stickie-context"
                v-model="stickieData.text"
                @blur="processAction('changeText')"
                tabindex="0"
                autofocus
            />
        </div>
    </Card>
</template>