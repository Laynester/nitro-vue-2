<script lang="ts">
import ChatHistory from "./chatHistory/ChatHistory.vue";
import ChatInput from "./chatInput/ChatInput.vue";
import Stickie from "./furniture/stickie/Stickie.vue";
import RoomChat from "./roomChat/RoomChat.vue";
import { RoomWidgetListener } from "./RoomWidgetListener";

export default {
    props: ["roomSession"],
    components: { RoomChat, ChatInput, ChatHistory, Stickie },
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
    <Stickie />
</template>