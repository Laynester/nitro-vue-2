<script lang="ts">
import { Nitro, RoomDragEvent } from "@nitrots/nitro-renderer";
import store from "../../../../../utils/store";
import ChatBubble from "../roomChat/chatBubble/ChatBubble.vue";
import { ChatBubbleMessage } from "../roomChat/utils/ChatBubbleMessage";

export default {
    props: ["roomSession"],
    components: { ChatBubble },
    mounted() {
        this.dragControllerDiv();
        Nitro.instance.roomEngine.events.addEventListener(
            RoomDragEvent.ROOM_DRAG,
            this.onDrag.bind(this)
        );
    },
    unmounted() {
        Nitro.instance.roomEngine.events.removeEventListener(
            RoomDragEvent.ROOM_DRAG,
            this.onDrag.bind(this)
        );
    },
    methods: {
        onDrag(event: RoomDragEvent) {
            if (!store.state.room.chat.length) return;

            if (event.roomId !== this.roomSession.roomId) return;

            store.state.room.chat.forEach(chat => {
                if (!chat.elementRef) return;

                chat.left += event.offsetX;
            });
        },
        moveChatUp(chat: ChatBubbleMessage, amount: number) {
            chat.top -= amount;
        },
        makeRoom() {
            store.state.room.chat.forEach(chat => this.moveChatUp(chat, 15));
            setTimeout(() => {
                this.$refs["chatScroll"].scrollTop = this.$refs[
                    "chatScroll"
                ].scrollHeight;
            }, 100);
        },
        dragControllerDiv() {
            let resize = this.$refs["handle"];

            let chat = this.$refs["chat"];

            let history = this.$refs["chatHistory"];

            resize.onmousedown = e => {
                let startY = e.clientY;
                let startPos = history.offsetHeight;
                document.onmousemove = e => {
                    let endY = e.clientY;
                    let move = startPos + endY - startY;

                    history.style.display = "none";

                    if (move > 0) {
                        history.style.height = move + "px";
                        history.style.display = "flex";
                        store.state.room.historyDragged = true;
                    }
                };
                document.onmouseup = () => {
                    if (parseInt(history.style.height, 10) <= 120) {
                        history.style.height = 0;
                        history.style.display = "none";
                        store.state.room.historyDragged = false;
                    }
                    document.onmousemove = null;
                    document.onmouseup = null;
                };
                return false;
            };
        }
    }
};
</script>

<template>
    <div
        class="room-chat-history h-100"
        :class="{'chat-history-visible': $store.state.room.history}"
    >
        <div class="room-chat-history-inner overflow-hidden" ref="chatHistory">
            <div class="h-100 overflow-y-scroll" ref="chatScroll">
                <ChatBubble
                    v-for="(r,i) in $store.state.room.chat"
                    :key="i"
                    :chat="r"
                    @makeroom="makeRoom"
                    :fixed="true"
                />
            </div>
        </div>
        <div class="room-chat-history-handle">
            <div class="room-chat-history-handle-inner" ref="handle" />
        </div>
    </div>
</template>