<script>
export default {
    props: ["hotelview"],
    methods: {
        handleClick(button) {
            switch (button) {
                case "navigator":
                    this.$store.state.uiVisible.navigator = !this.$store.state
                        .uiVisible.navigator;
                    break;
            }
        }
    }
};
</script>

<template>
    <div v-if="hotelview" class="classic-toolbar isLanding">
        <div class="align-items-center d-flex">
            <div class="toolbar-icon hc" @click="handleClick('hc')" />
        </div>
        <div class="align-items-center d-flex">
            <div class="toolbar-icon console" @click="handleClick('console')" />
            <div class="toolbar-icon friends" @click="handleClick('friends')" />
            <div class="toolbar-icon navigator" @click="handleClick('navigator')" />
            <div class="toolbar-icon events" @click="handleClick('events')" />
            <div class="toolbar-icon catalogue" @click="handleClick('catalogue')" />
            <div class="toolbar-icon joystick" @click="handleClick('joystick')" />
            <div class="toolbar-icon help" @click="handleClick('help')" />
        </div>
    </div>
    <div v-else class="classic-toolbar">
        <div class="align-items-center d-flex w-100">
            <div class="w-100" id="room-chat-input" />
        </div>
        <div class="align-items-center d-flex">
            <div class="toolbar-icon console" @click="handleClick('console')" />
            <div class="toolbar-icon friends" @click="handleClick('friends')" />
            <div class="toolbar-icon navigator" @click="handleClick('navigator')" />
            <div class="toolbar-icon events" @click="handleClick('events')" />
            <div class="toolbar-icon catalogue" @click="handleClick('catalogue')" />
            <div class="toolbar-icon joystick" @click="handleClick('joystick')" />
            <div class="toolbar-icon help" @click="handleClick('help')" />
        </div>
    </div>
</template>