<script lang="ts">
import { Nitro } from "@nitrots/nitro-renderer";
import store from "../../../../../utils/store";
import {
    RoomWidgetRoomObjectUpdateEvent,
    RoomWidgetUpdateInfostandUserEvent
} from "../../events";
import {
    RoomWidgetChatMessage,
    RoomWidgetChatTypingMessage
} from "../../messages";
export default {
    data() {
        return {
            chatValue: "",
            chatModeIdWhisper: null,
            chatModeIdShout: null,
            chatModeIdSpeak: null,
            selectedUsername: "",
            chatStyleId: 0,
            maxChatLength: 100,
            needsChatStyleUpdate: false,
            isTyping: false,
            isIdle: false,
            typingStartedSent: false
        };
    },
    mounted() {
        this.chatModeIdWhisper = this.$filters.localizeText(
            "widgets.chatinput.mode.whisper"
        );
        this.chatModeIdShout = this.$filters.localizeText(
            "widgets.chatinput.mode.shout"
        );
        this.chatModeIdSpeak = this.$filters.localizeText(
            "widgets.chatinput.mode.speak"
        );
        this.chatStyleId = Nitro.instance.sessionDataManager.chatStyle;

        document.body.addEventListener("keydown", this.onKeyDown.bind(this));

        store.state.room.widgetHandler.eventDispatcher.addEventListener(
            RoomWidgetRoomObjectUpdateEvent.OBJECT_DESELECTED,
            this.onRoomObjectDeselect.bind(this)
        );
        store.state.room.widgetHandler.eventDispatcher.addEventListener(
            RoomWidgetUpdateInfostandUserEvent.PEER,
            this.onRoomWidgetUpdateInfostandUserEvent.bind(this)
        );
    },
    beforeUnmount() {
        document.body.removeEventListener("keydown", this.onKeyDown.bind(this));
    },
    watch: {
        isTyping: function() {
            if (this.isTyping) {
                if (!this.typingStartedSent) {
                    this.typingStartedSent = true;

                    store.state.room.widgetHandler.processWidgetMessage(
                        new RoomWidgetChatTypingMessage(this.isTyping)
                    );
                }
            } else {
                if (this.typingStartedSent) {
                    this.typingStartedSent = false;

                    store.state.room.widgetHandler.processWidgetMessage(
                        new RoomWidgetChatTypingMessage(this.isTyping)
                    );
                }
            }
        },
        isIdle: function() {
            if (!this.isIdle) return;

            let timeout: ReturnType<typeof setTimeout> = null;

            if (this.isIdle) {
                timeout = setTimeout(() => {
                    this.isIdle = false;
                    this.isTyping = false;
                }, 10000);
            }

            return () => clearTimeout(timeout);
        }
    },
    methods: {
        onRoomObjectDeselect() {
            this.selectedUsername = "";
        },
        onRoomWidgetUpdateInfostandUserEvent(
            event: RoomWidgetUpdateInfostandUserEvent
        ) {
            this.selectedUsername = event.name;
        },
        checkFocus() {
            const activeElement = document.activeElement;

            if (!activeElement) return false;

            if (this.$refs["chatInput"] === activeElement) return false;

            if (
                !(activeElement instanceof HTMLInputElement) &&
                !(activeElement instanceof HTMLTextAreaElement)
            )
                return false;

            return true;
        },
        setInputFocus() {
            this.$refs["chatInput"].focus();

            this.$refs["chatInput"].setSelectionRange(
                this.$refs["chatInput"].value.length * 2,
                this.$refs["chatInput"].value.length * 2
            );
        },
        checkSpecialKeywordForInput() {
            if (
                this.chatValue !== this.chatModeIdWhisper ||
                !this.selectedUsername.length
            )
                return this.chatValue;

            this.chatValue = `${this.chatValue} ${this.selectedUsername}`;
        },
        onKeyDown(event: KeyboardEvent) {
            if (!this.$refs["chatInput"] || this.checkFocus()) return;

            if (document.activeElement !== this.$refs["chatInput"])
                this.setInputFocus();

            const value = (event.target as HTMLInputElement).value;

            switch (event.code) {
                case "Space":
                    this.checkSpecialKeywordForInput();
                    return;
                case "NumpadEnter":
                case "Enter":
                    this.sendChatValue(value, event.shiftKey);
                    return;
                case "Backspace":
                    if (value) {
                        const parts = value.split(" ");

                        if (
                            parts[0] === this.chatModeIdWhisper &&
                            parts.length === 3 &&
                            parts[2] === ""
                        ) {
                            this.chatValue = "";
                        }
                    }
                    return;
            }
        },
        sendChat(
            text: string,
            chatType: number,
            recipientName: string = "",
            styleId: number = 0
        ) {
            store.state.room.widgetHandler.processWidgetMessage(
                new RoomWidgetChatMessage(
                    RoomWidgetChatMessage.MESSAGE_CHAT,
                    text,
                    chatType,
                    recipientName,
                    styleId
                )
            );
        },
        updateChatInput(event) {
            if (!this.chatValue) {
                this.isTyping = false;
            } else {
                this.isTyping = true;
                this.isIdle = false;
            }
        },
        sendChatValue(value: string, shiftKey: boolean = false) {
            if (!value || value === "") return;

            let chatType = shiftKey
                ? RoomWidgetChatMessage.CHAT_SHOUT
                : RoomWidgetChatMessage.CHAT_DEFAULT;
            let text = value;

            const parts = text.split(" ");

            let recipientName = "";
            let append = "";

            switch (parts[0]) {
                case this.chatModeIdWhisper:
                    chatType = RoomWidgetChatMessage.CHAT_WHISPER;
                    recipientName = parts[1];
                    append = this.chatModeIdWhisper + " " + recipientName + " ";

                    parts.shift();
                    parts.shift();
                    break;
                case this.chatModeIdShout:
                    chatType = RoomWidgetChatMessage.CHAT_SHOUT;

                    parts.shift();
                    break;
                case this.chatModeIdSpeak:
                    chatType = RoomWidgetChatMessage.CHAT_DEFAULT;

                    parts.shift();
                    break;
            }

            text = parts.join(" ");

            this.isTyping = true;
            this.isIdle = false;

            if (text.length <= this.maxChatLength) {
                if (this.needsChatStyleUpdate) {
                    Nitro.instance.sessionDataManager.sendChatStyleUpdate(
                        this.chatStyleId
                    );

                    this.needsChatStyleUpdate = false;
                }

                this.sendChat(text, chatType, recipientName, this.chatStyleId);
            }

            this.chatValue = append;
        }
    }
};
</script>

<template>
    <teleport to="#room-chat-input">
        <input
            type="text"
            class="w-100"
            ref="chatInput"
            v-model="chatValue"
            :placeholder="$filters.localizeText('widgets.chatinput.default')"
            @keyup="updateChatInput"
        />
    </teleport>
</template>