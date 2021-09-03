<script lang="ts">
export default {
    props: ["chat"],
    mounted() {
        const element = this.$refs["bubble"];

        if (!element) return;

        const width = element.offsetWidth;
        const height = element.offsetHeight;

        this.chat.width = width;
        this.chat.height = height;
        this.chat.elementRef = element;

        let left = this.chat.left;
        let top = this.chat.top;

        if (!left && !top) {
            left = this.chat.location.x - width / 2;
            top = element.parentElement.offsetHeight - height;

            this.chat.left = left;
            this.chat.top = top;
        }

        if (!this.chat.visible) {
            this.$emit("makeroom", this.chat);

            this.chat.visible = true;
        }
    },
};
</script>

<template>
    <div class="bubble-container" ref="bubble">
        <div class="bubble-container-userbg" :style="{'background-color': chat.color}" />
        <div class="bubble" :bubble="chat.styleId" :type="chat.type">
            <div class="bubble-user">
                <div
                    class="bubble-user-image"
                    :style="{'background-image':`url(${chat.imageUrl})`}"
                />
            </div>
            <div class="bubble-content">
                <span class="bubble-username" v-html="`${chat.username}: `" />
                <span class="bubble-message">{{ chat.text }}</span>
            </div>
            <div class="bubble-pointer"></div>
        </div>
    </div>
</template>