<script lang="ts">
export default {
    props: ["fly", "frames"],
    data() {
        return {
            ani: 1
        };
    },
    mounted() {
        setTimeout(this.tick.bind(this), 10);
    },
    methods: {
        tick() {
            let t = 4;
            if (this.fly == "3") t = 2;
            setTimeout(this.tick.bind(this), t * 1000);
            if (this.ani == parseInt(this.$props.frames)) return (this.ani = 1);

            this.ani += 1;
        }
    }
};
</script>

<template>
    <div :class="`lstr-classic-purse-fly`" :frame="ani" :fly="fly" ref="flyRef" />
</template>