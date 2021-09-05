<script lang="ts">
import { NavigatorListener } from "../NavigatorListener";
export default {
    props: ["room"],
    computed: {
        roomColour() {
            const num = 100 * (this.room.userCount / this.room.maxUserCount);

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
    },
    methods: {
        openRoom() {
            NavigatorListener.getInstance().goToRoom(this.room.roomId);
        }
    }
};
</script>

<template>
    <div class="d-flex flex-row" v-if="room">
        <Border skin="3" class="w-100 cursor-pointer">{{room.roomName}}</Border>
        <Border
            skin="3"
            class="lstr-classic-navigator-go text-right d-flex flex-row justify-content-end cursor-pointer"
            :class="roomColour"
            @click="openRoom()"
        >
            {{$filters.localizeText('navigator.room.popup.go')}}
            <div class="lstr-classic-navigator-arrow-right" />
        </Border>
    </div>
</template>