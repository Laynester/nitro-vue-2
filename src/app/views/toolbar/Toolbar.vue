<script lang="ts">
import {
    Nitro,
    NitroSettingsEvent,
    UserSettingsEvent,
    UserSettingsSoundComposer
} from "@nitrots/nitro-renderer";
export default {
    props: ["hotelview"],
    data() {
        return {
            soundToggle: false
        };
    },
    mounted() {
        Nitro.instance.communication.registerMessageEvent(
            new UserSettingsEvent(this.onUserSettings.bind(this))
        );
    },
    methods: {
        onUserSettings(event: UserSettingsEvent) {
            const parser = event.getParser();
            let amount =
                parser.volumeSystem + parser.volumeFurni + parser.volumeTrax;
            if (amount === 300) this.soundToggle = true;
        },
        handleClick(button) {
            switch (button) {
                case "navigator":
                    this.$store.state.uiVisible.navigator = !this.$store.state
                        .uiVisible.navigator;
                    break;
                case "purse":
                    this.$store.state.uiVisible.purse = !this.$store.state
                        .uiVisible.purse;
                    break;
                case "sound":
                    this.toggleSound();
                    break;
            }
        },
        toggleSound() {
            let event = new NitroSettingsEvent();
            if (this.soundToggle) {
                Nitro.instance.communication.connection.send(
                    new UserSettingsSoundComposer(0, 0, 0)
                );
                event.volumeSystem = 0;
                event.volumeFurni = 0;
                event.volumeTrax = 0;
                this.soundToggle = false;
            } else {
                Nitro.instance.communication.connection.send(
                    new UserSettingsSoundComposer(100, 100, 100)
                );
                event.volumeSystem = 100;
                event.volumeFurni = 100;
                event.volumeTrax = 100;
                this.soundToggle = true;
            }
            Nitro.instance.events.dispatchEvent(event);
        }
    }
};
</script>

<template>
    <div v-if="hotelview" class="lstr-classic-toolbar isLanding">
        <div class="align-items-center d-flex" v-if="!$store.state.app.login">
            <div class="toolbar-icon hc" @click="handleClick('hc')" />
        </div>
        <div class="align-items-center d-flex" v-if="!$store.state.app.login">
            <div class="toolbar-icon console" @click="handleClick('console')" />
            <div class="toolbar-icon friends" @click="handleClick('friends')" />
            <div class="toolbar-icon navigator" @click="handleClick('navigator')" />
            <div class="toolbar-icon events" @click="handleClick('events')" />
            <div class="toolbar-icon catalogue" @click="handleClick('catalogue')" />
            <div class="toolbar-icon purse" @click="handleClick('purse')" />
            <div class="toolbar-icon joystick" @click="handleClick('joystick')" />
            <div class="toolbar-icon help" @click="handleClick('help')" />
        </div>
    </div>
    <div v-else class="lstr-classic-toolbar">
        <div class="align-items-center d-flex w-100" v-if="!$store.state.app.login">
            <div class="w-100" id="room-chat-input" />
        </div>
        <div class="align-items-center d-flex" v-if="!$store.state.app.login">
            <div class="toolbar-icon console" @click="handleClick('console')" />
            <div class="toolbar-icon friends" @click="handleClick('friends')" />
            <div class="toolbar-icon navigator" @click="handleClick('navigator')" />
            <div class="toolbar-icon events" @click="handleClick('events')" />
            <div class="toolbar-icon catalogue" @click="handleClick('catalogue')" />
            <div class="toolbar-icon purse" @click="handleClick('purse')" />
            <div class="toolbar-icon joystick" @click="handleClick('joystick')" />
            <div class="toolbar-icon help" @click="handleClick('help')" />
            <div class="d-flex flex-column toolbar-icon-end">
                <div
                    class="toolbar-icon sound"
                    :class="{'toggled': !soundToggle}"
                    @click="handleClick('sound')"
                />
            </div>
        </div>
    </div>
</template>