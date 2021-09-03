<script>
import ChatInput from "./chatInput/ChatInput.vue";
import RoomChat from "./roomChat/RoomChat.vue";
import { RoomWidgetListener } from "./RoomWidgetListener";

export default {
    props: ["roomSession"],
    components: { RoomChat, ChatInput },
    mounted() {
        RoomWidgetListener.getInstance();
        RoomWidgetListener.getInstance().load();
    },
    unmounted() {
        RoomWidgetListener.getInstance().reset();
    }
};
</script>

<template>
    <RoomChat :roomSession="roomSession" />
    <ChatInput />
</template>