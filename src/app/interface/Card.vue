<script lang="ts">
export default {
    props: ["skin", "text"],
    data() {
        return {
            positions: {
                clientX: undefined,
                clientY: undefined,
                movementX: 0,
                movementY: 0,
            },
        };
    },
    mounted() {
        if (this.$props.center) {
            this.centerDiv();
        }
    },
    methods: {
        bringToTop() {
            let elements: HTMLCollectionOf<Element> =
                document.getElementsByClassName("classic-card");
            let maxZ = 1;
            if (!elements.length) return;
            for (let element of elements) {
                let ele = element as HTMLElement;
                let z = ele.style.zIndex;
                if (!z || z === undefined || z === null) {
                    z = document.defaultView
                        .getComputedStyle(element, null)
                        .getPropertyValue("z-index");
                    ele.style.zIndex = z;
                }
                if (parseInt(z) > maxZ) maxZ = parseInt(z);
            }
            if (!maxZ) return;
            maxZ++;
            this.$refs["draggableContainer"].style.zIndex = maxZ;
        },
        dragMouseDown: function (event) {
            event.preventDefault();
            // get the mouse cursor position at startup:
            this.positions.clientX = event.clientX;
            this.positions.clientY = event.clientY;
            document.onmousemove = this.elementDrag;
            document.onmouseup = this.closeDragElement;
        },
        elementDrag: function (event) {
            event.preventDefault();
            this.positions.movementX = this.positions.clientX - event.clientX;
            this.positions.movementY = this.positions.clientY - event.clientY;
            this.positions.clientX = event.clientX;
            this.positions.clientY = event.clientY;
            // set the element's new position:
            this.$refs.draggableContainer.style.top =
                this.$refs.draggableContainer.offsetTop -
                this.positions.movementY +
                "px";
            this.$refs.draggableContainer.style.left =
                this.$refs.draggableContainer.offsetLeft -
                this.positions.movementX +
                "px";
        },
        closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
        },
        centerDiv() {
            let div = this.$refs["draggableContainer"];
            let dWidth = div.offsetWidth / 2;
            let bWidth = document.body.offsetWidth / 2;
            let dHeight = div.offsetHeight / 2;
            let bHeight = document.body.offsetHeight / 2;
            div.style.left = bWidth - dWidth + "px";
            div.style.top = bHeight - dHeight + "px";
        },
    },
};
</script>

<template>
    <div
        class="classic-frame d-flex flex-column"
        :skin="skin"
        @mousedown="bringToTop()"
        ref="draggableContainer"
    >
        <div class="classic-frame-header" @mousedown="dragMouseDown">
            <span v-html="text" />
            <div class="classic-frame-close" @click="$emit('clicked')" />
        </div>
        <div class="h-100 card-frame-content d-flex flex-column overflow-hidden">
            <slot />
        </div>
    </div>
</template>