<script lang="ts">
import ChatHistory from "./chatHistory/ChatHistory.vue";
import ChatInput from "./chatInput/ChatInput.vue";
import RoomChat from "./roomChat/RoomChat.vue";
import { RoomWidgetListener } from "./RoomWidgetListener";

export default {
    props: ["roomSession"],
    components: { RoomChat, ChatInput, ChatHistory },
    mounted() {
        RoomWidgetListener.getInstance();
        RoomWidgetListener.getInstance().setHandler(
            this.$store.state.room.widgetHandler
        );
    }
};
</script>

<template>
    <RoomChat :roomSession="roomSession" />
    <ChatHistory :roomSession="roomSession" />
    <ChatInput />
</template>